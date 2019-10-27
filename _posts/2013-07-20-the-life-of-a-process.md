---
layout: post
title: The life of a Process
excerpt: "This is a series trying to explain the Life of a process in a Linux system. Will try to cover most of the aspects from the user space to the kernel space."
categories: articles
tags: [process, linux]
comments: true
share: true
modified: 2013-07-20T14:10:52+05:30
author: santosh
series: "Life of a process"
---

The computer system is becoming a complex beast which cannot be tamed easily. In
the new world the operating systems have become too big and complex for one to
learn everything in depth. Most new aspiring system programmers do not have a
picture of what is happening in a system when you type ./a.out. This article is
an attempt to provide the picture and also the necessary details for a Linux
newcomer to grasp so that he/she can refer to more detailed books for further
learning. This article/paper is just a starter so when newcomers start with
bigger books don’t get overwhelmed without knowing the natural flow of the Linux
system.

This series tries to explain the life of a process with all low level details
laid down. It is an attempt to explain to new Linux users and for me to
understand as well the complete process life covering both kernel and user-space
aspects. The explanations and details are based on the Linux based operating
systems only, other systems might follow different mechanisms which I might not
be aware of or have no intention of discussing those systems.

- [Program Compilation - An introduction](/articles/program-compilation-an-introduction/)
- [The Birth Of a Process](/articles/the-birth-of-a-process/)
- [The fork() system call](/articles/the-fork-system-call/)
- [The exec system call](/articles/the-exec-system-call/)
- [Program Sections](/articles/program-sections/)
- [Dynamic linker and loader](/articles/Dynamic-linker-and-loader/)
