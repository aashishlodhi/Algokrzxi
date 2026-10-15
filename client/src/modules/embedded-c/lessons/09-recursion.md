---
title: Recursion
summary: Functions that call themselves, traced on the stack with factorial and binary printing.
---

## The idea

A recursive function calls itself. To write one, do two things:

1. Express the problem in terms of a smaller version of itself (the **recursive case**).
2. Decide the **base case** where it stops.

## Factorial

```c
int fact(int n)
{
    if (n == 0 || n == 1)       /* base case */
        return 1;
    return n * fact(n - 1);     /* recursive case */
}
```

`fact(4)` creates four frames on the stack, one per call:

| Frame | Waiting for | Returns |
| --- | --- | --- |
| `fact(4)` | `4 * fact(3)` | 24 |
| `fact(3)` | `3 * fact(2)` | 6 |
| `fact(2)` | `2 * fact(1)` | 2 |
| `fact(1)` | nothing, base case | 1 |

The frames are removed in reverse order as each call returns, and the results multiply back up.

## Printing a number in binary

Dividing by 2 gives the bits from the least significant side, but we need to print the most significant first. Recursion handles that: go down first, print on the way back.

```c
void print_bin(int n)
{
    if (n == 0)
        return;
    print_bin(n / 2);
    printf("%d", n % 2);
}
```

For `print_bin(8)` the calls go 8, 4, 2, 1, 0. Printing happens as the calls return: `1000`. (For `n = 0` this prints nothing, so handle zero separately if needed.)

## Recursion versus a loop

| | Loop | Recursion |
| --- | --- | --- |
| Needs | a modification statement, or it never ends | a base case, or the stack overflows |
| Time and memory | less | more, a stack frame per call |
| Readability | good for simple repetition | simpler for divide-and-conquer problems |

::: warning
In embedded systems, stack space is small and fixed, so recursion is often avoided. The MISRA-C standard forbids a function calling itself (Rule 17.2). Prefer a loop.
:::

## Practice questions

1. What happens if a recursive function has no base case?

::: answer
Frames keep piling up until the stack overflows and the program crashes.
:::

2. Write the recursive Fibonacci function.

::: answer
```c
int fib(int n)
{
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}
```
It is simple but slow, because it recomputes values. A loop with two variables is O(n).
:::
