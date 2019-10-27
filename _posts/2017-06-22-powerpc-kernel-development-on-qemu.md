---
layout: post
title: Kernel development using qemu
excerpt: "Hack, build, boot kernel on a powerpc using qemu"
categories: articles
tags: [kernel, boot, fedora, powerpc, linux]
comments: true
share: true
modified: 2017-07-05T12:26:46+05:30
author: santosh
series: "Kernel development using qemu"
---

## Build Qemu

Using qemu from the standard installation does not seem to work. Always gives a
illegal instruction error and the kernel panics.

```console
$ git clone git://git.qemu-project.org/qemu.git
$ cd qemu
$ ./configure --target-list=ppc64-softmmu
$ make
```

The standard qemu packages did not work probably they didn't have the
`ppc64-softmmu` selected. Enabling `ppc64-softmmu` was
mentioned
[here](http://jk.ozlabs.org/blog/post/157/powerpc-testing-without-powerpc-hardware/).
Make sure the newly built qemu-system-ppc64 image, which is under ppc64-softmmu
directory is in your path.

## Installation

Now that we have built qemu, lets use it to install a fedora 25
distribution. Note that we won't get a shiny GUI for installation, we will have
to use a serial console to do installation in text mode.

```console
$ qemu-system-ppc64 -M pseries -m 2048 -nodefaults -nographic \
  -serial pty -monitor stdio \-cdrom Fedora-Server-dvd-ppc64le-25-1.2.iso \
  -drive file=ppc.img,if=virtio -s
```

We could give the boot target in the command line, but the openfirmware
always looks at the drive, even if you had give `-boot c` in the commandline. So
when the boot fails, and when its stopped in the openfirmware prompt, type `boot
cdrom` to boot the fedora image. Now it's the usual installation process except
you will have to do it in text mode, but thats fun too.

We haven't configured network yet. Once the installation has completed, reboot
your qemu, now without any firmware prompt, we should boot out newly installed
system. Once it boots, poweroff and let's enable networking.

Since we have installed the OS, we need not specify the `-cdrom` option to
qemu. I will drop it from subsequent commands. For networking, we append `-net
nic,model=virtio` to the command line. Also if we want to be able to ssh into
the guest, we can add a `hostfwd` option too.

```console
$ qemu-system-ppc64 -M pseries -m 2048 -nodefaults -nographic -serial pty \
  -monitor stdio -drive file=ppc.img,if=virtio -s -net nic,model=virtio \
  -net user,hostfwd=tcp::2222-:22
```

Once this is done, we will have the access to the outside network, which is very
helpful when we want to update of install any package. Also, we can login to the
guest using ssh.

```console
$ ssh root@localhost -p 2222
```

For more convinience we can create a user with the same name as the host user
that we are logged into, and configure password less login using
`ssh-copy-id`. A must for people lazy to type password all the time.

## Kernel development

Even though we cannot expect a qemu machine to have all the features on a real
hardware, but nonetheless it can be used for boot testing and basic sanity
testing. First thing to boot a new kernel is to build it. But running a machine
of a different architecture as that of the host is very CPU intensive. So we
should avoid running heavy workloads on the guest. As we know, building a kernel
is also one such CPU intensive activity. Here comes the usefulness of
cross-compiling.

I am running a fedora 25 X86_64 machine, with a fedora 25 ppc64 guest on it. So
we will install powerpc cross-compile toolchain for our purpose. Here what I
have in my machine. Depending on the distribution the installation procedure
might vary. Once the installation is done, the rest is just a breeze.

```console
$ rpm -qa | grep powerpc
binutils-powerpc64le-linux-gnu-2.27-3.fc25.x86_64
gcc-powerpc64-linux-gnu-6.1.1-2.fc25.x86_64
binutils-powerpc64-linux-gnu-2.27-3.fc25.x86_64
```

Export `CROSS_COMPILE` toolchain path and the architecture - `ARCH`.

```console
$ export CROSS_COMPILE=powerpc64-linux-gnu-
$ export ARCH=powerpc
$ make pseries_defconfig
$ make -j4
```

If you don't want to pollute your kernel source directory, maybe you want to
build and test for multiple architectures, you can pass the
`O=/path/to/build/dir` option to `make`.

```console
$ mkdir ../powerpc_build
$ make O=../powerpc_build pseries_defconfig
$ make O=../powerpc_build -j4
```

## Booting the kernel

When we are trying to boot a custom kernel, we will not be (?) able to use the
disk image we created as rootfs. We will have to pass the the rootfs and initrd
from the commandline. One reason we would not be able to boot, even if we manage
to get the rootfs from the disk image is because the kernel modules' version
will be different. For our just boot and test purpose we will create a tiny
initrd from BusyBox. I am not cross-compiling BusyBox, you may try it
ofcourse. The reason being most of the time we will have some headers missing
problem. Let us fire up of qemu machine and compile.

```console
$ git clone git://busybox.net/busybox.git
$ cd busybox
$ make menuconfig
$ make
```

You may want to install gcc if not available. During `make menuconfig`, in
'Busybox settings' menu, select 'Build Busybox as a static binary' option. This
will avoid shared library mess in our to-be build initrd. Once this is done, we
install it, the default path would be `./_install`.

```console
$ make install
```

Now `tar` the `_install` directory and copy it over to the host machine using
`scp`. Now we are ready to create the `initrd`. The basic steps to create a
ramdisk are:

  - Create a raw image using `dd`
  - Format image with ext4
  - Mount and copy all the needed files
  - Umount and gzip the image

```console
$ tar cf _install.tar
$ dd if=/dev/zero of=initrd.img bs=1M count=10   # 10 MB image
$ mkfs.ext4 initrd.img
$ mkdir root
$ sudo mount initrd.img root/
$ sudo cp _install/* root/
$ sudo cp -a /dev/console initrd/dev/
$ sudo cp -a /dev/null initrd/dev/
$ sudo cp -a /dev/tty0 initrd/dev/
$ sudo cp -a /dev/tty1 initrd/dev/
$ sudo umount root/
$ gzip initrd.img
```

Finally,

```console
$ qemu-system-ppc64 -M pseries -m 2048 -smp cores=2 -nodefaults -nographic \
  -serial pty -monitor stdio -s -net nic,model=virtio \
  -net user,hostfwd=tcp::2222-:22  -kernel vmlinux \
  -initrd initrd/initrd.img.gz -append root=/dev/ram0
```

..and we are done!.

[Part 2](/articles/powerpc-kernel-development-on-qemu-2/) talks more about kernel development on qemu
