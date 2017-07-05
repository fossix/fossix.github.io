---
layout: post
title: More kernel development using qemu
excerpt: "Building and booting a full distro kernel on qemu for powerpc"
categories: articles
tags: [kernel, boot, fedora, powerpc, linux, nfs, compilation]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2017-07-22T11:59:05+05:30
author: santosh
---

[Part 1](/articles/powerpc-kernel-development-on-qemu/) of this series introduces
kernel development on qemu.

# Building a distro kernel

Using a tiny busybox based initrd is fine for boot testing. But sometimes you
also need a more full fledged distribution to do more. A few usecases might be

  - Run kernel self tests
  - Test if libraries still work fine with kernel changes
  - Benchmark a code path
  
To achieve this we can simply boot a cross-compiled kernel with a image
installed with distro image. But that will not work, since we the `initrd`
should have the required modules to mount filesystems and other
functionalities. So our tiny `initrd` won't be of any help here.

```console
$ qemu-system-ppc64 -M pseries -m 2048 -smp cores=2 -nodefaults \
 -nographic -serial pty -monitor stdio -drive file=ppc.img,if=virtio \
 -s -net nic,model=virtio -net user,hostfwd=tcp::2222-:22 \
 -kernel vmlinux -initrd initrd.img -append "root=/dev/vda5"
```

The alternative is to compile the kernel and install it from inside the qemu
instance itself. If you had read the
previous
[article](http://www.fossix.org/articles/powerpc-kernel-development-on-qemu/),
we had compiled busybox, which took more than twice the time it took for
buiding on a native machine. So how do we tackle this issue? It's again just to
do with cross-compiling and installation. This time we would cross compile in
the host machine with the distro config, and do `make install` in the guest
machine.

How is this possible?

NFS to the rescue. The usual NFS setup is done on the host, mounted on the
guest. Now we can work on the kernel from two different machines, based on what
we need.

## NFS Setup

On host:

```console
$ sudo echo "/path/to/kernel/source  *(rw,sync,no_root_squash,insecure) >> /etc/exports
$ sudo systemctl restart nfs
```

On guest:

```console
$ showmount -e 10.0.2.2 # host ip address
$ mount 10.0.2.2:/path/to/kernel/source /local-mount
```

**Remember to stop nfs on host when done**, since we are allowing all machines to
access the mount point. To restrict to a particular machine (the guest), give
its IP address in place of `*` in `/etc/exports`.

Now, we can configure the kernel with the distro's config.

## Compiling and installing the kernel

```console
$ # on the guest
$ make oldconfig
```

We can also continue with compiling the kernel, but it will be terribly slow. So
we start cross compiling in the host.

```console
$ # on the host
$ cd /path/to/kernel/source
$ export ARCH=powerpc
$ export CROSS_COMPILE=powerpc64-linux-gnu-
$ make -j4
```

We can also do the kernel and modules installation from the host. For this, we
need to mount the guest filesystem in the host. This depends on the type of disk
image we used, and whether we have separate partitions for each.

This can be found with help of two commands, `fdisk` and `file`. The following
are from my setup of how I have the images.

```console
$ # On host
$ file ppc.img
ppc.img: DOS/MBR boot sector; partition 1 : ID=0x41, active, start-CHS (0x4,4,1), end-CHS (0x14,19,2), startsector 2048, 8192 sectors; partition 2 : ID=0x83, start-CHS (0x14,20,1), end-CHS (0x3ff,254,2), startsector 10240, 2097152 sectors; partition 3 : ID=0x82, start-CHS (0x3ff,254,2), end-CHS (0x3ff,254,2), startsector 2107392, 4388864 sectors; partition 4 : ID=0x5, start-CHS (0x3ff,254,2), end-CHS (0x3ff,254,2), startsector 6496256, 77389824 sectors
$ fdisk -l ppc.img
Disk ppc.img: 40 GiB, 42949672960 bytes, 83886080 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x100065c2

Device     Boot   Start      End  Sectors  Size Id Type
ppc.img1   *       2048    10239     8192    4M 41 PPC PReP Boot
ppc.img2          10240  2107391  2097152    1G 83 Linux
ppc.img3        2107392  6496255  4388864  2.1G 82 Linux swap / Solaris
ppc.img4        6496256 83886079 77389824 36.9G  5 Extended
ppc.img5        6498304 37955583 31457280   15G 83 Linux
```

Using this information, we can mount the boot partition. From the above commands
we can see two important information, one is the sector size (512 bytes, which
is standard size in the linux kernel so far). The other is the sector start of
the boot partition (ppc.img2, 10240). How do you know this is boot? Use `df -h`
in the guest to find out which is the `/boot` partition.

We will use the `offset` option to mount to specify the `/boot` partition. In
this case, the start sector is 10240, so the byte offset will be 5242880
(10240 * 512).

```console
$ mount -o loop,offset=5242880 ppc.img guest-boot
$ mount -o loop,offset=3327131648 ppc.img guest-root
```

Once we have successfully mounted the partition, use the `INSTALL_PATH` and
`INSTALL_MOD_PATH` environment variables to install the kernel and the modules
in the right place.

```console
$ export INSTALL_PATH=/path/to/guest-boot
$ export INSTALL_MOD_PATH=/path/to/guest-root
$ make modules_install
$ make install
```

But now, we have one last problem, the installation won't create the `initramfs`
for the guest, only the kernel image will be copied to the partition. So, we
will have to create the `initramfs` for the new kernel, edit the grub config
file etc.

So we will create the `initramfs` from the guest.

```console
$ # guest
$ mkinitrd /boot/initramfs-<kernel-version>.img <kernel-version>
$ grub2-mkconfig -o /boot/grub2/grub.cfg
```

Now we can either boot directly as usual, or give the kernel and initramfs in
the command line.

```console
$ qemu-system-ppc64 -M pseries -m 2048 -smp cores=2 -nodefaults -nographic \
 -serial pty -monitor stdio -drive file=ppc.img,if=virtio -s \
 -net nic,model=virtio -net user,hostfwd=tcp::2222-:22 -kernel vmlinux \
 -initrd initramfs-<kernel-version>.img -append "root=/dev/vda5"
```

In the above command, while specifying the boot arguments, `root=/dev/vda4`
should be replaced by where ever your rootfs resides in the disk image.

Moving forward, we can edit source and cross compile on the host, boot and do
some advanced tests on the guest.
