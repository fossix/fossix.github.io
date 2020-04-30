---
layout:     post
author:     Santosh
title:      "Emacs for Kernel Development"
date:       2020-02-02 10:43:43 +0530
categories: emacs, kernel, linux, lsp, ccls
---

One of the most important part in the process of understanding the Linux kernel
and to contribute is the ability to browse code efficiently. There are ways
of browsing code from inside Emacs like etags, gtags, cscope etc. Combining this
with ECB (Emacs Code Browser) would help us in a great deal. But in this post we
will see how to configure and get started with a much more powerful package.

## Installing CCLS
CCLS stands for C/C++ Language Server, implementing the Language Server Protocol
(LSP). LSP was developed by Microsoft primarily for 
