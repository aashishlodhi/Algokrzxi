---
title: File handling
summary: Text and binary files with stdio, seeking, and a record-based student database (add, display, search, edit, delete).
---

## The stdio file API

A file is accessed through a `FILE *` stream.

| Function | Purpose |
| --- | --- |
| `fopen(name, mode)` | open, returns `NULL` on failure |
| `fclose(fp)` | close and flush |
| `fprintf`, `fscanf`, `fgets`, `fputs`, `fgetc`, `fputc` | formatted and text I/O |
| `fread(buf, size, count, fp)`, `fwrite(...)` | binary I/O, return the number of items |
| `fseek(fp, offset, whence)`, `ftell(fp)`, `rewind(fp)` | move and query the position |
| `remove(name)`, `rename(old, new)` | delete or rename a file |

Modes: `"r"` read, `"w"` write (truncates), `"a"` append, `"r+"` read and write an existing file, `"w+"`, `"a+"`. Add `b` for binary (`"rb"`, `"ab"`, `"rb+"`). `whence` is `SEEK_SET`, `SEEK_CUR` or `SEEK_END`.

Always check the result of `fopen`.

## A record database

Store one struct per record in a binary file. This is the pattern behind the student management program.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct { int roll; char name[20]; float per; } stud_t;

int add_record(const stud_t *s)
{
    FILE *fp = fopen("student.DB", "ab");        /* append, binary */
    if (fp == NULL) return -1;
    size_t n = fwrite(s, sizeof(*s), 1, fp);     /* 1 means one record written */
    fclose(fp);
    return (n == 1) ? 0 : -1;
}

void display_all(void)
{
    stud_t s;
    FILE *fp = fopen("student.DB", "rb");
    if (fp == NULL) { puts("open failed"); return; }
    while (fread(&s, sizeof(s), 1, fp) == 1)
        printf("Roll: %d Name: %s Per: %.2f\n", s.roll, s.name, s.per);
    fclose(fp);
}
```

**Search** reads records until the roll matches. **Edit** reads until the roll matches, then steps back one record and overwrites it:

```c
int edit_record(int roll, const stud_t *updated)
{
    stud_t s;
    FILE *fp = fopen("student.DB", "rb+");       /* read and write, binary */
    if (fp == NULL) return -1;
    while (fread(&s, sizeof(s), 1, fp) == 1) {
        if (s.roll == roll) {
            fseek(fp, -(long)sizeof(s), SEEK_CUR);   /* back to start of this record */
            fwrite(updated, sizeof(*updated), 1, fp);
            fclose(fp);
            return 0;
        }
    }
    fclose(fp);
    return -1;                                   /* not found */
}
```

The `fseek` also serves a second purpose: when switching between reading and writing on the same stream, you must call `fseek` (or `fflush`) in between.

**Delete** copies every record except the one to remove into a temporary file, then replaces the original:

```c
/* read student.DB, write all records with s.roll != roll to temp.DB */
/* fclose both; if found: remove("student.DB"); rename("temp.DB", "student.DB"); */
/* if not found: remove("temp.DB"); */
```

## Menu and input safety

In the `accept` function, limit string input: `scanf("%19s", s->name)` for a `char name[20]`. In error paths use `exit(1)` (non-zero), and close any file you already opened.

## Common mistakes

::: pitfall
Unbounded `scanf("%s", name)` into a 20-byte array overflows it when the input is long.
:::

::: pitfall
Forgetting `fclose`. Buffered data may never reach the file, and file handles leak.
:::

::: note
Writing raw structs to a file ties the file to this compiler's padding and this CPU's byte order. For files shared between systems, write field by field in a defined format.
:::

## Practice questions

1. What does `fread(&s, sizeof(s), 1, fp)` return at the end of the file?

::: answer
0 (fewer items than requested), which is why the loop condition is `== 1`.
:::
