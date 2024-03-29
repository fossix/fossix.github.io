---
title:  "Haskell functions"
summary: "Haskell learning steps: functions"
date:   2018-12-23 11:29:17 +0530
categories: blogs
tags: [haskell, functions]
author: sab
---

##  Writing a simple named function

```hs
sq :: Integer -> Integer
sq n = n * n
```

`::` can be read as 'has the type'. Here `sq` is the function name which takes an integer and returns an integer.

```hs
mul :: Integer -> Integer -> Integer
mul a b = a * b
```
the first line is type signature, while this is useful, it is not required, as haskell compiler can infer the type automatically. Second line is the actual function definition, `=` is used to define the function

Haskell functions always take only one parameter, In this case it is to say the function `mul` takes one parameter and returns another function which take a Interger and return an Integer, The `->` is right associative, meaning the above function can be rewritten as below altough brackets are not necessary.

```hs
mul :: Integer -> (Integer -> Integer)
```

The functions mul and sq can be written a lambda functions,

```hs
sq = \n -> n * n
mul = \a b -> a * b
```

### calling a function

functions can be called as prefix notation or infix (not all functions can be represented as infix)

prefix example 
```hs
mul 32 45
```

infix example, backticks should be used when functions is used as infix
```hs
32 `mul` 45
```

The infix functions like `+, -, *, /` etc, if used as prefix, they should be surrounded with brackets

```hs
(+) 3 4
```



