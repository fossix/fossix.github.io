---
layout: post
title: C++ - Creating Transparent Dialog
excerpt: "Trick to make a transparent dialog without making its child controls transparent in C++"
categories: articles
tags: [dialog, transparent, windows]
comments: true
share: true
modified: 2017-03-18T14:11:53+05:30
author: ashishn
---

This is a simple trick to make a transparent dialog without making its child
controls transparent. We can set the opacity and transparency color key of a
layered window.

To know more about layered window you can click [here](http://msdn.microsoft.com/en-us/library/ms997507.aspx)

I used `SetLayeredWindowAttributes` with `LWA_COLORKEY` to replace a color with
transparency, in order to achieve a transparent background. Set the background
color of the dialog which is not used in the application. I selected a color
(e.g., RGB(1,11,21)) that is not present anywhere except in the dialog
background. Set that color transparent using `SetLayeredWindowAttributes` with the
`LWA_COLORKEY` flag.

The code that makes dialog is:

```cpp
SetBackgroundColor(RGB(1,11,21));
LONG ExtendedStyle = GetWindowLong(GetSafeHwnd(), GWL_EXSTYLE);
SetWindowLong(GetSafeHwnd(), GWL_EXSTYLE, ExtendedStyle | WS_EX_LAYERED);
::SetLayeredWindowAttributes(GetSafeHwnd(), RGB(1,11,21), 0, LWA_COLORKEY);
```

Paste the above code in the `OnInitDialog()` function of your dialog class. Use
Visual Studio 2010 and derive your dialog class from the `CDialogEx` class.
