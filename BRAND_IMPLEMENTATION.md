# BRAND_IMPLEMENTATION.md — Neziora Brand Implementation for SiWIT

## 1. Project & Attribution Overview

- **Project Name:** SiWIT (Sinhala Web Interoperability Test Kit)
- **Creator & Project Lead:** Uditha Manohara Prasad
- **Publishing & Supporting Brand:** Neziora
- **Attribution Statement:** Created and led by Uditha Manohara Prasad. Published under the Neziora brand.

This document records the inspection of the authoritative Neziora brand assets, guidelines, and their exact technical implementation in SiWIT.

---

## 2. Brand Asset Discovery & Inspection

On November 3, 2026, the root workspace `Neziora-SiWIT` was inspected. The authoritative source documents discovered were:

1. `neziora_brand_guidelines.pdf` (1,058,400 bytes, 16 pages, full official brand book).
2. `NEZIORA_Social_Media_Assets/` containing both `Dark-Theme/` and `Light-Theme/` directories with dedicated platform renders (Facebook, GitHub, Instagram, LinkedIn, Pinterest, Telegram, TikTok, Website, WhatsApp-Business, X-Twitter, YouTube).

### Inspected Source Files and Dimensions:
- **GitHub Organization Avatar (Dark/Light):** 500 × 500 px (PNG) — square mark container.
- **GitHub Social Preview (Dark/Light):** 1280 × 640 px (PNG) — centered full lockup (Mark + Wordmark + Slogan) on brand backgrounds.
- **LinkedIn Company Cover (Dark/Light):** 1128 × 191 px (PNG) — wide horizontal wordmark with slogan.
- **LinkedIn Company Logo (Dark/Light):** 400 × 400 px (PNG) — square mark container.
- **Website Link-Share OG (Dark/Light):** 1200 × 630 px (PNG) — Open Graph card preview.
- **Twitter Header (Dark/Light):** 1500 × 500 px (PNG) — wide banner.
- **YouTube Channel Icon (Dark/Light):** 800 × 800 px (PNG) — square mark container.

### Selected Assets for SiWIT Application & Repository:
The assets selected for inclusion in `assets/logos/` without modification, distortion, or recoloring:
1. `neziora-mark-dark-500x500.png` (from `Dark-Theme/GitHub/NEZIORA_GitHub_Organization-Avatar_Dark_500x500.png`): Used for dark-theme navigation header mark and favicon.
2. `neziora-mark-light-500x500.png` (from `Light-Theme/GitHub/NEZIORA_GitHub_Organization-Avatar_Light_500x500.png`): Used for light-theme navigation header mark.
3. `neziora-wordmark-dark-1128x191.png` (from `Dark-Theme/LinkedIn/NEZIORA_LinkedIn_Company-Cover-1128x191.png`): Used for header/footer wordmark banner.
4. `neziora-wordmark-light-1128x191.png` (from `Light-Theme/LinkedIn/NEZIORA_LinkedIn_Company-Cover-1128x191.png`): Used for light theme display headers.
5. `neziora-full-dark-1280x640.png` (from `Dark-Theme/GitHub/NEZIORA_GitHub_Social-Preview-1280x640_Dark_1280x640.png`): Open Graph and README social card.
6. `neziora-full-light-1280x640.png` (from `Light-Theme/GitHub/NEZIORA_GitHub_Social-Preview-1280x640_Light_1280x640.png`): Alternative light social preview.

---

## 3. Brand Specifications Extracted from `neziora_brand_guidelines.pdf`

### 3.1 Color Palette
Per page 13 and 14 of the Brand Book:

#### Primary Colors
- **Neziora Red:** `#FC0229` | RGB: `(252, 2, 41)` | CMYK: `(0, 99, 84, 1)`
  - *Role:* The spark — energy, ambition, connection.
  - *Rules:* Used for small highlights (active indicators, primary call-to-actions, key metric highlights, thin rule). Strictly limited to ≤ 10% of total surface area. Never used as large background fills or body text.
- **Neziora Black:** `#0A0A0A` | RGB: `(10, 10, 10)` | CMYK: `(0, 0, 0, 96)`
  - *Role:* Primary surface / dark theme base background.
- **White:** `#FFFFFF` | RGB: `(255, 255, 255)` | CMYK: `(0, 0, 0, 0)`
  - *Role:* Clarity and precision. Primary text in dark mode; primary background in light mode.

#### Supporting Colors
- **Graphite:** `#1A1A1A` | RGB: `(26, 26, 26)` | CMYK approx: `(0, 0, 0, 90)`
  - *Role:* Cards, panels, navigation containers on dark backgrounds.
- **Steel Gray:** `#8A8A8A` | RGB: `(138, 138, 138)` | CMYK approx: `(0, 0, 0, 46)`
  - *Role:* Secondary text, captions, metadata, borders, muted counters.
