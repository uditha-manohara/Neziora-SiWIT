# PROJECT_STATUS.md — SiWIT Project Status

## Project Identity
- **Project Name:** SiWIT (Sinhala Web Interoperability Test Kit)
- **Creator & Project Lead:** Uditha Manohara Prasad
- **Publishing Brand:** Neziora
- **Attribution:** Created and led by Uditha Manohara Prasad. Published under the Neziora brand.
- **Repository / Directory:** `Neziora-SiWIT`
- **Current Version:** v0.1.0 (Public Release Candidate)
- **Latest Verification Date:** 2026-11-03

---

## 1. Project Vision
SiWIT is a developer-oriented testing toolkit intended to help investigate, reproduce, document, and automate Sinhala text interoperability problems in web applications. Sinhala text features complex Unicode combining sequences, conjuncts (Bandiyakuru), touch consonants, vowel modifiers, and rendering dependencies (e.g., ZWJ `U+200D` for Yansaya, Rakaransaya, Repaya, and conjuncts). SiWIT provides a reproducible, standards-grounded environment to test text inputs, cursor movement, deletion/backspace, normalization, length counting, and clipboard operations.

---

## 2. Current Development Phase
- **Current Phase:** Phase 1 (Inspection & Planning) Complete; Phase 2 (Core Implementation) Complete; Phase 3 (Quality Assurance) Complete; Phase 4 (Documentation) Complete; Phase 5 (Publication Preparation) Complete.
- **Release Status:** Ready for tagged v0.1.0 release and GitHub Pages deployment.

---

## 3. Feature Matrix

| Module | Feature / Component | Status | Notes |
|---|---|---|---|
| **Attribution & Branding** | Neziora brand inspection & asset cataloging | **Completed** | Full adherence to 16-page brand book; detailed in `BRAND_IMPLEMENTATION.md`. |
| **Attribution & Branding** | Creator attribution (Uditha Manohara Prasad) | **Completed** | Prominently displayed across UI header, footer, About section, README, and docs. |
| **Shell & Layout** | Pure Vanilla HTML5/CSS3/ES6 Architecture | **Completed** | Zero heavy frameworks; 100% client-side privacy. |
| **Shell & Layout** | Neziora Typography (Michroma, Sora, Inter, Jost) | **Completed** | Google Fonts + robust Sinhala font fallbacks. |
| **Shell & Layout** | Dark/Light theme toggle adhering to Brand Book | **Completed** | Dark default with official assets swapped dynamically. |
| **Module A** | Dashboard & Test Execution Overview | **Completed** | Real metrics, system specs, nav tiles, recent local runs. |
| **Module B** | Sinhala Unicode Inspector | **Completed** | Decomposition, UTF-16 vs CodePoint vs Grapheme, Hex, Char Names, Comparator. |
| **Module C** | Sinhala Test Corpus (JSON) | **Completed** | 29 structured test cases across 13 phonological categories. |
| **Module D** | Text Interaction Playground | **Completed** | Input, textarea, contenteditable, read-only, real-time event logger, caret inspector. |
| **Module E** | Unicode Normalization Testing (NFC/NFD/NFKC/NFKD) | **Completed** | Direct equality checks, code point diff breakdown, sequence export. |
| **Module F** | Text Length & Input Limit Testing | **Completed** | UTF-16 vs Code Points vs Graphemes vs Bytes, live HTML `maxlength` simulator. |
| **Module G** | Copy and Paste Testing | **Completed** | Clipboard API detection, permission query, bit-for-bit diff table, ZWJ retention. |
| **Module H** | Browser Environment Information | **Completed** | Platform, API support (Intl.Segmenter, Clipboard, etc.), font preview specimens. |
| **Module I** | Test Results & Reports System | **Completed** | JSON & Markdown export, local storage disclosure, record deletion and clearance. |
| **Quality & Tests** | Automated Unit Tests (Node.js runner) | **Completed** | 29/29 tests passing (`tests/unit/run-tests.js`). |
| **Quality & Tests** | Playwright test configuration & setup | **Completed** | Optional runner under `tests/browser/` for CI/CD. |

---

## 4. Current Blockers
- *None.* All engineering, design, testing, and documentation requirements are fully implemented and verified.

---

## 5. Known Limitations
- **Pure client-side `file://` execution:** In some browsers, opening ES modules (`import`/`export`) via `file://` is restricted by CORS policies. Documented zero-dependency local server commands (`npx serve .`, `python -m http.server 8080`) are provided in all guides.
- **OS-level Input Method Editor (IME) visual cursor behavior:** Web APIs cannot read physical OS cursor placement within a native IME composition window prior to text emission. SiWIT distinguishes browser DOM text events from OS IME composition and provides structured manual test steps for OS IME verification.
- **`Intl.Segmenter` Availability:** Supported in modern browsers (Chrome 87+, Safari 14.1+, Firefox 125+). SiWIT detects availability and provides graceful fallback when unavailable.

---

## 6. Next Immediate Actions
1. Independent manual verification by the user following the step-by-step sequence in the development report.
2. Initialization of git repository and commit of all assets.
3. Creation of GitHub repository and optional GitHub Pages static deployment.
