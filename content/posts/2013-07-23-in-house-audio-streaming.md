---
layout: post
title: In-house Audio Streaming
excerpt: "How can we actually do a non-stop radio like setup that we can listen on our phones? Its actually easy with icecast and easystream. Read on to find out."
categories: articles
tags: [android, streaming, fedora, audio]
comments: true
share: true
modified: 2017-03-23T14:11:53+05:30
author: santosh
---

Lots of users have gigabytes of music in their personal computer, but every time
when we want to listen to music on our portable device, we need to copy
selectively some songs to the device and then listen. You can listen to all the
songs from your PC itself. But what if your girl friend wants to watch videos
and you have only one computer in your house? Now stop fighting, leave the
computer with you girl friend and start your music stream to connect from your
Android or any mobile with streaming audio playback support.

How is that is what we will be looking in this post, it is quite simple, read
on.

I am using a Fedora, which is a RPM based ditro, so I will use yum to install
and update my packages. If you are using some other distribution based on
Debian, then you will be using aptitude.

The first package we need is icecast, which is a streaming media server.

```console
$ sudo yum install icecast
```

`icecast` works on mount points. A mount point is where the source (which does
the actual music conversion, decoding and encoding) send all the music to. We
will do a basic, working configuration and test it.

The configuration for icecast is XML based. The default configuration given by
icecast is good enough, except for adding an extra listen socket with your local
IP.

```xml
<listen-socket>
        <port>8000</port>
        <bind-address>192.168.1.2</bind-address>
</listen-socket>
```

Change the IP above to you computer’s IP, so you connect from another system or
device.

Now for the next package called ezstream.

```console
$ sudo yum install ezstream
```

Examples for ezstream configuration is located in `/usr/share/doc/ezstream/examples/`

Copy the example configuration file which says ezstream_mp3.xml to some nice
folder (your home or Music folder will be fine). Before changing any
configurations for ezstream, it would be better if had tested icecast, Now copy
some mp3 file to `/usr/share/icecast/web` directory and start the icecast
server.

```console
$ icecast -b -c /etc/icecast.xml
```

the option `-b` tells icecast to run in the background and `-c` is used to pass
the config file to icecast. Now, from your browser open the URL like (of course,
change the IP to your IP, or use localhost if on the same system)

```
http://192.168.1.2:8000/example.mp3
```

Now, your browser should be able to playback the streamed audio file. If this is
not working check for the log file in `/var/log/icecast` else leave a comment, we
can try to figure out the issue.

Ok, moving on to ezstream configuration, the default is good enough, just make
sure that the username and password for source matches that of the same in
icecast configuration file. Also check the mount point, IP and URL.

```xml
<ezstream>
    <url>http://localhost:8000/stream</url>
    <sourcepassword>hackme</sourcepassword>
    <format>MP3</format>
    <filename>playlist.m3u</filename>
    <!-- Once done streaming playlist.m3u, exit: -->
    <stream_once>1</stream_once>
```

You can see the playlist.m3u, that’s what we need to create now. Assuming we are
in a folder which has audio files organised by folders, we will create the m3u
files using find.

```console
$ find . -name "*.mp3" > playlist.m3u
```

The final thing is to start streaming.

```
$ ezstream -c ezstream_mp3.xml
```

This should start streaming your music, and you should able to listen through
your browser or players like `Rhythmbox` or `Totem`.

Where does Android come here?

Android is not required, you just need any phone with Wifi and a stream media
playback capable player. If you are using Android, then install "Stream media
Player", open it, click on internet radio, give your URL as

```
http://192.168.1.2:8000/stream
```

where stream is the mount point you defined in the icecast and ezstream
configuration files. Now you don’t have to be with the PC to listen to your
songs, all you require is extended wifi range, so you can sit in your garden and
relax, without keeping you PC speakers in full volume and scaring the hell out
of your neighbours.
