#!/usr/bin/env python3
"""Strip global.css-owned CSS rules from page <style is:global> blocks.

Removes at top-level: CSS reset, :root tokens, base element styles,
utility classes (.eyebrow, .max-w, .fade-up), and all .btn* variants.
Removes inside @media: :root overrides only (keeps page-specific body/etc overrides).
"""
import re
import sys
from pathlib import Path

# Patterns matching the FIRST LINE of a CSS block to remove at top level.
# Each line is matched against these; if it matches, the entire CSS block is collected and removed.
TOP_LEVEL_REMOVE = [
    r'^\s*\*\s*,',                    # *, (start of *, *::before, *::after reset)
    r'^\s*:root\s*\{',                # :root token block
    r'^\s*html\s*\{',                 # html
    r'^\s*body\s*\{',                 # body (top-level)
    r'^\s*img\s*[,{]',               # img or img, video
    r'^\s*video\s*[,{]',             # video
    r'^\s*a\s*\{',                    # a reset
    r'^\s*button\s*\{',               # button reset
    r'^\s*h1\s*,',                    # h1, (start of h1,h2,h3,h4 group)
    r'^\s*p\s*\{',                    # p
    r'^\s*\.eyebrow\s*\{',            # .eyebrow utility
    r'^\s*\.max-w\s*\{',              # .max-w utility
    r'^\s*\.fade-up\s*\{',            # .fade-up utility
    r'^\s*\.fade-up\.visible\s*\{',   # .fade-up.visible utility
    r'^\s*\.btn\s*\{',                # .btn base
    r'^\s*\.btn-coral[\s:{]',         # .btn-coral and :hover
    r'^\s*\.btn-ink[\s:{]',           # .btn-ink and :hover
    r'^\s*\.btn-sage[\s:{]',          # .btn-sage and :hover
    r'^\s*\.btn-primary[\s:{]',       # .btn-primary and :hover
    r'^\s*\.btn-outline[\s:{]',       # .btn-outline (bare) and :hover
    r'^\s*\.btn-white[\s:{]',         # .btn-white (bare) and :hover
    r'^\s*\.btn-white-outline[\s:{]', # .btn-white-outline and :hover
    r'^\s*\.btn-outline-white[\s:{]', # .btn-outline-white and :hover
    r'^\s*\.btn-outline-ink[\s:{]',   # .btn-outline-ink and :hover
    r'^\s*\.btn-outline-coral[\s:{]', # .btn-outline-coral and :hover
    r'^\s*\.btn-outline-navy[\s:{]',  # .btn-outline-navy and :hover
    r'^\s*\.btn-spec-blue[\s:{]',     # .btn-spec-blue and :hover
]

# Inside @media blocks: only remove :root overrides (keep page-specific body, etc.)
MEDIA_REMOVE = [
    r'^\s*:root\s*\{',
]


def matches_any(line: str, patterns: list[str]) -> bool:
    return any(re.match(p, line) for p in patterns)


def collect_block(lines: list[str], start: int) -> tuple[list[str], int]:
    """Collect a complete CSS block (handles multi-line selectors).
    Returns (block_lines, next_index).
    Reads from `start` until the block's opening { and closing } are balanced.
    """
    j = start
    depth = 0
    seen_open = False
    while j < len(lines):
        l = lines[j]
        depth += l.count('{') - l.count('}')
        if '{' in l:
            seen_open = True
        j += 1
        if seen_open and depth <= 0:
            break
    return lines[start:j], j


def strip_file(path: str) -> tuple[int, int, int]:
    """Strip owned selectors from a single file.
    Returns (lines_before, lines_after, blocks_removed).
    """
    content = Path(path).read_text()
    lines = content.split('\n')
    lines_before = len(lines)

    out: list[str] = []
    i = 0
    removed = 0
    in_style = False
    media_depth = 0  # 0 = top-level in style, 1+ = inside @media

    while i < len(lines):
        line = lines[i]

        # Outside style block: pass through unchanged
        if not in_style:
            if re.search(r'<style\b', line):
                in_style = True
                media_depth = 0
            out.append(line)
            i += 1
            continue

        # End of style block
        if '</style>' in line:
            in_style = False
            out.append(line)
            i += 1
            continue

        stripped = line.strip()

        # Entering a top-level @media block
        if media_depth == 0 and re.match(r'^\s*@media\b', line):
            out.append(line)
            media_depth = 1
            i += 1
            continue

        # Decide whether to remove this CSS block
        should_remove = False
        if media_depth == 0 and matches_any(line, TOP_LEVEL_REMOVE):
            should_remove = True
        elif media_depth >= 1 and matches_any(line, MEDIA_REMOVE):
            should_remove = True

        if should_remove:
            _, next_i = collect_block(lines, i)
            removed += 1
            i = next_i
            continue

        # Normal line: keep and track @media depth
        out.append(line)
        if media_depth >= 1:
            media_depth += stripped.count('{') - stripped.count('}')
            if media_depth < 1:
                media_depth = 0
        i += 1

    result = '\n'.join(out)
    Path(path).write_text(result)
    lines_after = len(result.split('\n'))
    return lines_before, lines_after, removed


def main():
    base = Path(__file__).parent.parent
    pages = [
        'apps/web/src/pages/index.astro',
        'apps/web/src/pages/about.astro',
        'apps/web/src/pages/patients.astro',
        'apps/web/src/pages/careers.astro',
        'apps/web/src/pages/contact.astro',
        'apps/web/src/pages/privacy.astro',
        'apps/web/src/pages/terms.astro',
    ]

    print(f"{'Page':<35} {'Before':>8} {'After':>8} {'Delta':>7} {'Removed':>8}")
    print('-' * 72)
    total_delta = 0
    for p in pages:
        full = base / p
        before, after, removed = strip_file(str(full))
        delta = after - before
        total_delta += delta
        short = p.split('/')[-1]
        print(f"{short:<35} {before:>8} {after:>8} {delta:>7} {removed:>8}")
    print('-' * 72)
    print(f"{'TOTAL DELTA':<35} {'':>8} {'':>8} {total_delta:>7}")


if __name__ == '__main__':
    main()
