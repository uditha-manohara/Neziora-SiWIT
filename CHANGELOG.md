# CHANGELOG — SiWIT

All notable changes to the **SiWIT (Sinhala Web Interoperability Test Kit)** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-11-03

### Project Inception & Initial Release
- **Project Concept & Lead:** Uditha Manohara Prasad
- **Publishing Brand:** Neziora
- **Initial Public Release:** v0.1.0

### Added
- **Core Architecture:**
  - Lightweight, zero-framework vanilla client-side application (HTML5, CSS3, ES6 modules).
  - Brand identity implementation strictly adhering to the 16-page Neziora Brand Book (Neziora Red `#FC0229`, Neziora Black `#0A0A0A`, Graphite `#1A1A1A`, Steel Gray `#8A8A8A`, Light Gray `#F2F2F2`, White `#FFFFFF`).
  - Typography system utilizing Michroma, Sora, Inter, Jost, and fallback Sinhala font stacks.
  - Dark Mode (default) and Light Mode toggle with dynamic brand asset swapping.
- **Module A — Dashboard:**
  - Real-time application metrics (corpus cases, recorded test runs, passed/failed counts).
  - Browser engine capability detectors (Intl.Segmenter, Unicode normalization, Clipboard API).
  - Quick launch links to testing tools and recent local test runs table.
- **Module B — Sinhala Unicode Inspector:**
  - Code point decomposition and hexadecimal code formatting (`U+XXXX`).
  - Comprehensive Unicode name mapping for the Sinhala block (U+0D80–U+0DFF) and control characters (ZWJ, ZWNJ, NBSP).
  - Simultaneous calculation of UTF-16 code units, Unicode code points, grapheme clusters, and UTF-8 bytes.
  - Visual sequence comparator to detect invisible differences between similar strings.
- **Module C — Sinhala Test Corpus:**
  - Curated collection of 29 structured test cases across 13 phonological and orthographic categories.
  - Search filter by test ID, name, or Sinhala text.
  - Category and validation status filtering (verified, needs-review, exploratory).
  - Direct 1-click loading into Unicode Inspector, Interaction Playground, and Normalization module.
  - In-app test result recorder modal saving to private `localStorage`.
- **Module D — Text Interaction Playground:**
  - Multi-target editing testing: HTML `<input>`, `<textarea>`, `<div contenteditable="true">`, and read-only display.
  - Real-time event logger capturing `beforeinput`, `input`, `keydown`, `keyup`, and clipboard events.
  - Live caret offset and selection inspector.
  - Structured manual test checklist for backspace, arrow navigation, text selection, and clipboard insertion.
- **Module E — Unicode Normalization Testing:**
  - Native comparison of strings across NFC, NFD, NFKC, and NFKD.
  - Side-by-side code point sequence diff and canonical equivalence indicators.
  - Built-in presets for two-part O-vowel, Sannaka vs nasal, and ZWJ stability.
  - Export comparison data as JSON.
- **Module F — Text Length & Input Limit Testing:**
  - Reactive measurement across all 4 counting systems (grapheme clusters, code points, UTF-16 units, bytes).
  - HTML `maxlength` simulator demonstrating how standard browser inputs truncate multi-code-point combining sequences and leave broken glyphs.
  - Grapheme-aware safe truncation demonstration.
- **Module G — Copy and Paste Testing:**
  - Dedicated clipboard testing bench with modern `navigator.clipboard` integration and `execCommand` fallback.
  - Round-trip fidelity analyzer detecting whether ZWJ (`U+200D`) is stripped during OS or browser transmission.
  - Side-by-side code point diff table.
- **Module H — Browser Environment Information:**
  - Detailed diagnostic inspection of browser capabilities, platform, and internationalization APIs.
  - Comparative preview of Sinhala font stacks (Noto Sans Sinhala, Iskoola Pota, Nirmala UI).
- **Module I — Test Results & Reports:**
  - Stored test records manager with privacy disclosure and storage usage monitor.
  - Export reports in structured JSON format.
  - Export reports in GitHub-flavored Markdown format.
  - Import previous JSON reports to resume testing across browsers.
- **Testing & Quality:**
  - Automated Node.js unit test suite (`tests/unit/run-tests.js`) verifying 29 core assertions.
  - Optional Playwright browser automation configuration (`tests/browser/`).
  - Comprehensive documentation suite.

