---
layout: post
title: What next after buying Jolla
excerpt: "Got a Jolla Sailfish phone? Congrats and welcome to the non-android, non-IOS, a pure traditional Linux OS liking community. Learn to hack your phone, its fun and its in the spirit of the OS and community."
categories: articles
tags: [jolla, sailfish, newbie]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2014-07-19T15:12:53+05:30
author: santosh
---

A Jolla phone’s Sailfish OS is just like any other Linux distribution. Like you
use KDE or Gnome or Mate et cetra in your Desktop, this
uses [Lipstick](https://github.com/nemomobile/lipstick-colorful-home) as its
UI. So the underlying filesystem and everything else is the same as you know
from your Desktop. To get a feel you can enable developer mode and ssh into the
phone. How do we do this?

```
Settings -> System -> Developer Mode -> Click on Developer Mode
```

Now you will see a terminal in your apps screen. You can use that just like any
other terminal and browse through your filesystem. It will be a little hard to
type in the small screen. So we will now ssh into the phone. Connect your phone
to the PC and when prompted select the Developer Mode in your phone. Now this
will establish a ethernet over USB connection with the PC and there is an IP
supplied by the phone. If not automatically connected, connected your PC system
to the newly established ethernet connection.

By default the IP address of the phone will be `192.168.2.15` (you can check
this in the Developer Mode settings). So fire up your terminal and `ssh` into
your phone with username `nemo`. The password needs to be set too in the
Developer Mode settings.

```console
$ ssh nemo@192.168.2.15
nemo@192.168.2.15's password:
Last login: Thu Oct  2 20:59:31 2014 from 192.168.1.6
,---
| SailfishOS 1.0.8.19 (Tahkalampi) (armv7hl)
'---
[nemo@Jolla ~]$
```

This is your regular shell, and it supports most of the commands. It comes with
`screen` and `vi` editor too (you can install `emacs` if you wish from Warehouse
store).

Got around your phone? There are few things that needs to be done apart from
installing the recommended apps. The media and galary have problems displaying
content from your SD card. The problem is intermittent. To avoid this we can
bind mount the music, pictures and videos folders to the folders in the home
screen. The Video and Pictures folders are also needed to be mounted because
camera currently doesn’t have the ability to switch storage areas. So its
default is `~/Pictures` for pictures and `~/Videos` for videos. Create these
directories in your SD card, or you can just bind your existing music and
pictures folders.

```console
$ mkdir /media/sdcard/sdcard1/Music # if you don't have any music folder already
$ mkdir /media/sdcard/sdcard1/Videos # if you don't have any videos folder already
$ mkdir /media/sdcard/sdcard1/Pictures # if you don't have any pictures folder already
$ devel-su # takes you to root
$ passwd # change password so you can use regular su
$ mount --bind /media/sdcard/sdcard1/Music /home/nemo/Music
$ mount --bind /media/sdcard/sdcard1/Pictures /home/nemo/Pictures
$ mount --bind /media/sdcard/sdcard1/Videos /home/nemo/Videos
```

If you were using android earlier and want to use the same folder to store your
Pictures, you can bind the DCIM folder where the pictures used to get saved in
android.

The next thing you will have to do, if you are willing to install beta apps, you
should install the Warehouse app. The app can be downloaded from
openrepos.net. After installation, you probably might get an error while
installing applications from inside the warehouse app. This is because of an
empty package remote specified by default. You can disable that. Go to your
command line and then follow the steps.

```console
$ ssu lr # you should see a repo names home
$ ssu dr home # disable it
$ pkcon refresh
```

After a reboot it should be fine installing packages. The next thing in line is
to install patchmanager from warehouse. This will provide you with better
options for your Jolla. Currently after a call is connected there is no haptic
notification, and not media player controls in the lock screen. Patchmanager
provides you with the options to enable these.

Happy hacking.
