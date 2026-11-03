# TECHNICAL_DECISIONS.md — Architecture & Engineering Decisions

## Decision 001: Zero Framework, Pure Vanilla Web Technologies
- **Status:** Approved & Implemented
- **Context:** SiWIT must be lightweight, fast, portable, maintainable, run on modest hardware (e.g. Intel Core i3, 12 GB RAM, HDD storage), and deploy effortlessly to GitHub Pages.
- **Decision:** Build SiWIT using Vanilla HTML5, modern CSS3 (Custom Properties, Flexbox, Grid), and modern ES6+ JavaScript modules. No React, Next.js, Vue, Angular, or bundler build steps required for core execution.
- **Alternatives Considered:**
  - *React / Vite:* Adds node_modules baggage (~300MB), build artifacts, and barrier for non-Node users.
  - *Svelte:* Lighter than React, but still requires compilation step.
- **Consequences:** Eliminates dependency hell, zero build step to run, lightning-fast load times, and maximum longevity.

---

## Decision 002: Unicode Segmentation & Character Counting Paradigm
- **Status:** Approved & Implemented
- **Context:** In JavaScript, `string.length` returns the number of 16-bit code units, NOT Unicode characters or grapheme clusters. For Sinhala script, combining vowel signs (kombuva, aela-pilla, etc.), virama (al-lakuna `U+0DCA`), and Zero-Width Joiner (`U+200D`) create multi-code-point sequences.
- **Decision:**
  - Clearly display four distinct measurements across the entire application:
    1. UTF-16 Code Units (`str.length`).
    2. Unicode Code Points (`Array.from(str).length` or `[...str].length`).
    3. Grapheme Clusters (`Intl.Segmenter(..., { granularity: 'grapheme' })` where available).
    4. UTF-8 Byte Size (`new TextEncoder().encode(str).length`).
  - Never equate `str.length` to "characters".
- **Alternatives Considered:**
  - Third-party regex packages: bloat the application and fail edge cases.
  - Custom parser: violates Unicode standard compliance rules.
- **Consequences:** Provides exact internationalization clarity to developers and QA engineers.

---

## Decision 003: Native Unicode Normalization (`String.prototype.normalize`)
- **Status:** Approved & Implemented
- **Context:** Web applications frequently receive text in different normalization forms (NFC vs NFD, or NFKC vs NFKD).
- **Decision:** Use browser's native `normalize('NFC')`, `normalize('NFD')`, `normalize('NFKC')`, and `normalize('NFKD')`. Explicitly detect code-point sequence differences before and after normalization.
- **Alternatives Considered:**
  - Custom normalization algorithm: explicitly forbidden by project prompt and prone to subtle bugs.
- **Consequences:** Reliable, spec-compliant normalization execution without external dependencies.

---

## Decision 004: Event Instrumentation in Text Interaction Playground
- **Status:** Approved & Implemented
- **Context:** Sinhala text input issues often stem from how browsers handle `beforeinput`, `input`, `keydown` (especially Backspace and Delete), and `compositionend`.
- **Decision:** Build an event listener harness in `interaction-tests.js` that captures `keydown`, `keyup`, `beforeinput`, `input`, `compositionstart`, `compositionupdate`, `compositionend`, `copy`, `cut`, `paste`, and selection changes, displaying timestamps, inputType, targetRanges, and resulting string code points in an interactive timeline log.
- **Consequences:** Gives developers direct, reproducible visibility into browser editing quirks.

---

## Decision 005: Client-Side Privacy & Storage Architecture
- **Status:** Approved & Implemented
- **Context:** Users may test sensitive, proprietary, or personal text strings.
- **Decision:**
  - Zero external network requests (no third-party telemetry, no remote API calls, text never leaves the client browser).
  - LocalStorage is strictly opt-in and restricted to saving test run reports (`siwit_test_records_v1`).
  - Provide an explicit "Clear All Stored Results" control with storage usage counter.
- **Consequences:** Maximum privacy, enterprise-grade safety, and full offline usability.

---

## Decision 006: Brand Attribution Hierarchy
- **Status:** Approved & Implemented
- **Context:** Creator and lead identity must be properly attributed alongside the publishing brand.
- **Decision:** Primary attribution belongs to Uditha Manohara Prasad (Creator & Project Lead). Neziora is the publishing brand. Copyright (c) 2026 Uditha Manohara Prasad.
- **Consequences:** Clear, legally and ethically sound recognition across UI, footer, docs, and code headers.

---

## Decision 007: OpenType Ligature Shaping vs UAX #29 Grapheme Cluster Boundary Clarification
- **Status:** Approved & Implemented
- **Context:** In OpenType font engines, `Consonant + Virama + ZWJ + Consonant (+ Vowel)` shapes into a single visual ligature glyph (e.g. `ක්‍ර` or `ශ්‍රී`). However, under default Unicode UAX #29 segmentation rules (`Intl.Segmenter`), `Consonant + Virama + ZWJ` forms one cluster, and the subsequent `Consonant (+ Vowel)` forms a second cluster.
- **Decision:** Rather than treating this as a bug or papering over it with non-standard regexes, SiWIT exposes this exact technical truth in the documentation, test corpus, and inspector. Developers are shown that font shaping (visual glyph count) and Unicode text segmentation (UAX #29 cluster count) have different boundary definitions.
- **Consequences:** Elevates the technical credibility and depth of the toolkit.
