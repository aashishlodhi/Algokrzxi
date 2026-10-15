---
title: Ring buffer (circular queue)
summary: A fixed-size FIFO with no dynamic memory, used for UART data and event queues.
---

## Why ring buffers

Firmware constantly moves data between producers and consumers running at different speeds: a UART interrupt receiving bytes while the main loop processes them. A ring buffer is a FIFO in a fixed array. Indexes wrap around instead of data being shifted, so push and pop take constant time and need no `malloc`.

## Interface

```c
#include <stdint.h>
#include <stddef.h>

typedef struct {
    uint8_t *buf;       /* storage provided by the caller */
    size_t   size;      /* capacity in bytes */
    size_t   head;      /* next write position */
    size_t   tail;      /* next read position */
    size_t   count;     /* items currently stored */
} ring_buffer_t;

int rb_init(ring_buffer_t *rb, uint8_t *buffer, size_t size);
int rb_push(ring_buffer_t *rb, uint8_t data);
int rb_pop(ring_buffer_t *rb, uint8_t *data);
```

All functions return `0` on success and `-1` on error (bad argument, buffer full on push, buffer empty on pop).

## Implementation

```c
int rb_init(ring_buffer_t *rb, uint8_t *buffer, size_t size)
{
    if ((rb == NULL) || (buffer == NULL) || (size == 0U)) {
        return -1;
    }
    rb->buf = buffer;
    rb->size = size;
    rb->head = 0U;
    rb->tail = 0U;
    rb->count = 0U;
    return 0;
}

int rb_push(ring_buffer_t *rb, uint8_t data)
{
    if (rb == NULL) { return -1; }
    if (rb->count == rb->size) { return -1; }            /* full */

    rb->buf[rb->head] = data;
    rb->head = (rb->head + 1U) % rb->size;                /* wrap around */
    rb->count++;
    return 0;
}

int rb_pop(ring_buffer_t *rb, uint8_t *data)
{
    if ((rb == NULL) || (data == NULL)) { return -1; }
    if (rb->count == 0U) { return -1; }                   /* empty */

    *data = rb->buf[rb->tail];
    rb->tail = (rb->tail + 1U) % rb->size;
    rb->count--;
    return 0;
}
```

## Usage

```c
static uint8_t storage[16];
ring_buffer_t rx;

rb_init(&rx, storage, sizeof(storage));
rb_push(&rx, 0x41U);

uint8_t b;
if (rb_pop(&rx, &b) == 0) { /* use b */ }
```

## Full versus empty

When `head == tail` the buffer is either empty or full. Keeping a separate `count` (as above) removes the ambiguity. The alternative is to waste one slot and call it full when `(head + 1) % size == tail`.

::: warning
If an interrupt pushes while the main loop pops, a shared `count` is modified by both and can be corrupted. Use a single-producer single-consumer design with separate `head` and `tail` indexes (each written by only one side, and declared `volatile`), or disable interrupts around the operation.
:::

::: tip
Making the size a power of two lets you replace `% size` with `& (size - 1)`, which is cheaper on small CPUs.
:::

## Practice questions

1. What should `rb_push` do when the buffer is full?

::: answer
Return an error and leave the data untouched, so the caller can decide whether to drop or retry. It must never overwrite unread data silently, unless you deliberately design an overwrite mode.
:::
