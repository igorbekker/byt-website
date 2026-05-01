# design-source

Read-only. Igor's input. Do not edit files here — treat as visual/structural truth.
When live code diverges from these files, log an OBS and stop work.

Extracted from: `Homepage (1).zip` — 2026-05-01

---

## pages/ — HTML page designs (21 files)

Full-page HTML exports from the design tool.

| File                              | Notes                              |
| --------------------------------- | ---------------------------------- |
| `Homepage.html`                   | Homepage                           |
| `About.html`                      | About page                         |
| `Blog.html`                       | Blog index                         |
| `Blog Article.html`               | Individual blog post               |
| `Blog Category.html`              | Blog category listing              |
| `Blog Subcategory.html`           | Blog subcategory listing           |
| `Careers.html`                    | Careers page                       |
| `Communities.html`                | Communities page                   |
| `Contact.html`                    | Contact page                       |
| `Patients.html`                   | Patients page                      |
| `Providers.html`                  | Providers page                     |
| `Responsive Views.html`           | Multi-breakpoint layout reference  |
| `Layout505.html`                  | Layout prototype 505               |
| `Layout526.html`                  | Layout prototype 526               |
| `byt_v14.html`                    | Full site prototype v14            |
| `uploads-index.html`              | Homepage prototype (uploads)       |
| `uploads-index-3bf803bd.html`     | Homepage prototype — hashed build  |
| `uploads-patients.html`           | Patients prototype (uploads)       |
| `uploads-patients-af9f706a.html`  | Patients prototype — hashed build  |
| `uploads-community.html`          | Community prototype (uploads)      |
| `uploads-community-2e659506.html` | Community prototype — hashed build |

---

## partials/ — Shared HTML fragments (7 files)

Reusable sections extracted from the blog design.

| File                    | Notes                             |
| ----------------------- | --------------------------------- |
| `nav.html`              | Primary navigation                |
| `nav-blog-active.html`  | Navigation with blog active state |
| `footer.html`           | Site footer                       |
| `mobile-bar.html`       | Mobile bottom bar                 |
| `blog-home-body.html`   | Blog index body content           |
| `blog-cat-body.html`    | Blog category body content        |
| `blog-subcat-body.html` | Blog subcategory body content     |

---

## styles/ — CSS (4 files)

| File            | Notes                 |
| --------------- | --------------------- |
| `base.css`      | Base/reset styles     |
| `blog.css`      | Blog-specific styles  |
| `article.css`   | Article page styles   |
| `providers.css` | Providers page styles |

---

## assets/ — Logos, renders, screenshots

| File                   | Notes                                      |
| ---------------------- | ------------------------------------------ |
| `logo-multi.png`       | Full-color multi logo                      |
| `logo-multi-sm.png`    | Full-color multi logo (small)              |
| `logo-multi-tight.png` | Full-color multi logo (tight crop)         |
| `logo-navy.png`        | Navy logo                                  |
| `logo-navy-sm.png`     | Navy logo (small)                          |
| `logo-white-trans.png` | White logo, transparent background         |
| `desktop.jpg`          | Full desktop render                        |
| `_check.jpg`           | Design verification reference              |
| `h98-fullbleed.png`    | Header 98 full-bleed render                |
| `map.png`              | Map reference                              |
| `l526-*.png`           | Layout 526 iteration screenshots (6 files) |
| `01-l526-*.png`        | Layout 526 session 1 screenshots (3 files) |
| `02-l526-*.png`        | Layout 526 session 2 screenshots (3 files) |
| `03-l526-restored.png` | Layout 526 session 3 screenshot            |

### assets/wireframes/ — Design sketches (39 files)

`draw-*.png` — wireframe/sketch exports from the design tool.

### assets/vendor/ — Design tool JSX exports

React component source exported from the design tool. Not production code — reference only.

| Directory      | Contents                                           |
| -------------- | -------------------------------------------------- |
| `communities/` | Communities page components (8 components + index) |
| `patients/`    | Patients page components (6 components + index)    |
| `providers/`   | Providers page components (8 components + index)   |
