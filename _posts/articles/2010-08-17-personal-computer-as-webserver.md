---
layout: post
title: You personal computer can be a webserver
excerpt: "Running a personal webserver from home can be fun, and also keep you busy. Know how to do it."
categories: articles
tags: [linux, apache, webserver]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2010-08-16T14:11:53+05:30
author: sab
---

Running a serious web-sever from your PC could make you the glorious sucker
unless you have a good network speed/bandwidth or a highly unpopular site. But
its a great feeling having a web-server run from your computer, its more of
thrill and fun. If you are worried about your network speed here are few tips:

- try making a static page with needed information.
- if you are having images and other media then try to load it from external
  links which will greatly reduce the load on your computer/network.

example: you can put your album from picassa, and images from other site….


### Server setup:

1. configure your router, see if there is anything called "virtual server" , add
   a entry in it with the external port 80 and your internal port which is
   usually 80 (by default or change it to your own port at
   /etc/httpd/conf/httpd.conf or /etc/apache2/apache2.conf)
2. Put you webpages in /var/www/html or /var/www/ in debian.
3. Start you webserver “service httpd start” or “/etc/init.d/apache2 start” in Debian
4. Register a sub domain for free at dyndns.com or zoneedit and update IP.
5. Appease your SELinux
6. Make HTTP a trusted service in your firewall
7. Visit you site through a proxy, else if you type your URI in your web browser
   it will point to your router.

If you still cannot access your site, Happy debugging!!!!
