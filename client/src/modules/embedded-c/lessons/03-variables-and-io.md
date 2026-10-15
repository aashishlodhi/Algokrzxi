---
title: Variables, data types and basic I/O
summary: Identifiers, declaration vs definition, data types, printf, scanf, escape sequences and ASCII.
---

## Tokens and identifiers

A C program is made of functions, a function is made of statements, and statements are made of tokens: keywords, data types, identifiers, variables, constants and operators.

Identifier rules: start with a letter or `_`, then letters, digits or `_`. Names are case-sensitive.

| Name | Valid? |
| --- | --- |
| `Var_1`, `_var` | yes |
| `1_var` | no, starts with a digit |
| `Var-1`, `Basic Salary` | no, `-` and space are not allowed |

## Declaration, definition, initialization, assignment

- **Declaration** tells the compiler a name and its type exist. A variable can be declared many times.
- **Definition** allocates memory. A variable can be defined only once.
- **Initialization** gives the first value at definition time, once.
- **Assignment** gives a value later, any number of times.

```c
int roll_number;          /* declared and defined */
roll_number = 20;         /* assignment */
double price = 200.0;     /* defined and initialized */
price = 300.0;            /* assignment */
```

## Data types

| Type | Typical size | Format |
| --- | --- | --- |
| `char` | 1 byte | `%c` |
| `short` | 2 bytes | `%hd` |
| `int` | 2 or 4 bytes | `%d` (signed), `%u` (unsigned), `%x` hex, `%o` octal |
| `long` | 4 or 8 bytes | `%ld` |
| `float` | 4 bytes | `%f` |
| `double` | 8 bytes | `%lf` |

Sizes depend on the platform, so use `sizeof(type)` instead of assuming. Integer types can be `signed` or `unsigned`. Derived types are arrays, pointers and functions. User-defined types are `struct`, `union` and `enum`. `void` means "no value".

## printf and scanf

```c
printf("%d %lf %c\n", number, basic_salary, letter);
printf("%4d|%-4d|%6.2f\n", 12, 12, 12.48);   /* "  12|12  | 12.48" */

float f;
int n;
scanf("%f", &f);     /* scanf needs the ADDRESS of the variable */
scanf("%d", &n);
```

In a `scanf` format string, spaces are allowed, literal text must match the input exactly, and `%*c` reads and discards one character.

## Escape sequences

| Sequence | Meaning |
| --- | --- |
| `\n` | new line |
| `\r` | carriage return (start of the same line) |
| `\t` | tab |
| `\b` | backspace |
| `\a` | alert (beep) |
| `\'`, `\"`, `\\` | prints the quote or backslash |

## ASCII

Characters are small integers: `'0'` to `'9'` are 48 to 57, `'A'` to `'Z'` are 65 to 90, and `'a'` to `'z'` are 97 to 122. Upper and lower case differ by 32, which is bit 5 (`0x20`), so `ch ^ 0x20` flips the case of a letter.

## Common mistakes

::: pitfall
Forgetting `&` in `scanf("%d", num)`. It compiles with a warning and then writes through a garbage address.
:::

::: pitfall
Mismatching the format and the argument, for example `%d` with a `double`. The output is wrong and the behavior is undefined.
:::

## Practice questions

1. What does `printf("%-6d|", 42);` print?

::: answer
`42    |`. The number is left-aligned in a field of 6 characters.
:::
