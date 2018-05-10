---
layout: post
title: Program Sections
excerpt: "This is part of The Life of a Process series. This section explains the different sections of a program. Like the BSS, Data etc."
categories: articles
tags: [process, elf]
comments: true
share: true
modified: 2017-03-26T14:11:53+05:30
author: santosh
---

Every program is split into multiple sections. In general, these are:

- The code segment containing executable code
- The stack segment
- Data segment, which constitute the following:

BSS
: Uninitialized data

Heap
: Memory allocated during run time

Data
: Initialized data

They are just the defaults, there can be many more sections in a binary. For
example our sample code contains the following different sections.

```console
$ objdump -h a.out
```

Most of the section compiled into the binary is either empty or just debugging
information. The most important of the sections are the `.text`, `.bss`,
`.data`. The `.text` section contains the executable instructions. This data can
be viewed using `objdump`

```console
$ # disassemble only the .text section
$ objdump -d -j .text a.out
```

The next section `.bss` will contain uninitialized data. The C standard say that
all uninitialized global variables much be set to zero. So instead of wasting
space in the binary with zeroes, it contains only the size of the `.bss`
section, as the kernel provided memory will always be initialized to zero. The
other sections too are not present in the binary as they are available during
the run time, like the stack and the heap sections. The symbols present in
various sections can be found using the `nm` command.

```console
$ nm a.out
```

The type of symbol is printed in the second column. `b` or `B` means `BSS` and
`d` or `D` refers to the symbols in `.data` section.

In this section we have seen one more new term - the binary loader. This is the
dynamic loader which links the executable with the shared libraries(.so) at run
time. This is the topic of the next section.
