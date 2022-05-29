---
layout: post
title: Dynamic linker and loader
summary: "This is a part of the Life of a Process Series. This section explains how libraries are linked and loaded dynamically upon the start of execution of a program."
categories: articles
tags: [process, linker, loader]
comments: true
share: true
modified: 2013-07-27T15:12:53+05:30
author: santosh
series: "Life of a process"
---

As you would have noticed the beginning of the document, it was told the
explanation will be based on the program we had written earlier in this
series. The program was compiled using the command

```console
$ cc sample-source.c -lm
```

As you have probably noticed, we are linking the program with the math
library. This was done intentionally to explain the dynamic loader. Any file can
be identified using the file command. Running file on the `a.out` executable gives
us some information on the type of executable.

```console
$ file a.out
a.out: ELF 64-bit LSB executable, x86-64, version 1 
(SYSV), dynamically linked (uses shared libs), for
GNU/Linux 2.6.32, not stripped
```

The description shows that the executable compiled is a `ELF` (Executable and
Linkable Format) type executable for a 64 bit machine and used shared
libraries. To find out what are all the shared libraries that went into making
the ELF executable can be found using the `ldd` program.

```console
$ ldd a.out
linux-vdso.so.1 =>  (0x00007fff1d368000)
libm.so.6 => /lib64/libm.so.6 (0x0000003cede00000)
libc.so.6 => /lib64/libc.so.6 (0x0000003cece00000)
/lib64/ld-linux-x86-64.so.2 (0x0000003ceca00000)
```

The output shows that our tiny executable uses the services of four different
shared libraries. {The `linux-vdso.so` library will be explained elsewhere in this
series). The `libm.so` is the match library that we linked in while compiling out
program code. The next is the standard C library. The last library is the
dynamic loader which will help during the start of the program execution to use
other library functions that we are linked with. This section will describe the
functions of the dynamic loader in detail.

Before we can proceed with the dynamic loader in detail, there are some
background information that needs to be known about the compilation process.
