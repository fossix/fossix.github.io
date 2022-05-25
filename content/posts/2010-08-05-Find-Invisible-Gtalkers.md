---
layout: post
title: Find Invisible Gtalkers!
excerpt: "Find your buddies who decided to remain invisible"
categories: articles
tags: [xmpp, gtalk, invisible]
comments: true
share: true
date: 2010-08-05 14:11:53 +0530
modified: 2010-08-05T14:11:53+05:30
author: sab
---

This program below is a simple python script, that will let you find your
buddies who decided to remain invisible (may be you are haunting them
lately). But its now time for you to be more clever than your pal.

Before that check if you have installed the python xmpp package.

```python
#!/usr/bin/python -Wignore

import xmpp
import signal
import sys
import getpass

# catch signals, and exit for Ctrl+C
def signal_handler(signal, frame):
        print 'Exiting..'
        C.UnregisterHandler('presence', PresenceHandler)
        C.disconnect()
        sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# Google Talk constants
FROM_GMAIL_ID = raw_input("Your Email: ")
GMAIL_PASS = getpass.getpass("Enter Password:")
GTALK_SERVER = "gmail.com"

jid=xmpp.protocol.JID(FROM_GMAIL_ID)
C=xmpp.Client(jid.getDomain(),debug=[])

if not C.connect((GTALK_SERVER,5222)):
    raise IOError('Can not connect to server.')
if not C.auth(jid.getNode(),GMAIL_PASS):
    raise IOError('Can not auth with server.')

C.sendInitPresence(requestRoster=1)

def PresenceHandler(con, event):
    if event.getType() == 'unavailable':
        print event.getFrom().getStripped()

C.RegisterHandler('presence', PresenceHandler)

while C.Process(1):
        pass
```
