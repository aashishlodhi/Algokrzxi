---
title: Decision control: if, ternary and switch
summary: Branching with if, else if, the ?: operator, and switch with its fall-through rule.
---

## if and its variants

Any non-zero value is true and zero is false. Braces are optional only when the body is a single statement, but always using them avoids bugs.

```c
if (marks >= 75) {
    grade = 'A';
} else if (marks >= 50) {
    grade = 'B';
} else {
    grade = 'F';
}
```

An `if` can be nested inside another `if` or `else`. In an `else if` chain, a condition is tested only when all the earlier ones were false.

## The conditional (ternary) operator

```c
max = (a > b) ? a : b;
```

It is right-associative, and you cannot put a jump statement (`break`, `return`, and so on) in either branch, because each branch is an expression.

## switch

```c
switch (cmd) {
    case 1:  start();  break;
    case 2:  stop();   break;
    default: error();  break;
}
```

Rules:

1. Each `case` is followed by an integer constant (a `char` or an `enum` value works too).
2. Duplicate cases are not allowed.
3. Without `break`, control **falls through** into the next case.
4. `default` is optional, and the order of cases does not matter.

Fall-through can be useful on purpose, for example to share code between cases:

```c
case 'a': case 'e': case 'i': case 'o': case 'u':
    vowels++;
    break;
```

## Common mistakes

::: pitfall
Writing `if (x = 5)` (assignment) instead of `if (x == 5)`. It compiles, always takes the true branch, and overwrites `x`. Compile with `-Wall` to catch it.
:::

::: pitfall
Forgetting `break` in a `switch` and running into the next case.
:::

## Practice questions

1. Can `switch` be used with a `float` expression?

::: answer
No. The controlling expression and the case labels must be integer types.
:::
