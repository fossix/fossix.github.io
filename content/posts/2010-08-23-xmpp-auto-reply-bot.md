---
layout: post
title: XMPP Auto Reply Bot
summary: "How about having a automatic reply for all your chats which are based on the XMPP? Even Gtalk is based on XMPP, and so many others too."
categories: articles
tags: [gtalk, xmpp, bot]
comments: true
share: true
modified: 2010-08-23T14:11:53+05:30
author: sab
---

This an introduction to a simple Perl script that replies to your XMPP buddies based on key words.

This is not really a great script in terms of use, but could be fun. This is not
same as auto-reply in Pidgin. This script replies to your buddies, may be you
can run it while you are away. There are few key words like ‘hi’, ‘hello’,
‘hey’, ‘why’, ‘where’, ‘what’ etc. You can add few more you like. Probably,
using this script may make your friends think that you have gone crazy, but that
doesn’t matter ;).

Before using this script, you should have your systems installed with
`IO::Socket::SSL` , and `AnyEvent::XMPP`. You can install it with the following
commands.

```console
$ sudo cpan IO::Socket::SSL
$ sudo cpan AnyEvent::XMPP
```

The following is the code for the auto-reply bot.

```perl
#!/usr/bin/perl
use strict;
use utf8;
use AnyEvent;
use AnyEvent::XMPP::Client;
use AnyEvent::XMPP::IM::Message;


my $uname = 'your_gmail_id';    # or be jabber, don't forget to change $server to jabber.org
my $passwd = 'your_password';
my $server = "talk.google.com";
my $j = AnyEvent->condvar;
my $cl = AnyEvent::XMPP::Client->new (debug => 0);
$cl->add_account ($uname,$passwd,$server);
$cl->reg_cb (
   session_ready => sub {
    my ($cl, $acc) = @_;
    $cl->set_presence("avaliable","Under reply bot\'s control",10);
   },
   disconnect => sub {
      my ($cl, $acc, $h, $p, $reas) = @_;
      print "disconnect ($h:$p): $reas\n";
   },
   error => sub {
      my ($cl, $acc, $err) = @_;
      print "ERROR: " . $err->string . "\n";
   },
   message => sub {
      my ($cl, $acc, $msg) = @_;
    my ($u,$r) = split(/[\._@]/,$msg->from);
     if($msg->body()=~ /^[\s]*$/){ print $u." is typing\n";}
    else{
        $r = $msg->make_reply;
        my $rep=&sentm($msg->body,$u);
        $r->add_body($rep);
        $r->send;

    }
        print "$u says: ".$msg->body() . "\n";
   }
);

#you can add your own keyword's, need to improve this part!
sub sentm{
    my $msg=shift;
    my $u =shift;
    my $reply;
    if($msg=~/([hH]ow)|([hH]i)|([hH]ey)|([Hh]ello)/){return $reply="$u, Hi.. How are you.. ";}
    if($msg=~/([Ww]hat)|\?|([Ww]at)|(^did)/){return $reply="yes but not really $u... :) ";}
    if($msg=~/([Ww]hy)|([Ww]hen)/){return $reply="may be in sometime $u.. :)";}
    if($msg=~/([Oo]kay)|([oO]k)/){return $reply="good";}
    else {return $reply="hey $u, I will alert if I meet $ENV{'USER'}";}
}
$cl->start;
$j->wait;
```
