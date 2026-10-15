---
title: Bitwise operators
summary: AND, OR, XOR, NOT and shifts, with worked examples including even/odd, swap and printing binary.
---

## The operators

Bitwise operators work on each bit of their operands separately. With `0xAB = 1010 1011` and `0x34 = 0011 0100`:

| Operator | Name | Example | Result |
| --- | --- | --- | --- |
| `&` | AND | `0xAB & 0x34` | `0x20` (`0010 0000`) |
| `\|` | OR | `0xAB \| 0x34` | `0xBF` (`1011 1111`) |
| `^` | XOR | `0xAB ^ 0x34` | `0x9F` (`1001 1111`) |
| `~` | NOT | `~0xAB` (8-bit) | `0x54` (`0101 0100`) |
| `<<` | left shift | `0xAB << 2` (8-bit) | `0xAC` (`1010 1100`) |
| `>>` | right shift | `0xAB >> 2` (unsigned) | `0x2A` (`0010 1010`) |

Shifting left by n multiplies by 2^n, and shifting right by n divides by 2^n (for unsigned values).

## Worked examples

**Even or odd.** The least significant bit is 1 for odd numbers.

```c
if (num & 1) printf("odd"); else printf("even");
```

**Divisible by 2 or 4.** A number is divisible by 2^k when its lowest k bits are zero.

```c
if ((num & 1u) == 0u) { /* divisible by 2 */ }
if ((num & 3u) == 0u) { /* divisible by 4 */ }
```

**Lower and upper multiple of 4.**

```c
unsigned lower = num & ~3u;          /* 17 -> 16, 24 -> 24 */
unsigned upper = (num + 4u) & ~3u;   /* 17 -> 20, 24 -> 28 */
```

**Swap two numbers with XOR.**

```c
n1 = n1 ^ n2;
n2 = n1 ^ n2;     /* now the old n1 */
n1 = n1 ^ n2;     /* now the old n2 */
```

::: warning
The XOR swap breaks if both operands are the same variable (it zeroes it), for example when called as `swap(&a, &a)`. A temporary variable is clearer and just as fast on modern compilers.
:::

**Collatz sequence.** If the number is even, divide by 2, otherwise multiply by 3 and add 1, until you reach 1. With bit operations:

```c
while (n != 1) {
    printf("%u ", n);
    n = (n & 1u) ? ((n << 1) + n + 1u)   /* 3n + 1 */
                 : (n >> 1);             /* n / 2  */
}
printf("1\n");
```

For 13 this prints `13 40 20 10 5 16 8 4 2 1`.

**Print the binary of any value.** Test each bit from the top with a mask.

```c
void print_binary(unsigned char num)
{
    unsigned char mask = 0x80u;
    while (mask != 0u) {
        putchar((num & mask) ? '1' : '0');
        mask = (unsigned char)(mask >> 1);
    }
}
```

For other sizes, start the mask at `1u << (sizeof(x) * 8 - 1)`.

## Common mistakes

::: pitfall
Confusing `&` with `&&` and `|` with `||`. `&&` works on whole truth values, `&` on every bit.
:::

::: pitfall
Writing `x & 1 == 0`. Since `==` binds tighter, it means `x & (1 == 0)`, which is always 0. Use `(x & 1) == 0`.
:::

## Practice questions

1. What is `~0u`, and what is `~0x0Fu` on a 32-bit system?

::: answer
`~0u` is `0xFFFFFFFF` (all ones). `~0x0Fu` is `0xFFFFFFF0`.
:::
