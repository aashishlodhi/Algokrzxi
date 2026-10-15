---
title: Writing and running code with vim
summary: The vim commands you need, a useful .vimrc, and the edit-compile-run loop.
---

## Why it matters

Embedded work often happens on a Linux terminal or a remote board with no IDE. Being quick in vim, and comfortable with the compile-run loop, saves a lot of time.

## Modes

- **Command mode** is the default. Press `Esc` to return to it.
- **Insert mode** is for typing text. Press `i` to enter it.

## The edit, compile, run loop

```bash
vim demo01.c                    # create or edit the file
ls                              # check it exists
gcc demo01.c -o demo01.out      # compile
./demo01.out                    # run
```

## Useful commands

| Task | Command |
| --- | --- |
| Write, quit, write and quit | `:w`, `:q`, `:wq` |
| Quit without saving | `:q!` |
| Copy line, 4 lines | `yy`, `4yy` |
| Copy lines 3 to 5 | `:3,5y` |
| Copy to end or start of line | `y$`, `y^` |
| Copy word, two words | `yw`, `2yw` |
| Cut line, 3 lines, lines 5 to 7 | `dd`, `3dd`, `:5,7d` |
| Cut to end or start of line | `d$`, `d^` |
| Cut word | `dw`, `2dw` |
| Paste | `p` |
| Undo, redo | `u`, `Ctrl+R` |
| Re-indent whole file | `gg=G` |

## Several files at once

```bash
vim main.c fun.c        # opens both, shows main.c first
vim -o file1 file2      # horizontal split
vim -O file1 file2      # vertical split
```

Inside vim: `:next` and `:prev` switch files, `Ctrl+w w` switches windows, `:wqa` saves and quits all.

## A starter ~/.vimrc

```vim
set number          " show line numbers
set autoindent
set smartindent
set cindent         " C-style indentation
set tabstop=4
set shiftwidth=4
syntax on
set nowrap
set autowriteall    " save automatically
set cursorline
```

::: tip
Run `gg=G` after pasting code. It re-indents the whole file using your `cindent` settings.
:::
