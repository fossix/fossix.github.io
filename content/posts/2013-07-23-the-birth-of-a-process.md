---
layout: post
title: The Birth of a Process
summary: "This is a part of the series on Life of a Process. This section explains how a process is created from the shell."
categories: articles
tags: [c, process, shell]
comments: true
share: true
modified: 2013-07-23T14:11:53+05:30
author: santosh
series: "Life of a process"
---

A process is born when a program is executed. So let us back-track a little more
and start from the program birth. The program is born when there is a need for
the programmer. So now I have a need to write a program so that I could create a
process out of it and start explaining what happens along the way. The following
is the sample code used for explaining various concepts in the rest of the
article.

```c
#include <stdio.h>
#include <math.h>

int main()
{
    float d;

    d = cos(20);
    printf("%f\n", d);
}
```

The source is trivial, which just finds the cosine of a number and prints
it. Now compiling the program should give us an executable from which we will
start the journey of tracking the process down.

```console
$ cc sample-source.c -lm
```

which should give us a.out. Note that we are linking with the math library. Now executing this should create a process, on which our study will be based on.

## The Program and the Shell

```console
$ ./a.out
```

When typing `./a.out` in the shell, the shell first creates a process of its own
using the `fork()` system call. This `fork()` system call will create a new
process. This new process will overlay itself with the executable image given
through the `execv()` set of system calls. We will go more into each of these
system calls in the coming sections. Roughly what the shell will do is in the
following listing.

```c
#include <unistd.h>
#include <stdio.h>

int shell_exec (char *command)
{
    pid_t pid;

    pid = fork();
    if (pid == 0) {
        execlp(command, command, NULL);
    }
    /* parent process continues running */
    return 0;
}

int main (int count, char **command)
{
    if (count < 2)
        printf("Need a command to execute\n");

    return shell_exec(command[1]);
}
```

The above code is a major simplification of what the shell does, which handles
pipes, permissions, job control and much more.
