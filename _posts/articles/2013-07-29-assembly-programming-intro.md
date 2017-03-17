---
layout: post
title: Intro To Assembly Programming From A Dummy
excerpt: "Developing an Android app was never easy before, we need to know Java, after the introduction of ASE, we need to know Python, now, its child's play, just putting the pieces of a puzzle together."
categories: articles
tags: [c, asm]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2017-03-29T14:11:53+05:30
author: santosh
---

We are all comfortable writing code in high level languages like C, and some
would even argue C is not a high level language like Java, or Python etc. But
the truth is the more you go closer to the silicon, the more speed you get,
trading away the traits of high level design (readability, maintainability
etc). Here is an example of this.

Long long ago, so long ago, I was seeing so many executable programs in my `~/bin`
directory, disturbing the auto-completion in the CLI. I was so lazy to manually
delete it, and Makefiles are no use for simple test codes that I write
randomly. So I took a bold step of writing a script which would delete any ELF
files. The script went like this:

```bash
#!/bin/bash

for i in *; do
    if [ -f "$i" ]; then
        if file "$i" | grep ELF > /dev/null ; then
            rm "$i";
        fi
    fi
done
```

Here I could have checked for executable mode of a file, but I don’t want shell
scripts lying around to get removed too. Now, back to the story - Later one day,
this script took about 2 seconds to loop through and delete all ELFs. For a busy
guy like me (you got to believe me ;-)), this was infinity.

```console
$ time ../sh/rmelf
real    0m1.273s
user    0m0.405s
sys 0m1.028s
```

Then the brave guy (that’s me), took another brave decision of writing it in C,
for which the code goes like this:

```c
/* rmelf.c
 * Remove executables (ELF) in a directory.
 *
 * Copyright (C) 2007 - 2010 Santosh Sivaraj (santoshs (_at_) fossix.org)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, version 2 of the
 * License.
 */

#include <stdio.h>
#include <dirent.h>
#include <unistd.h>
#include <sys/stat.h>
#include <malloc.h>
#include <string.h>
#include <fcntl.h>

#define FIRST_FOUR_BYTES 4

int main (int argv, char *argc[])
{
        struct dirent *ent, *rent;
        struct stat stat_buf;
        DIR *dir;
        int result, stat_res, fd;
        char file_start[5];

        dir = opendir(".");
        if (!dir) {
                perror(argc[0]);
                return 0;
        }

        ent = (struct dirent *)malloc(sizeof(struct dirent));
        if (!ent) {
                fprintf(stdout, "Cannot allocate memory for dirent\n",
                        strlen("Cannot allocate memory for dirent\n"));
                closedir(dir);
                return 0;
        }

        result = readdir_r(dir, ent, &rent);
        while (rent && !result) {
                stat_res = stat(rent->d_name, &stat_buf);
                if(stat_res) {
                        result = readdir_r(dir, ent, &rent);
                        continue;
                }

                if (stat_buf.st_mode & S_IFREG) {
                        fd = open(rent->d_name, O_RDONLY);
                        read(fd, file_start, FIRST_FOUR_BYTES);
                        /* fprintf(stdout, file_start, FIRST_FOUR_BYTES); */
                        if(strncmp(file_start+1, "ELF", FIRST_FOUR_BYTES-1) ==
                           0) {
                                unlink(rent->d_name);
                        }
                        close(fd);
                }
                result = readdir_r(dir, ent, &rent);
        }
        if (result) {
                fprintf(stderr, "Error", strlen("Error"));
        }
        free(ent);
        closedir(dir);
        return 0;
}
```

I know, that is a comment-less code, bad code, could have been better, but it
solved the purpose, so kept it safe. Now, for the same number of files and ELFs,
the time this baby takes is:

```console
$ time rmelf 
real    0m0.008s
user    0m0.000s
sys     0m0.008s
```

Impressive isn’t it ;-)

Ok, the point is moving down the language hierarchy, moving towards the low
levels, always guarantees speed. But stability, manageability and readability
(Your son may maintain it in the future!) are guaranteed to be non-existent. But
there are systems requiring raw power and speed, in case of most embedded
systems. So you might want to learn to code your toys.

A small intro on Assembly in Linux

Linux is a protected mode, 32 bit OS. So there are no segment registers, segment
registers and paging are already set up.

### Segments

Don’t confuse with segment registers. The segment here is a section in a program.

```
section .text   ;Code segment
section .data   ;Data segment
section .bss    ;uninitialized data
```

### Program start

We have to specify where our main program starts or else we would get a linker
error. We tell the linker how we have indicated the main section by using

```asm
global _start   ;main() as in C
    ; _start and main are customary, but can be any name
```
Then we start the main section using a label

```asm
_start:
            ;program starts executing from here.
```

All arguments to the program (`argv[][]`) are put into the top of the stack at
program execution, so to obtain them we just pop out into a location.

```asm
    pop ebx     ;the number of arguments(argc)
    pop ebx     ;the program name(argv[0])
    pop ebx     ;the actual arguments start here
```

### System call

We use Linux system calls for various functions like printing. To get the kernel
attention to do some work we issue an interrupt with interrupt number `80h`.

The arguments to system a call are placed in `ebx`, `ecx`, `edx`, `esi`, `edi`,
`ebp`. If there are more than six, ebx contains the location of the argument
list. System calls are declared in `unistd.h`, and help in section 2 of man page.


Some frequently used system call numbers:

```
    exit        1
    read        3
    write       4
    creat       8
    sys_close   6
```

Function arguments are pushed from last to first into the stack.

Some useful ASCII codes:

```
    \n  10
    \r  13
```

Labels are used for branching and useful to be used as functions. Looping labels
have a dot preceding them.

```asm
.loop   dec ax
    ;; other statements
    jnz .loop
```

For a detailed Assembly language tutorial, see Linux Assembly Tutorial,
step-by-step guide.
