---
title: Stack anatomy lab
summary: Print the addresses of locals, parameters and the return address to see a stack frame for yourself.
---

## Objective

See how stack frames are laid out by printing addresses during nested function calls.

## The program

```c
#include <stdio.h>

void level3(int p3)
{
    int local3 = 3;
    printf("level3: param %p, local %p, return addr %p\n",
           (void *)&p3, (void *)&local3, __builtin_return_address(0));
}

void level2(int p2)
{
    int local2 = 2;
    printf("level2: param %p, local %p, return addr %p\n",
           (void *)&p2, (void *)&local2, __builtin_return_address(0));
    level3(p2 + 1);
}

void level1(int p1)
{
    int local1 = 1;
    printf("level1: param %p, local %p, return addr %p\n",
           (void *)&p1, (void *)&local1, __builtin_return_address(0));
    level2(p1 + 1);
}

int main(void)
{
    level1(10);
    return 0;
}
```

Build it without optimization so the variables stay on the stack:

```bash
gcc -O0 -fno-omit-frame-pointer stack.c -o stack.out
./stack.out
```

`__builtin_return_address(0)` is a GCC extension. It gives the address in the caller where execution will resume.

## What to observe

- Addresses printed by `level3` are **lower** than those of `level2`, which are lower than `level1`: on most systems the stack grows toward lower addresses, and every call adds a frame below the previous one.
- Within one frame, the parameter and the local sit near each other, and the return address is a code (text) address, much lower than any stack address.
- With address-space randomization the absolute numbers change on every run, but the differences between them stay about the same.

## Draw the layout

For one call, sketch (high to low addresses):

```text
higher addresses
  [ caller's frame ................ ]
  [ parameters (or in registers) ... ]
  [ return address ................. ]
  [ saved frame pointer ............ ]
  [ local variables ................ ]
lower addresses   <- stack grows this way
```

Exact contents depend on the architecture and calling convention. On x86-64, the first arguments travel in registers, so the parameter may be copied into the frame only because you took its address.

::: tip
Disassemble the function (`gcc -S`, or `objdump -d`) and compare with your drawing. Look for the prologue (saving the frame pointer, reserving space) and the epilogue (restoring and returning).
:::

## Practice questions

1. Why is `-O0` used for this lab?

::: answer
Optimization may keep variables in registers or remove them, so they would have no stack addresses to print.
:::
