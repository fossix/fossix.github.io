---
layout: post
title: Twitter From The Command Line
summary: "We all love to tweet.. but how to do that right from you favourite command line?"
categories: articles
tags: [CLI, twitter]
image:
  path: images/so-simple-sample-image-5.jpg
  caption: "Photo Credit [WeGraphics](http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/)"
comments: true
share: true
modified: 2017-03-18T14:11:53+05:30
author: santosh
---

Twitter has become popular with many of us recently. Most of us are too lazy to
use the web interface to do a update. So there are options like twitter for
firefox, twitgin for pidgin and so on. But still most of are CLI oriented and
rarely visit the GUI. I am one such guy. So when I came to hear about Twitter
API, I was excited and started to write a simple python script to update to
Twitter. You can find the version 1 of the script in this post.

# How to use clt?

You can tweet using the following command:

```console
$ clt [-u username] [-p password] your tweet message here
```

Note that the username is not required if it is set `TWEETUSER` environment
variable. But you can give explicitly if you want to send as a different user.

The following will get the specified user’s last tweet update.

```console
$ clt [-u username] -l
```

You can always refer the options using

```console
$ clt --help
```

The python code for clt is here.


```python
#!/usr/bin/python
# -*- coding: utf-8 -*-

###############################################################################
#     Twitter from the command line
#     Copyright (C) 2009 Santosh Sivaraj 
#
#     This program is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by the Free
# Software Foundation; either version 2 of the License, or (at your option) any
# later version.
#
#     This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
# details.
#
#     You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc., 59
# Temple Place, Suite 330, Boston, MA 02111-1307 USA
#
# Command line twitter
# clt version 1.0
# Sun Aug 30 2009 - Santosh - Released version 1.0
###############################################################################

import twitter
import getpass
import sys
import getopt
import os

tweetapi = twitter.Api()

VERSION = "1.0"
authreq = 0 #set as one if we need authentication for any operations
password = ''

def printversion():
    print "clt (Command line tweeting) 1.0"
    print "Copyright (C) 2009 Santosh, fossix.org"
    print "This is free software; see the source for copying conditions. ",
    print "There is NO \nWarranty; not even for MERCHANTABILITY or FITNESS ",
    print "FOR A PARTICULAR PURPOSE."

def usage():
    print "What are you doing now:\n",
    print "\tclt [-u username] [-p password] tweetmsg"
    print "Get last tweet update:\n",
    print "\tclt [-u username] -l"
    print "Get recent tweet updates from all friends:\n",
    print "\tclt [-u username] -p password]-a"
    print "clt --version"
    print "clt --help"

def auth(username):
    global password, authreq
    if not username:
        print "No username supplied or no environment variable 'TWEETUSER'!"
        print ("Use 'clt --help' for more info")
        sys.exit(1)
    # We will reach here only for operations that need authentication
    if not password:
        password = getpass.getpass()
    p = twitter.Api(username, password)
    return p

def fall(username):
    a = auth(username)
    if not a:
        print "Invalid password or username"
        sys.exit(1)

    status = a.GetFriendsTimeline()
    for s in status:
        print "{0}: {1}".format(s.user.name, s.text)

def main(argv):
    global password, authreq
    username = os.environ.get("TWEETUSER")
    otheropts = 0
    last = 0 #last status message
    getall = 0

    try:
        opts, args = getopt.getopt(argv, "u:p:la", ["help", "version"])
    except getopt.GetoptError:
        usage()
        sys.exit(2)

# Parse all the command line arguments
    for opt, arg in opts:
        if opt == "--help":
            usage()
            sys.exit();
    if opt == "--version":
        printversion()
            sys.exit()
        elif opt == '-u':
            username = arg
        elif opt == '-p':
            password = arg
        elif opt == '-l':
            last = 1
    elif opt == '-a':
            getall = 1

    tweet = " ".join(args)
    if tweet != '':
        authreq = 1;

    if getall == 1:
        fall(username)
        sys.exit();

    if last == 1:
        laststat = tweetapi.GetUserTimeline(username, count = 1)
        for l in laststat:
            print l.text
        sys.exit()

    p = auth(username)

    # perform all authentication required operations here
        # --------- other operations -----------#

    # Reach here only to post tweets, else return early.
    if tweet == '':
        print "Tweet what?"
        sys.exit(1)

    p.PostUpdate(tweet)

if __name__ == "__main__":
    main(sys.argv[1:])
```
