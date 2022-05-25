---
layout: post
title: Emacs org-mode productivity
excerpt: "Using emacs is awesome, using it also as a productivity tool is so productive. Combined with org-mode emacs and your life will be not the same again."
categories: articles
tags: [linux, emacs, productivity, organise]
comments: true
share: true
modified: 2010-10-31T14:11:53+05:30
author: santosh
---

# Productivity with Emacs, org-mode and remember

For productivity and time keeping I am now using orgmode in Emacs. I have a
heavily customized Emacs and org-mode. I went through many web pages and
tutorials and finally I have come to an agreement with myself that this setup is
enough to make myself efficient and keep myself from forgetting things. I will
show you what I did.

### Version control

The first thing I did was setup a version control system for my notes and org
files. This helps me in keeping everything synchronized across systems I use. I
was using dropbox previously but in my current company, access to dropbox is
blocked. I use a free git repository server for hosting my files.

### org-mode and remember

The next thing I did was to customize my .emacs file for tasks, notes, fast note
taking with remember(New users with org-mode version 6.36 and later should use
capture) etc. My org-mode specific configurations are below.

```elisp
;;; remember and org-mode
(org-remember-insinuate)
(setq org-default-notes-file "~/notes/org/notes")
(setq remember-annotation-functions '(org-remember-annotation))
(setq remember-handler-functions '(org-remember-handler))
(add-hook 'remember-mode-hook 'org-remember-apply-template)
(define-key global-map "\C-cr" 'org-remember)

(setq org-agenda-custom-commands
      '(("w" "Things to be done"
         ((org-agenda-list nil nil 1)
          (tags "WORK")
          (tags "HOME")
          (tags-todo "WAITING")
          ))))

;; templates for remember
(setq org-remember-templates
      '(
        ("Todo" ?t "* TODO %? %g\n  %i" "~/notes/org/TODO" "Tasks")
        ("TO Learn" ?l "* TODO %?\n %i" "~/notes/org/TODO" "To Learn")
        ("Random" ?r "* %u %?\n  %i" "~/notes/org/random.org")
        ("Notes" ?n "* %u %^{Title} %^g\n %i%?\n %a" "~/notes/org/notes"
         "Learning Notes")
        ("Misc" ?m "* %T %^{Title}\n  %i%?\n  %a" "~/notes/org/notes" "Unfiled")
        ("Work" ?w "* %^{Title}\n  %i%?\n  %a" "~/work/notes/jots.org")))
```

### Other emacs customisation

I used to use Emacs not XEmacs, so I had a habit of closing the window when I
intended to close the buffer. So I changed the the quit keyboard command to `C-x
C-\` and `C-x C-c` to kill-buffer. That part of the file is below.

```elisp
;; prompt when quitting Emacs in GUI
(defun ask-before-closing ()
  "Ask whether or not to close, and then close if y was pressed"
  (interactive)
  (if (y-or-n-p (format "Are you sure you want to exit Emacs? "))
      (if (< emacs-major-version 22)
          (save-buffers-kill-terminal)
        (save-buffers-kill-emacs))
    (message "Canceled exit")))

(when window-system
  (global-set-key (kbd "C-x C-\\") 'ask-before-closing)
  (global-set-key (kbd "C-x C-c") 'kill-buffer))
```

### OK how do I use it?

How you want to use the org-mode and remember package is up to you. I will just
give you some ideas about how to start using it, not conceptually, just keyboard
shortcuts, invocations etc.

The following key bindings are for org and remember mode, some are custom and
some are default in emacs-23. Please note the key-bindings specified are Emacs
convention, ie., `C` is control, and `M` is meta/Alt/escape.

| *Key bindings* 	| *Action* |
| `C-a a a` | 	org-mode agenda |
| `C-a a t` | 	org-mode agenda tabular view |
| `C-M-r` | 	Remember mode |
| `Shift-arrow` | 	cycle through todo tag list |
| `C-c C-c` | 	file note (in remember mode) |
| `C-c C-k` | 	discard note in remember mode |

The list of keybindings are given [here](http://orgmode.org/orgcard.txt)

I have set up some remember templates too, so that filing notes can go into the
appropriate file in desired format. Explanation of remember mode with org-mode
can be
found [here](http://members.optusnet.com.au/~charles57/GTD/remember.html).

### Other shortcuts and uses

Since I use Emacs extensively for many things, it is set to run at start up in
my gnome preferences. Also emacs always starts up in server mode, accomplished
with the help of (`server-start`) in the `.emacs` file.

I use `xbindkeys` to bind `Super+esc` to

`emacsclient -e '(remember-other-frame)'`

So even when my Emacs window is not focused, I can quickly enter notes in
remember mode with `super+esc`.

I also use cscope extensively for browsing through the kernel source code. I
prefer not to close files when searching for another definition. To avoid Emacs
opening separately for each file, and cscope waiting for the editor to be
closed, I use `emacsclient` as my `CSCOPE_EDITOR`. I wrote a small script like
the below.

```bash
#!/bin/bash
emacsclient -a vi -n $*
```

When Emacs server is not running, I just use `vi` instead of wasting my time
starting the server for small look-ups.

A very nice tutorial on org-mode is http://doc.norang.ca/org-mode.html.
