---
title: Signed and unsigned numbers
summary: Two's complement, what the sign bit does, and how signed and unsigned comparisons differ.
---

## Two's complement

Signed integers use two's complement. The top bit is the **sign bit** (0 means positive, 1 means negative). To get the negative of a number: invert all bits (one's complement), then add 1.

```
signed char  5  = 0000 0101
invert          = 1111 1010
add 1           = 1111 1011   -> this is -5
```

The same 8 bits `1111 1011` mean different things depending on the type:

| Type | Bits | Value |
| --- | --- | --- |
| `signed char` | `1111 1011` | -5 |
| `unsigned char` | `1111 1011` | 251 |

For an N-bit type, the ranges are: unsigned 0 to 2^N - 1, signed -2^(N-1) to 2^(N-1) - 1. For `char` that is 0 to 255 and -128 to 127.

Assigning -5 to an `unsigned char` stores `1111 1011`, so `printf("%u", num)` prints 251.

## Signed versus unsigned comparison

```c
signed char n1 = 5, n2 = -5;
if (n1 > n2) printf("n1 is greater");     /* printed: 5 > -5 */

unsigned char u1 = 5, u2 = -5;            /* u2 is 251 */
if (u1 > u2) printf("u1 is greater");
else         printf("u2 is greater");     /* printed: 251 > 5 */
```

## Shifting signed values

- Left shift of an unsigned value fills with zeros on the right.
- Right shift of an **unsigned** value fills with zeros (logical shift).
- Right shift of a **negative signed** value usually copies the sign bit (arithmetic shift), but the standard leaves this implementation-defined. Left-shifting a negative value is undefined.

::: warning
Do bit manipulation on unsigned types (`uint8_t`, `uint32_t`) so that shifts and masks behave the same on every compiler. MISRA-C asks for this too.
:::

## Common mistakes

::: pitfall
Using a signed `char` or `int` for a hardware register or a bit mask. Sign extension can turn `0x80` into `0xFFFFFF80` when it is promoted to `int`.
:::

## Practice questions

1. What does `unsigned char x = 300;` store?

::: answer
44. The value wraps modulo 256 (300 - 256).
:::