- **Light Gray:** `#F2F2F2` | RGB: `(242, 242, 242)` | CMYK approx: `(0, 0, 0, 5)`
  - *Role:* Panels and tables on light backgrounds.

#### Proportions
- Approximately 70% black (or white in light mode), 20% grays (Graphite/Steel/Light Gray), and ≤ 10% Neziora Red.

### 3.2 Typography System
Per page 12 of the Brand Book:
- **Display (Section titles, large statements):** `Michroma`, Regular, Uppercase, 32px – 48px screen.
- **Headings:** `Sora`, Semi-Bold (`font-weight: 600`), 18px – 28px screen (H1: 28px, H2: 22px, H3: 18px).
- **Body Text:** `Inter`, Regular (`font-weight: 400`), 16px screen, `line-height: 1.5` (Captions: 13px).
- **Slogan and Labels:** `Jost`, Light (`font-weight: 300`), Uppercase, 11px – 14px, `letter-spacing: +0.3em` to `+0.4em`.
- **Sinhala Text Font Stacks (Added for SiWIT linguistic accuracy):**
  - Primary: `'Noto Sans Sinhala', 'Iskoola Pota', 'Nirmala UI', sans-serif`
  - Monospace (Unicode hex/code points): `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`

### 3.3 Logo Usage & Clear Space Rules
Per pages 9–11 of the Brand Book:
- **Clear space:** The margin around the full logo/wordmark must equal the height of one letter of `NEZIORA`. For the mark, margin equals the width of one white pillar.
- **Minimum screen sizes:**
  - Full Logo: 150px wide minimum.
  - Wordmark with slogan: 120px wide minimum.
  - Logo Only (Mark): 24px wide minimum.
- **Strict Prohibitions:**
  - Do NOT recolor or tint logos.
  - Do NOT stretch, squish, rotate, or tilt.
  - Do NOT add drop shadows, glows, outlines, gradients, or 3D effects.
  - Do NOT place dark logos on light backgrounds or light logos on dark backgrounds.
  - Do NOT place logos on red backgrounds.
  - Do NOT retype the logo mark in arbitrary fonts.

---

## 4. Brand Implementation in SiWIT

### 4.1 CSS Custom Properties (`css/main.css`)
```css
:root {
  /* Official Neziora Primary Colors */
  --neziora-red: #FC0229;
  --neziora-black: #0A0A0A;
  --neziora-white: #FFFFFF;

  /* Official Neziora Supporting Colors */
  --neziora-graphite: #1A1A1A;
  --neziora-steel-gray: #8A8A8A;
  --neziora-light-gray: #F2F2F2;

  /* Semantic UI tokens (Dark Default Theme) */
  --bg-primary: var(--neziora-black);
  --bg-surface: var(--neziora-graphite);
  --bg-surface-hover: #242424;
  --border-color: #2D2D2D;
  --border-color-focus: var(--neziora-red);
  --text-primary: var(--neziora-white);
  --text-secondary: var(--neziora-steel-gray);
  --accent: var(--neziora-red);

  /* Status Colors */
  --status-pass: #2ECC71;
  --status-fail: #E74C3C;
  --status-review: #F39C12;
  --status-manual: #3498DB;

  /* Official Typography */
  --font-display: 'Michroma', sans-serif;
  --font-heading: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-label: 'Jost', sans-serif;
  --font-sinhala: 'Noto Sans Sinhala', 'Iskoola Pota', 'Nirmala UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

### 4.2 Light/Dark Mode Implementation
SiWIT implements dark mode by default (matching Neziora's core engineering aesthetic: 70% black, 20% graphite/steel gray, <10% red highlights). A toggleable Light Mode adheres strictly to Neziora guidelines:
- Background: `#FFFFFF`
- Surface panels: `#F2F2F2`
- Text: `#0A0A0A`
- Secondary text: `#555555` / `#8A8A8A`
- Accent: `#FC0229` (applied sparingly, adhering to the ≥ 4:1 / 5:1 contrast guidance).

---

## 5. Missing Brand Information & Technical Notes

1. **Favicon SVG:** An official vector `.svg` mark was not provided; therefore, high-resolution PNG assets (`assets/logos/neziora-mark-dark-500x500.png`) are referenced alongside an inline SVG favicon that strictly mirrors the geometry without altering brand colors.
2. **Dedicated Sinhala Typeface in Brand Book:** The brand guidelines specify English typography (`Michroma`, `Sora`, `Inter`, `Jost`). For Sinhala script rendering, modern web standard font fallbacks (`Noto Sans Sinhala`, `Iskoola Pota`, `Nirmala UI`) were integrated to ensure native script accuracy across Windows, macOS, Linux, and Android.

