---
layout: post
title: Command Line for beginners - Email
excerpt: "An attempt to create a series of articles targetting audencies who are beginning their command line journey. This post speaks about how to setup your email and view mails in a command line client."
categories: articles
tags: [CLI, email]
comments: true
share: true
modified: 2017-03-29T14:11:53+05:30
author: santosh
---

There are a vast number of mail clients available to choose from for our
everyday usage. But as Michael Elkins said, all mail clients suck. So there must
be some way we could make one of those suckers suck less.

Most mail clients are GUI based. But I am going to talk about command line mail
clients, and specifically about mutt, because this one sucks less, and that’s
what I use. But to use mutt, you should also know how to use a Mail Transport
Agent (MTA) and a Mail Delivery Agent (MDA). For MTA, what we will be seeing
here is fetchmail and the MDA will be procmail. We will look at configuring,
minimilistically, and running the programs, which will just satisfy your basic
needs, and scratches your itches to do more ;-)

## How is this going to work

- Enable mail server to accept POP connections
- Configure local workstation to contact mail server and fetch mails
- Configure a Local Mail Delivery Agent to deliver it to you
- Optionally configure the MDA to deliver mails in the way you prefer.

### Configuring email to be delivered to your mail spooler

The first step to start using a CLI based Mail User Agent (MUA), mutt, is to
somehow bring in all your mails to `/var/spool/mail/you`. This part is done by
fetchmail, and opensource, free MTA.

Here is a dummy configuration:

```
poll pop.gmail.com with proto POP3 and options no dns
user 'somebody@example.com' there with password 'password' is 'password' here  options ssl flush
```

What this says to fetchmail is that, poll the gmail server with protocol pop3
for the user somebody@example.com whose password is "password", and do
everything securely over Secure Socket Layer (SSL).

Once you change this to your needs and put them into `.fetchmailrc`, just run
`fetchmail -c` and check for any errors. If there are no errors, you will know
about new mails in the server. New mails? No rush to check it in the web site,
just wait, we are almost done.

Now lets put this fetchmail command in cron so we don’t have to check mail
manually.

```console
$ crontab -e
*/10 * * * * fetchmail >/dev/null 2>&1
```

The redirection to `/dev/null` is to stop `cron` sending us mails every 10
minutes.

After the first run, check your mail with `mail` command. If you can see new
mails from your ISP. If you still get errors, then

- The configuration might be incorrect
- Make sure fetchmail in cron has run or you run it without the `-c` option
- Check you have enabled pop support for the mail address (In case of gmail,
  `setting->forwarding->enable pop`)

Yes, this is it! you have started using command line for reading mails!!

The first step is a good step, but the reading mails through mail is not very
interesting, the UI is not very friendly. So you just open mutt from your
command line. This would have a nice interface, atleast better than mail.

Oh! you need filters? You have using filters in thunderbird heavily? mm.. then
we should learn some more configurations, and this is for procmail.

### Making your MDA deliver mails the way you want it

I hope you got the terms.

`fetchmail`
: is a MTA since it gets mail from the mail server to your local workstation

`procmail`
: is a MDA since it just delivers the mail to you in a way you want it

The mail fetched by fetchmail which would be in `/var/spool/mail/you` is a single
file containing all the mails you have received. Now you want then to be
filtered out and put into separate files. This is where `procmail` comes in. The
below configuration is for `.procmailrc`

```
LINEBUF=4096
VERBOSE=off
MAILDIR=$HOME/Mail
DEFAULT=$MAILDIR/INBOX
FORMAIL=/usr/bin/formail
SENDMAIL=/usr/sbin/sendmail 
PMDIR=$HOME/.procmail
LOGFILE=$PMDIR/log
INCLUDERC=$PMDIR/rc.maillists
```

In the above I have used a directory called Mail to hold all my mails. My mail
filter rules are present in `rc.maillists` file inside `.procmail` directory in my
home. So the `.procmail/rc.maillists` file contains the following filter.

```
:0:
* ^TO_ilugc@ae.iitm.ac.in
lug

:0:
* ^TO_kernelnewbies@nl.linux.org
kernel

:0:
* ^TO_kernel-janitors@vger.kernel.org
kernel

:0:
* ^TO_linuxcprogramming@lists.linux.org.au
programming

:0:
* ^TO_linux-c-programming@vger.kernel.org
programming
```

I have created some rules which puts mails form specific mailing lists to its
own file in my Mail directory. The DEFAULT variable makes sure that procmail
puts all the rest of the mails in the INBOX file. For more information on the
procmail rules see [http://www.procmail.org/](http://www.procmail.org/) or the
procmailex man page.

And finally configuring the mail client itself. This is all about personal
preference, the colors, the key bindings etc. The `.muttrc` file itself can be
built using [http://www.muttrcbuilder.org/](http://www.muttrcbuilder.org/).
