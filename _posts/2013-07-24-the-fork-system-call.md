---
layout: post
title: The fork() system call
excerpt: "This is part of the series titles The Life of a Process. This part tell about how a fork system call works which is required to create a new process."
categories: articles
tags: [process, fork, syscall]
comments: true
share: true
modified: 2017-03-24T14:11:53+05:30
author: santosh
---

As we know system calls take us from the user-land to the kernel-land. As
mentioned earlier this article will describe even the very obvious details, so
pardon the gory details. The different things that happen in the kernel during
the start up of a process is what we will discuss in this section.

As seen in the last code listing, the shell does a `fork()` and calls exec
family of system calls to overlay the command image onto the newly created child
process’ address space. Once the `fork()` system call is called, the kernel
creates a copy of the executing process, during which the following happens:

- `fork()` creates a new stack, and copies shared resources such as open file
  descriptors.
- the kernel checks for resource limit of the calling process. The resource
  limits, like if the number of process created has exceeded the system set
  limit for a user (`ulimit`)
- resets the process statistics such as execution times
- The process is given a new process ID and starts executing the newly created
  process.

In this context there is a copy-on-write policy. Ideally the child process and
the parent process (which had called `fork()`) should have different data
areas. But Linux for efficiency does not create a new data area for the child,
but uses the same area of the parent’s until one of the processes start writing
to it. Since this paper is not a kernel commentary, I have intentionally left
out some functions that are called internally by the kernel.

The state now is shown in the following diagram. As it is shown, fork returns
twice, once in the parent with return value of the child process PID and once in
the child with a return value of zero.

The newly created process is uniquely identified by the process ID (PID). This
process belongs to the same process group as the parent. The group ID is is used
for job control in shells. There is also another kind of ID called the session
ID. All processes in the same group will, generally be in the same session ID
unless the process calls `setsid()` system call. The current process ID and its
parent process ID can be found using the ps command.

```console
ps -e
$ ps -f
UID        PID  PPID  C STIME TTY          TIME CMD
santosh   3939 15592  0 Apr17 pts/3    00:00:03 bash
santosh  25841  3939  0 07:17 pts/3    00:00:00 ps -f
```

The parent process of all commands executed in a shell is the shell itself. So
far, our to be process, the code written above, has not yet come into our big
picture.
