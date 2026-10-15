---
title: Operators, precedence and type conversion
summary: Every operator group, how precedence decides evaluation, and when C converts types for you.
---

## Operator groups

| Group | Operators |
| --- | --- |
| Arithmetic | `+ - * / %` |
| Relational | `> < >= <= == !=` |
| Logical | `&& \|\| !` |
| Bitwise | `& \| ^ << >> ~` |
| Assignment and shorthand | `= += -= *= /= %= &= \|= ^= <<= >>=` |
| Unary | `+ - ++ -- ! ~ * & sizeof (type)` |
| Conditional | `?:` |
| Special | `[] () . ->` |

::: note
There is no `~=` operator in C, even though some slides list it. `~` is unary and has no compound form.
:::

## Precedence and associativity

From highest to lowest:

| Level | Operators | Associativity |
| --- | --- | --- |
| 1 | `() [] . ->` and postfix `++ --` | left to right |
| 2 | prefix `++ --`, unary `+ -`, `! ~`, `(type)`, `*`, `&`, `sizeof` | right to left |
| 3 | `* / %` | left to right |
| 4 | `+ -` | left to right |
| 5 | `<< >>` | left to right |
| 6 | `< <= > >=` | left to right |
| 7 | `== !=` | left to right |
| 8 | `&` | left to right |
| 9 | `^` | left to right |
| 10 | `\|` | left to right |
| 11 | `&&` | left to right |
| 12 | `\|\|` | left to right |
| 13 | `?:` | right to left |
| 14 | `= += -= ...` | right to left |
| 15 | `,` | left to right |

Note that `==` binds tighter than `&`, so `if (x & 1 == 0)` means `x & (1 == 0)`. Always write `(x & 1) == 0`.

## Implicit and explicit conversion

The compiler converts operands to a common type before arithmetic. Common rules:

- `char + int` becomes `int`
- `int + float` becomes `float`
- `int + unsigned int` becomes `unsigned int`

| Expression | Result | Why |
| --- | --- | --- |
| `5 / 2` | `2` | integer division |
| `5.0 / 2` | `2.5` | `2` becomes `double` |
| `5 / 2.0f` | `2.5f` | `5` becomes `float` |
| `(double)5 / 2` | `2.5` | the cast applies to `5` first |

A cast has higher precedence than `/`, so `(double)a / b` converts `a` only, which is enough to make the division floating-point.

## Common mistakes

::: pitfall
Comparing signed and unsigned values: `-1 < 1u` is false, because `-1` is converted to a huge unsigned number.
:::

::: pitfall
Writing `(float)(a / b)` and expecting a fraction. The integer division happens first. Cast an operand instead: `(float)a / b`.
:::

## Practice questions

1. What is `7 / 2 * 2.0`?

::: answer
`6.0`. First `7 / 2` is integer division (3), then `3 * 2.0` is 6.0.
:::
