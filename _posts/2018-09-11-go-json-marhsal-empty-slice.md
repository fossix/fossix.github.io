---
layout: snippets
title:  "Go's json marshal"
excerpt: "Marshalling nil objects"
date:   2018-09-11 11:16:17 +0700
categories: snippets
tags: golang
author: sab
gist: d673f95967d8578a77d832953af00a5b
---

When marshalling, if the variable reference is `nil` then json lib encodes it as
`nil`.  But for an empty slice the preferrence is to have `[]`.
