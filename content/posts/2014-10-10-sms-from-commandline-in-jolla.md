---
layout: post
title: Sending SMS from the command line in Jolla
summary: " A shell script to send SMS from the command line interface of sailfish.. and also see the Easter egg inside sailfish"
categories: articles
tags: [CLI, jolla, easter-eggs, sms]
comments: true
share: true
modified: 2014-10-10T15:12:53+05:30
author: santosh
---

Without much ado, here is the entire script which I had written, works really
well expect when you need to add a new group. A new group is added when sending
the SMS, but the same group is not used when the message is received (I was
testing sending SMS to myself), I didn’t try really hard after this discovery!!
Add a new group for yourself and you should get a random funny message added in
your UI (Sailfish people are not boring you know!).

The following script was entirely written in Emacs from over the SSH, and even
for such a huge editor, Jolla was not at all slow, and didn’t heat up, nor it
lagged in any case. Awesome!

```bash
# sendsms phonenumber|firstname|lastname "Message Text" type
# type is mobile by default
# If not unique numbers are found, script will prompt for a choice
# the message if sent successfully, it will add into the message UI also

[ $# -lt 2 ] && echo "Usage" && exit 1

# just pick up the first word (if fullname has been given)
contact=`echo $1 | cut -f1 -d" " | tr '[a-z]' '[A-Z]'`
message=$2

if [ $# -gt 2 ]; then
    type=`echo $3 | cut -f1 -d" " | tr '[a-z]' '[A-Z]'`
else
    type="MOBILE"
fi

phonenumber=`sqlite3 /home/nemo/.local/share/system/privileged/Contacts/qtcontacts-sqlite/contacts.db "select phoneNumber from phonenumbers where contactId in (select ContactId from contacts where upper(firstname)='$contact' or upper(lastname)='$contact') and upper(subTypes)='$type' group by phoneNumber"`

count=`wc -w <<< $phonenumber`

if [ $count -gt 1 ]; then
    phonenumbers=($phonenumber)
    echo "Found multiple phone numbers for name $contact"
    echo "Select phone number to send message"
    c=1;
    for i in ${phonenumbers[@]} ; do
    echo $c: $i
    c=$((c+1))
    done
    read -p "Enter choice (any other to quit): " choice

    if [ -n $choice ]; then
    ! [[ $choice =~ "^[0-9]+$" ]] && exit 0
    [ $choice -gt $count ] && exit 0
    else
    # empty?
    exit 0
    fi

    [ $choice -eq 0 ] && exit 0

    choice=$((choice-1))
    phonenumber=${phonenumbers[$choice]}
fi

echo "Sending message to $contact ($phonenumber)"

# strip zeroes and + etc from
phonenumber=`sed -e 's/^0//g' <<<$phonenumber`
echo $phonenumber
groupid=`sqlite3 /home/nemo/.local/share/commhistory/commhistory.db "select max(groupId) from Events where groupId in (select id from Groups where remoteUids like '%$phonenumber')"`
echo $groupid
if [ -z $groupid ]; then
    su - nemo -c "commhistory-tool add -newgroup '' '$phonenumber'"
    groupid=`sqlite3 /home/nemo/.local/share/commhistory/commhistory.db "select max(groupId) from Events where groupId in (select id from Groups where remoteUids like '%$phonenumber')"`
    if [ -z $groupid ]; then
    echo "error adding group"
    exit 1
    fi
fi

su - nemo -c "commhistory-tool add -group $groupid -text '$message' -out -sms '' '$phonenumber'"

dbus-send --system --print-reply --dest=org.ofono /ril_0 org.ofono.MessageManager.SendMessage string:"$phonenumber" string:"$message"
if [ $? -eq 0 ]; then
    echo "Message sent"
fi
```

There are some hacks, with `su -c` etc, because we cannot access history DB as
root user, and we cannot access the phonebook and contacts DB as nemo :-(

The basic usage is (you have to run as root, there is no other choice as far as
I have learnt)

```console
$ sendsms Santosh "A test message"
Sending message to SANTOSH (xxxxxxxxxx)
xxxxxxxxxx

[W] CommHistoryDatabase::open:301 - Opened commhistory database: "/home/nemo/.local/share/commhistory/commhistory.db"
Added group 59
[D] Catcher::eventsCommittedSlot:71 - void Catcher::eventsCommittedSlot(QList<CommHistory::Event>, bool)
[W] CommHistoryDatabase::open:301 - Opened commhistory database: "/home/nemo/.local/share/commhistory/commhistory.db"
[D] Catcher::eventsCommittedSlot:71 - void Catcher::eventsCommittedSlot(QList<CommHistory::Event>, bool)
method return sender=:1.7 -> dest=:1.2929 reply_serial=2
   object path "/ril_0/message_A6FB1FE1D5C5920F9F5572355DA9A200C85D1112"
Message sent
```

If there are multiple phone number present, it will as you to choose one. Try
sending an SMS to yourself and see the Easter egg in action!!
