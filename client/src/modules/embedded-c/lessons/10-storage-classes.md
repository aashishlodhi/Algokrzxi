---
title: Storage classes
summary: auto, register, static and extern: where a variable lives, how long, and who can see it.
---

## What a storage class decides

A storage class tells the compiler four things about a variable: its **scope** (visibility), **where it is stored**, its **initial value**, and its **lifetime**.

| Class | Stored in | Default value | Lifetime | Scope |
| --- | --- | --- | --- | --- |
| `auto` (local) | stack | garbage | block | block |
| `register` | CPU register (if available) | garbage | block | block |
| `static` | data section | zero | whole program | limited (block or file) |
| `extern` (global) | data section | zero | whole program | whole program |

A running process has these sections: text, data, heap and stack. Accessing a variable outside its scope is a compile error.

## auto

Local variables declared inside a function are `auto` by default. They are created when the function is called and destroyed when it returns.

## register

`register` is a request to keep the variable in a CPU register for speed. The compiler may ignore it, since registers are limited. You cannot take the address of a register variable. Modern compilers decide this on their own, so it is rarely used.

## static

A static variable keeps its value across calls, and is initialized only once.

```c
void counter(void)
{
    static int calls = 0;     /* initialized once, kept between calls */
    calls++;
    printf("%d\n", calls);    /* 1, 2, 3, ... */
}
```

At file level, `static` limits a variable or function to that source file (internal linkage). That is how you keep module internals private.

## extern

`extern` declares a global that is defined elsewhere. It allocates no memory.

```c
/* config.c */
int baud_rate = 9600;           /* the one definition */

/* main.c */
extern int baud_rate;           /* declaration: refers to config.c's variable */
```

## Common mistakes

::: pitfall
Defining a global in a header file. Every file that includes it creates its own definition and the linker reports duplicates. Define once in a `.c` file, declare with `extern` in the header.
:::

## Practice questions

1. What does a `static` local variable get when it is not initialized?

::: answer
Zero, because it lives in the data section (specifically the zero-initialized part).
:::
