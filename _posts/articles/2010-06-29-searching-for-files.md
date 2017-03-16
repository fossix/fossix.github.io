---
layout: post
title: Searching for files?
excerpt: "Nobody is a exception for searching files unless you don’t have a computer."
categories: articles
tags: [find, locate, files]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2017-03-16T14:11:53+05:30
author: sab
---

Nobody is a exception for searching files unless you don’t have a computer. here
are two commands you must learn if you are a beginner.  find command

```console
$ find /path/ -name file_name
```

example:

```console
$ find . -name "date*"
```

Notice the ‘.’ which says search in the current directory for files starting
with "date" , you can use your regular expression skill here. And you if you
want to search for file starting from the root just replace ‘.’ with ‘/’.

```console
$ find / -name file.txt
```

`-name` option where you will specify your file names, use `-iname` option for
case insensitivity.

You might also filter the files with their type `-type` for example

$ find /home -name file.txt -type f

‘f’ following `-type` says file.txt is a file, or use ‘d’ instead if you are
looking for directories, or ‘s’ for block files.

There are two more important option. If you know that your files are buried many
levels below, without wasting time, you mention the level from where the search
should begin using `-mindepth.`

```console
$ find / -mindepth 3 -iname file.tex 
```

Same way -maxdepth says how far you should go searching for the file. `locate`
command

locate is a simple and fast searching tool (faster than find). It searches from
the database of files and folders which it maintains. You can manually update
the database with

```console
$ updatedb
```

and locating is as simple as this

```console
$ locate file.txt
```
