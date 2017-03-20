---
layout: post
title: Virtual Host Running on apache
excerpt: "Nobody is a exception for searching files unless you don’t have a computer."
categories: articles
tags: [virtalhost, apache]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2017-03-16T14:11:53+05:30
author: preetam.mn
---

# History

I had Drupal configured and running on my machine, this was good. But
understanding Drupal and going ahead with it became a trouble. so I wanted to go
with plain PHP scripting, so next step was to create a new server for the new
website.

# Problem

I configured the apache2 for the additional virtual host using this Debian
link. But my new URL was not working. When we restart apache2 or reload, we get
warning on `NameVirtualHost *:80`.

```console
$ sudo /etc/init.d/apache2 reload
* Reloading web server config apache2
[Sat Jul 27 00:27:37 2013] [warn] NameVirtualHost *:80 has no VirtualHosts
```

Solution : remove/comment `#NameVirtualHost *:80` from `/etc/apache2/ports.conf`

Hint: grep for `NameVirtualHost *` and confirm that all the entries in the
apache2 folder are similar.

And the virtual host configuration works fine as below but the URL is not
working.

```console
$ apache2ctl -S
VirtualHost configuration:
wildcard NameVirtualHosts and _default_ servers:
*:80                   is a NameVirtualHost
default server preetam-box (/etc/apache2/sites-enabled/000-default:1)
port 80 namevhost preetam-box (/etc/apache2/sites-enabled/000-default:1)
port 80 namevhost drupal722 (/etc/apache2/sites-enabled/drupal722:1)
port 80 namevhost preetamsite (/etc/apache2/sites-enabled/preetamsite:1)
Syntax OK
$ source /etc/apache2/envvars ; /usr/sbin/apache2 -S
VirtualHost configuration:
wildcard NameVirtualHosts and _default_ servers:
*:80                   is a NameVirtualHost
default server preetam-box (/etc/apache2/sites-enabled/000-default:1)
port 80 namevhost preetam-box (/etc/apache2/sites-enabled/000-default:1)
port 80 namevhost drupal722 (/etc/apache2/sites-enabled/drupal722:1)
port 80 namevhost preetamsite (/etc/apache2/sites-enabled/preetamsite:1)
Syntax OK
```

Now these are OK.

# Solution

The problem is that the DNS is not getting resolved and to get this working we
need to edit `/etc/hosts` and add our new website.

```
127.0.0.1   localhost
127.0.0.1   drupal722
127.0.0.1   preetamsite    # <== new entry here
127.0.1.1   ubuntu
```

this lets the DNS to route our URL to `apache2`

# Conclusion

Have patience with Google and ask right questions. I wasted my 4 hours of time
and found this. Was it worth it? it was :)
