---
layout: post
title: Program Compilation - An introduction
excerpt: "A basic intro about how compilation works for a C program. This is part of the 'Life of a Process' series. We will see the compilation steps and what ld does."
categories: articles
tags: [c, gcc, linking]
comments: true
share: true
modified: 2013-07-21T14:11:53+05:30
author: santosh
series: "Life of a process"
---

As we already know the compilation process involves four steps,

- Pre-processing the source file
- Compiling the source file to assembly
- The assembly code is assembled to the object code
- Linking the object code with libraries

So the actual compilation process goes like the following:

```console
$ gcc -E prog.c > prog.i # pre-process
$ gcc -s prog.i      # assemble
$ as -o prog.o prog.s    # compile
$ ld -dynamic-linker /lib64/ld-linux-x86-64.so.2 \
  /usr/lib64/crt1.o \
  /usr/lib64/crti.o \
  /usr/lib64/crtn.o -lc prog.o  # link
```

We will cover each of the process in detail in later sections, but the linker
stage is our focus right now.

The options to `ld` specify that our object code should be dynamically linked
and the dynamic linker to be used is `ld-linux-x86-64.so`. The rest of the
object files are C run time code that gets compiled into the object code. This
is where the `_start` comes into out object file. Every C program has a start up
code compiled in unless you explicitly say not to link start up code to the
compiler. Details about the C run time routines will be given in later in this
article.

The job of the linker is to resolve external references present in the program
and appropriately map them to the libraries and other object files. In case of
static linking the object code present in the libraries that are referenced by
the program are directly linked into the program executable. This makes the
program load faster but the size of the binary is increased. During the loading
of the program, the kernel only needs to relocate the image to its new address
by just adding the memory offset with the addresses present in the binary.

Static linking poses a bigger problem when many programs in the system are used
the same set of code from the libraries. The combined memory of the duplicated
code can impact the available memory considerably. Also when code present in a
library is updated, the entire program needs to be re-linked. This is a problem
for vendors as the entire binary needs to be packed and shipped.

To overcome this dynamic linking was conceived. Here, when the program linking
happens, the undefined references found in the program are searched in library
files and only a reference to the symbol is placed in the binary. This means,
none of the code in the external libraries are in the binary. Since the
references are not loaded into the binary, relocation cannot be performed until
the load time.
