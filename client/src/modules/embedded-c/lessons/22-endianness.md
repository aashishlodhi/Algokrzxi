---
title: Endianness
summary: Byte order in memory, why it matters for protocols and registers, and how to detect it.
---

## Two byte orders

Endianness is how a multi-byte value is stored in memory. For `int num = 0x41424344;` the **high byte** is `0x41` and the **low byte** is `0x44`.

| | Little endian | Big endian |
| --- | --- | --- |
| Rule | low byte at the lower address | high byte at the lower address |
| Memory at 100..103 | `44 43 42 41` | `41 42 43 44` |
| Used by | x86, x86-64, most ARM and AVR systems | network byte order, some PowerPC and other systems |

Some processors (ARM, PowerPC) can be configured either way, but most systems you meet are little endian.

## Why you care

- **Network protocols** send data in big-endian order ("network byte order"). Use `htonl`, `htons`, `ntohl`, `ntohs`.
- **File formats and binary protocols** between different systems.
- **Reading a multi-byte value one byte at a time**, for example from an I2C or SPI device.

## Detecting endianness

```c
#include <stdint.h>

int is_little_endian(void)
{
    uint32_t x = 1u;
    const uint8_t *p = (const uint8_t *)&x;   /* look at the first byte */
    return (*p == 1u);                        /* 1 -> little endian */
}
```

If the least significant byte (`1`) is stored first, the machine is little endian. Reading through a `uint8_t *` (a character type) is allowed.

You can also use a `union` of a `uint32_t` and a `uint8_t[4]`.

## Practice questions

1. On a little-endian system, what is `*(uint8_t *)&x` for `uint32_t x = 0x12345678`?

::: answer
`0x78`, the least significant byte, which sits at the lowest address.
:::
