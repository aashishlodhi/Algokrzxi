---
title: Loops and jump statements
summary: while, for, do-while, and when to use break, continue, return and goto.
---

## The three parts of every loop

When you write a loop, think about:

1. **Initial state** of the loop variable.
2. **Expression check** that decides whether to run the body.
3. **Modification** that eventually makes the expression false. Without it the loop never ends.

## Entry-check loops

```c
int i = 0;
while (i < 5) {          /* check, then run */
    printf("%d ", i);
    i++;
}

for (int j = 0; j < 5; j++) {    /* init; check; modify */
    printf("%d ", j);
}
```

## Exit-check loop

```c
do {
    printf("%d ", n);
} while (n <= 3);        /* body runs at least once */
```

With `n = 5`, a `while (n <= 3)` loop never runs, while the `do...while` version prints once.

## Jump statements

| Statement | Where it works | What it does |
| --- | --- | --- |
| `break` | `switch` or a loop | leaves the nearest `switch` or loop |
| `continue` | loops only | skips the rest of the body and starts the next iteration |
| `return` | functions | leaves the function and goes back to the caller |
| `goto label;` | within a function | jumps to `label:` |

```c
for (i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;     /* skip even numbers */
    if (i > 7) break;             /* stop after 7 */
    printf("%d ", i);             /* prints 1 3 5 7 */
}
```

::: tip
In embedded code the main loop is often deliberately infinite: `for (;;) { ... }`. That is fine, because it is the program's top-level structure.
:::

## Common mistakes

::: pitfall
A stray semicolon after the loop header: `while (x < 5);` is an empty loop, and the block below it runs once.
:::

::: pitfall
Using a `float` as the loop counter. Rounding errors can make the loop run one time too many or too few. Use an integer counter.
:::

## Practice questions

1. What is printed by `for (i = 0; i < 3; i++) printf("%d", i);`?

::: answer
`012`.
:::
