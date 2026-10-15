---
title: volatile and memory-mapped registers
summary: How C code talks to peripherals without the compiler getting in the way.
---

## Why it matters

Peripherals appear as ordinary addresses. The compiler does not know a read can return a different value each time, so you must tell it.

## Learning objectives

- Explain what `volatile` guarantees and what it does not.
- Define a register with a pointer cast and with a struct overlay.
- Write a safe polling loop.

## Core ideas

`volatile` tells the compiler that every access to the object must actually happen, in order with other volatile accesses. It is not allowed to cache the value in a register or remove the access.

```c
#include <stdint.h>

/* Example address only. Use the address from your device's reference manual. */
#define STATUS_REG  (*(volatile uint32_t *)0x40000000u)
#define READY_BIT   (1u << 0)

while ((STATUS_REG & READY_BIT) == 0u) {
    /* wait: each loop reads the register again */
}
```

Without `volatile`, the compiler may read `STATUS_REG` once and spin forever on the cached value.

Groups of registers are usually described with a struct:

```c
typedef struct {
    volatile uint32_t MODE;
    volatile uint32_t OUT;
    volatile uint32_t IN;
} gpio_regs_t;

#define GPIOX ((gpio_regs_t *)0x40001000u)   /* hypothetical base address */

GPIOX->OUT |= (1u << 3);
```

Use `const volatile` for a register you may only read, such as a status register.

## Common mistakes

::: pitfall
Believing `volatile` makes an access atomic. It does not. A read-modify-write such as `|=` is several steps, and an interrupt can land in between.
:::

::: warning
`volatile` does not insert hardware memory barriers. Some systems need an explicit barrier or a readback to be sure a write has taken effect.
:::

## Interview angle

::: interview
"Can a variable be both `const` and `volatile`?" Yes. `const` means your code must not write it, `volatile` means it can still change on its own, as with a read-only status register.
:::

## Summary

Mark hardware registers `volatile`, describe them with a pointer or struct, and remember that `volatile` controls compiler optimization, not atomicity.

## Practice questions

1. Why can an empty `while (flag == 0) {}` loop hang if `flag` is changed by an interrupt and is not volatile?

::: answer
The compiler may load `flag` once and keep it in a register, so the loop never sees the new value.
:::

2. What is the benefit of the struct overlay over many separate `#define` registers?

::: answer
One base address describes the whole block, offsets come from the struct layout, and the register names read naturally as `GPIOX->OUT`.
:::
