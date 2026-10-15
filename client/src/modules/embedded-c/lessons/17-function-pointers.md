---
title: Function pointers
summary: Storing function addresses, arrays of function pointers, typedef, and where firmware uses them.
---

## The idea

A function pointer holds the address of a function, which is the address of its first instruction. The function name by itself is that address. With it you can choose which function to run at runtime.

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*fp)(int, int);     /* fp: pointer to a function (int, int) returning int */

fp = add;                /* or fp = &add; */
printf("%d\n", fp(10, 5));        /* 15, same as (*fp)(10, 5) */
fp = sub;
printf("%d\n", fp(10, 5));        /* 5 */
```

Read `int (*fp)(int, int)` as: `fp` is a pointer to a function taking two ints and returning an int. The parentheses around `*fp` matter, because `int *fp(int, int)` would declare a function returning `int *`.

## Array of function pointers

```c
int (*ops[3])(int, int) = { add, sub, mul };

int choice = 1;
printf("%d\n", ops[choice](10, 5));   /* calls sub */
```

This replaces long `switch` statements in menu-driven programs.

## Simplify with typedef

```c
typedef int (*binop_t)(int, int);

binop_t ops[3] = { add, sub, mul };
binop_t pick = add;
```

## Where they are used in embedded systems

- **Interrupt vector table**: an array of handler addresses.
- **Callbacks**: you pass your function to a driver, which calls it when something happens.
- **State machines**: one handler function per state.
- **Device drivers**: a struct of function pointers (open, read, write) that each device fills in.
- **Menu-driven programs**.

```c
typedef void (*callback_t)(int event);

void register_callback(callback_t cb);        /* driver API */
void on_button(int event) { /* ... */ }
register_callback(on_button);
```

## Common mistakes

::: pitfall
Calling through a NULL or uninitialized function pointer crashes the program. Initialize to `NULL` and check before calling.
:::

::: pitfall
Assigning a function with a different signature. It compiles with a warning at best, and then the call passes arguments incorrectly.
:::

## Practice questions

1. Declare an array of 4 pointers to functions taking `(void)` and returning `void`.

::: answer
`void (*handlers[4])(void);`
:::
