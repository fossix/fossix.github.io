---
layout: post
title: The exec() system call
excerpt: "This is part of the series 'The Life of a process'. This write-up is about the exec system call. We saw about how a process is created, but how is a new program gets loaded? Let's see here."
categories: articles
tags: [process, exec, syscall]
comments: true
share: true
modified: 2017-03-25T14:11:53+05:30
author: santosh
series: "Life of a process"
---

After a successful `fork()` the child process will start to execute the command
typed by the user, in our case the `a.out` file. This execution is started by
the exec system call. The job of the system call is to overlay the calling
process’ address space with the executable image and give control to it. The
`exec()` syscall does the following functions:

- The files shared by the parent and child processes are unshared, a new unknown
  executable shouldn’t be sharing files with the shell
- The executable file is opened and checked for permissions whether the new file
  has executable and open permission for the current user.
- The total number of arguments passed to the file is checked for exceeding the
  maximum argument limit.
- If the file is satisfies all the previous checks, the ELF header of the
  executable is checked for the binary loader program name, this will be
  discussed in the next section.
- The file is memory mapped in the address space of the current process and the
  new code is scheduled to execute.

So far we came to an understanding that the new process that was created using
fork will now be replaced with the new image, this means that same PID will have
different images at different instances. This can be easily found by introducing
a small delay in the shell simulator (see below). In our sample program given in
previous [article on process](/articles/the-birth-of-a-process), inserting a delay
would stop our process from completing quickly, so we can observe the change
using `ps`.

```c
  fork();
  sleep(5);
```

```console
$ ./shell-exec ./a.out &
$ ps             # executing immediately
  PID TTY          TIME CMD
 3939 pts/3    00:00:03 bash
24893 pts/3    00:00:00 shell-exec
24896 pts/3    00:00:00 shell-exec
24985 pts/3    00:00:00 ps
$ ps             # After 5 seconds
  PID TTY          TIME CMD
 3939 pts/3    00:00:03 bash
24896 pts/3    00:00:00 a.out
24998 pts/3    00:00:00 ps
```

We have come so far knowing that the new program image replaces the new child
process’ address space, without telling what an address space is. Every process
in Linux is given a range of virtual addresses [^1] on which a process can
act. The program is also split into different sections to simplify some use
cases and for security.


[^1]: For now just knowing that virtual address are not physical addresses and
    they are also not one-to-one mapped with the physical memory should
    suffice. Virtual memory will be covered later.
