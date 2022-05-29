---
layout: post
title: Debuggin Linux Kernel using JTAG (In ARM)
summary: "Simple and useful steps to debug vmlinux in a JTAG debugger."
categories: articles
tags: [linux, debugging, trace32]
comments: true
share: true
modified: 2014-07-19T15:12:53+05:30
author: ruchin
---

Build a kernel with symbols.

```
make menuconfig
 -> kernel hacking 
       -> Select Compile the kernel with debug info.
```

This will create a elf image (vmlinux) with can be understood by the
`trace32`. The best choice is to use a uncompressed kernel. ake the following
changes to `cmm` files.

Remove the aborts. Aborts are normal after mmu is initalized, so if you let the
Debugger break for aborts, you will be aborting for ever. So remove the aborts

```
TrOnchip.Set.PABORT OFF
TrOnchip.Set.DABORT OFF
```

For adding the Linux menu in `Trace32`, the following lines will help. The cmm
files for these are already available in the latest version of the `Trace32`.

```
TASK.CONFIG linux
MENU.ReProgram linux
```

# Load the kernel into your regular load location

Using the following command

```
data.load.elf c:\vmlinux /strippart 4 /gnu /sourcepath y:\kernel
```

For source code debugging you need to give the `/strippart`. If you are directly
running `Trace32` in linux and giving the path to your actual kernel image, then
it is not needed. But, most often our Trace32 environment is in windows. So we
need to give how many paths to the stripped from the elf path.

For e.g., If you have compiled the kernel from `/home/user1/proj1/kernel/` In
windows if your source is here `Y:\kernel` Then you should strip
`/home/user1/proj1/kernel/` which is `4`.

## When do you need to jump to vmlinux?

This is exactly after your `u-boot` jumps to kernel image after
decompressing. This could be tricky. Just check the u-boot logs and find where
the kerenl is decompressed. It could be some address like `0x00008000`. First,
put a “HW breakpoint”there. Once, you hit the breakpoint it means the U-Boot is
ready to jump to the kernel. At this moment change the kernel in the ram by
using d.load.elf command shown above. You should see the initial instructions in
`0x000080000`. These are the same instructions seen in
`arch/arm/kernel/head.S`. You can put some breakpoints now and stop the
execution flow.

For debugging interrupts the ISR’s are located in virtual address from
`0xFFFF0000`.
