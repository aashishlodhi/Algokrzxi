---
title: Debugging with gdb
summary: Compile with -g, set breakpoints, step through code and watch variables.
---

## What debugging is for

Debugging is finding logical errors, and it is also a way to understand how a program executes. A debugger runs your program step by step and shows the value of each variable. The GCC debugger is **gdb**. It needs symbol and source information in the executable, so compile with `-g`.

## Steps

1. **Compile with debug information**: `gcc -g main.c -o main.out` (in a Makefile: `CFLAGS = -g`). Higher debug levels (`-ggdb1`, `-ggdb2`, `-ggdb3`) add more information and make the file larger.
2. **Start gdb**: `gdb ./main.out`
3. **Give commands** (inside gdb):

| Task | Command |
| --- | --- |
| Set a breakpoint | `break file.c 25` or `break function_name` |
| Start the program (stops at the first breakpoint) | `run` |
| Step over a function call (do not enter it) | `next` |
| Step into a function | `step` |
| Continue to the next breakpoint | `cont` |
| Print a variable once | `print var` |
| Print a variable after every stop | `display var` |
| Show the call stack | `backtrace` |
| Show source code (10 lines) | `list` |
| Leave gdb | `quit` |

Useful extras: `info locals` shows the local variables, `finish` runs until the current function returns, and `watch var` stops when a variable changes.

## Example session

```text
$ gcc -g -O0 main.c -o main.out
$ gdb ./main.out
(gdb) break main
(gdb) run
(gdb) next
(gdb) display count
(gdb) step
(gdb) backtrace
(gdb) cont
(gdb) quit
```

::: tip
Debug builds should use `-O0`. With optimization, the compiler reorders and removes code, so stepping jumps around and some variables show as "optimized out".
:::

## Common mistakes

::: pitfall
Debugging a binary that was built without `-g`. You will see addresses instead of source lines and variable names.
:::

## Practice questions

1. What is the difference between `step` and `next`?

::: answer
`step` goes into the function being called, line by line. `next` runs that function as one step and stops at the next line of the current function.
:::
