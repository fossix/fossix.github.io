---
layout: post
title: Terminal Shortcuts! (Compilation)
excerpt: "Few shortcuts to enhance your commandline skills"
categories: articles
tags: [linux, CLI, commands, terminal, shortcuts]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2010-08-09T14:11:53+05:30
author: sab
---

Here are few short-cuts to enhance your command line skills:

To open the default editor:

```console
Ctrl-x Ctrl-e
```
To execute the last command again

```console
$ !!
```

To use the last string of command:

```console
$ !$ # (or) Alt+.(dot)
```

To move

```console
$ Ctrl-f # -> Forward one character.
$ Ctrl-b # -> Backwards one character.
$ Ctrl-a # —> Move to the beginning of the line.
$ Ctrl-e # —> Move to the end of the line.
```

### History:

History command displays the commands you entered recently. You needn’t enter
the commands again and again or keep pressing arrow key to find your mile long
command, you can search in reverse.

```
Ctrl-r
```

Incremental reverse search.

```
Alt-p
```

For non-Incremental reverse search type ! and few characters of the command;

```
![chars]
```

### Scrolling terminal:

```
Shift-Page up
Shift-Page Down
```

### Reboot the system

```
Ctrl + Alt + Del
```

[Note: By /etc/inittab, you can change the behaviour to shutdown.]

For next X-Server resolution

```
Shift-Alt-+
```

### Copy and paste:

To cut text is know as "killing". To paste is known as "yanking", these are
emacs terms, which now sticks with bash and other shells too.

`Ctrl-k`
:    Cut the text from the current cursor position to the end of the line, and copy it to the buffer.

`Alt-d`
: Kill from the cursor to the end of the current word, or, if between words, to
  the end of the next word. Word boundaries are the same as those used by Alt+f.

`Alt DEL`
: Kill from the cursor to the start of the current word, or, if between words,
  to the start of the previous word. Word boundaries are the same as those used by
  `Alt+b`.

`Ctrl-w`
: Kill from the cursor to the previous whitespace. This is different than
  `Alt-DEL` because the word boundaries differ.
  
`Ctrl-y`
: Yank the most recently killed text back into the buffer at the cursor.
