---
layout: post
title:  "Go's json marshal"
excerpt: "Marshalling nil objects"
date:   2018-09-11 11:16:17 +0700
categories: golang
tags: [go, golang]
author: sab
---

When marshalling if the variable reference is `nil` then json lib encodes it as
`nil`.  But for an empty slice preferred would be to have `[]`.

```go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var ids []int
	m := make(map[string]interface{})
	m["ids"] = ids
	b, err := json.Marshal(m)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s", string(b))
}
```

this would print `{"ids":null}`, the trick is to initialize ids with 

```go
ids := []int{}
```
- or -

```go
ids := make([]int, 0)
```
