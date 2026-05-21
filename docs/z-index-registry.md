# Z-Index Registry

## Token Scale

Defined in `apps/web/src/styles/global.css` under `:root`:

| Token           | Value  | Purpose                  |
| --------------- | ------ | ------------------------ |
| `--z-base`      | `1`    | Default stacking context |
| `--z-dropdown`  | `100`  | Dropdowns, menus         |
| `--z-sticky`    | `200`  | Sticky header            |
| `--z-overlay`   | `300`  | Overlays, backdrops      |
| `--z-modal`     | `400`  | Modals, forms            |
| `--z-toast`     | `500`  | Notifications / toasts   |
| `--z-skip-link` | `1000` | Skip link when focused   |

## Component Assignments

| Component                   | Token used      |
| --------------------------- | --------------- |
| Nav / site header           | `--z-sticky`    |
| Mobile menu (fixed overlay) | `--z-overlay`   |
| Modal / contact forms       | `--z-modal`     |
| Skip link                   | `--z-skip-link` |

## Rule

**No arbitrary `z-index` values.** Every `z-index` declaration in the codebase must reference one of the tokens above via `var(--z-*)`.

If a new stacking layer is needed, add a token to `global.css` and document it here before using it.
