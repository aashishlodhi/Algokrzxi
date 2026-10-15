---
title: Bit manipulation for registers
summary: Set, clear, toggle and test bits, work with multi-bit fields, wait on status bits, and common bit puzzles.
---

## Why it matters

Peripheral registers pack many settings in one word. You change one setting without disturbing the others by using masks. These patterns are the daily work of firmware.

## Single-bit operations

Use an unsigned mask `1u << n`.

```c
#define BIT(n)         (1u << (n))
#define SET_BIT(r, n)  ((r) |= BIT(n))
#define CLR_BIT(r, n)  ((r) &= ~BIT(n))
#define TGL_BIT(r, n)  ((r) ^= BIT(n))
#define GET_BIT(r, n)  (((r) >> (n)) & 1u)
```

## Multi-bit fields

To work on bits `lo` to `hi`, build a mask of `width = hi - lo + 1` ones and shift it into place.

```c
#define MASK(width)            ((1u << (width)) - 1u)
#define FIELD_MASK(lo, width)  (MASK(width) << (lo))

/* set bits 12..15 */
reg |= FIELD_MASK(12, 4);

/* clear bits 17..20 */
reg &= ~FIELD_MASK(17, 4);

/* read bits 19..24 (6 bits) */
uint32_t v = (reg >> 19) & MASK(6);

/* write value into bits 8..15 */
reg = (reg & ~FIELD_MASK(8, 8)) | ((val & MASK(8)) << 8);
```

::: tip
Always clear the field first, then OR in the new value. And mask `val` so a too-large value cannot spill into neighboring fields.
:::

## Waiting on a status bit

Hardware registers must be `volatile`, otherwise the compiler may read them once and loop forever.

```c
volatile uint32_t *status = (volatile uint32_t *)STATUS_ADDR;

while ((*status & BIT(4)) == 0u) { }   /* wait while bit 4 is 0 */
while ((*status & BIT(4)) != 0u) { }   /* wait while bit 4 is 1 */
```

## Bit puzzles

**Parity** (even parity means an even number of 1 bits). Clearing the lowest set bit with `n & (n - 1)` repeats once per set bit:

```c
int count_ones(uint32_t n)
{
    int c = 0;
    while (n != 0u) { n &= (n - 1u); c++; }
    return c;
}
/* even parity when (count_ones(n) % 2) == 0 */
```

**Swap bits m and n** of a number: if the two bits differ, flip both.

```c
if (((x >> m) ^ (x >> n)) & 1u)
    x ^= (1u << m) | (1u << n);
```

## Common mistakes

::: pitfall
Using `1 << 31` with a signed `1`. Shifting into the sign bit is not well defined. Write `1u << 31`.
:::

::: pitfall
Using `=` instead of `|=` to set a bit. It wipes every other bit in the register.
:::

## Practice questions

1. Write one expression that clears bits 3 and 2 of `reg`.

::: answer
`reg &= ~(0x3u << 2);`
:::

2. How do you test whether bit 5 is set?

::: answer
`if (reg & (1u << 5)) { ... }`
:::
