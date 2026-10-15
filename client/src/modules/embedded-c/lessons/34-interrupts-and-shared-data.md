---
title: Interrupts and shared data
summary: Keep ISRs short and share data between an ISR and main() safely.
---

## Why it matters

An interrupt can run between any two instructions of your main code. Data shared with it needs care, or the bug appears only once in a thousand runs.

## Learning objectives

- State the rules for writing an ISR.
- Share a flag with `volatile`.
- Protect multi-byte data with a critical section.

## Core ideas

An interrupt service routine (ISR) should be short. Do the minimum, record what happened, and let the main loop do the slow work.

```c
static volatile uint8_t data_ready = 0u;
static volatile uint16_t latest;

void adc_isr(void)                 /* name and vector setup are device specific */
{
    latest = read_adc();           /* hypothetical helper */
    data_ready = 1u;
}

int main(void)
{
    for (;;) {
        if (data_ready) {
            data_ready = 0u;
            process(latest);       /* hypothetical helper */
        }
    }
}
```

On a CPU narrower than the data, such as a 16-bit value on an 8-bit core, reading `latest` takes more than one instruction. If the ISR fires halfway, you can read half old and half new bytes. Protect the copy:

```c
uint16_t copy;
uint32_t state = irq_save();   /* disable interrupts, remember previous state */
copy = latest;
irq_restore(state);            /* restore, do not blindly enable */
```

`irq_save` and `irq_restore` stand for your platform's own mechanism.

## Common mistakes

::: pitfall
Re-enabling interrupts unconditionally at the end of a critical section. If they were already disabled by the caller, you have just changed program behavior. Restore the saved state instead.
:::

::: warning
Avoid blocking calls, long loops, `malloc` and most library I/O such as `printf` inside an ISR. They can be slow or not safe to re-enter.
:::

::: tip
Keep critical sections as short as possible, because interrupts stay off while you are inside one.
:::

## Interview angle

::: interview
"What happens if main and an ISR both modify a counter?" This is a race: the read-modify-write can be interrupted and an update lost. Use a critical section or an atomic operation, and mark the variable `volatile`.
:::

## Summary

Keep ISRs tiny, signal the main loop with `volatile` flags, and guard multi-byte or read-modify-write access with a short critical section that restores the prior interrupt state.

## Practice questions

1. Why is `volatile` alone not enough for `counter++` shared with an ISR?

::: answer
`counter++` is a read, an add and a write. `volatile` forces each access to happen but does not stop an interrupt from landing between them, so an update can be lost.
:::

2. Why restore the saved interrupt state instead of always enabling interrupts?

::: answer
The code may have been called with interrupts already disabled. Restoring the previous state keeps the caller's assumption intact.
:::
