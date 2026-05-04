# Obstacle Log — Index

| ID | Severity | Status | Summary |
|---|---|---|---|
| OBS-001 | P0 | Resolved | Sanity Editor token deleted, blocked content seeding |
| OBS-002 | P0 | Resolved | Astro decomposition destroyed all 7 page designs |
| OBS-003 | P0 | Resolved | IntersectionObserver never attached, below-fold content invisible |
| OBS-004 | P2 | Resolved | Container width 1280px instead of 1200px |
| OBS-005 | P2 | Resolved | Base font-size 16px instead of 15px |
| OBS-006 | P1 | Resolved | Lora serif font not loaded |
| OBS-007 | P1 | Resolved | Built all 7 pages at once despite sequential instruction, all broken |
| OBS-008 | P2 | Resolved | 30-minute token burn on static file copy |
| OBS-009 | P1 | Resolved | global.css btn border override on Providers |
| OBS-010 | P0 | Resolved | Multiple entire sections missing across all pages |
| OBS-011 | P1 | Resolved | DOM structure changes (element swaps, column reorder, grid changes) |
| OBS-012 | P1 | Resolved | Sanity .map() loops replaced hardcoded HTML on Patients |

## Summary

- Total obstacles: 12
- P0 (production broken): 4
- P1 (visible bug): 5
- P2 (minor): 3
- All resolved

## Root Causes (from BYT_Process_Learnings_v4_AstroSanity.docx)

| RC | Root Cause | Obstacles |
|---|---|---|
| RC-1 | Interpreted HTML as content reference, not build spec | OBS-002, 004, 005, 006, 010, 011 |
| RC-2 | Applied conventional Astro architecture without checking fit | OBS-002 |
| RC-3 | Ignored explicit sequencing instructions | OBS-007 |
| RC-4 | Over-engineered simple operations | OBS-008 |
| RC-5 | Global CSS not audited against page CSS | OBS-009 |
| RC-6 | Misinterpreted "replace text with Sanity variables" as permission to restructure HTML | OBS-012 |
