# SiWIT Features & Technical Capabilities

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  
**Version:** 0.1.0  

This document provides a comprehensive technical reference for all implemented and planned features in SiWIT.

---

## Implemented Features (Release 0.1.0)

### 1. Project Dashboard (Module A)
- **Purpose:** Provide an operational cockpit displaying real-time metrics, system health, browser API capabilities, and quick links to testing modules.
- **How it Works:** Dynamically queries `localStorage` to compute passed, failed, review, and manual test counts; inspects the active browser's runtime environment (`Intl.Segmenter`, `String.prototype.normalize`, `navigator.clipboard`); renders interactive navigation tiles.
- **How to Use:** Open the application; the Dashboard loads by default (`#dashboard`).
- **Expected Output:** Accurate numeric counts of available test cases and locally recorded runs; real API availability badges; recent test runs table.
- **Technical Implementation:** Vanilla JavaScript in `js/modules/dashboard.js`, styled with custom grid cards in `css/components.css`.
- **Mode:** Automated metrics calculation.

### 2. Sinhala Unicode Inspector (Module B)
- **Purpose:** Perform forensic inspection of Sinhala strings, breaking down complex combining sequences into atomic Unicode code points, UTF-16 units, and grapheme clusters.
- **How it Works:** Iterates through text via `for...of` to extract code points; queries the internal dictionary `UNICODE_NAMES` (covering U+0D80–U+0DFF and format controls); executes `Intl.Segmenter` for orthographic syllables; calculates UTF-8 byte length via `TextEncoder`.
- **How to Use:** Navigate to `#inspector`, type or paste Sinhala text (or click a quick preset like `ශ්‍රී`, `ක්‍රමය`, `විද්‍යාව`), and review the live metrics and visual pill grid.
- **Expected Output:** Hexadecimal values (`U+XXXX`), official Unicode character names, classification tags (Consonant, Dependent Vowel Sign, Virama, Format Control), and code unit indices.
- **Technical Implementation:** `js/modules/unicode-inspector.js` and `js/utils/unicode.js`.
- **Mode:** Automated deterministic inspection.

### 3. Sinhala Test Corpus (Module C)
- **Purpose:** Serve as a curated, searchable repository of 29 documented Sinhala test cases categorized across vowels, vowel signs, virama, yansaya, rakaransaya, repaya, bandiyakuru, sannaka, mixed script, and boundary cases.
- **How it Works:** Fetches and parses `data/sinhala-test-cases.json`; provides real-time client-side search and category filtering; provides 1-click handoff buttons to load strings into the Inspector, Playground, or Normalization modules.
- **How to Use:** Navigate to `#corpus`, filter by category pill or search bar; click "Inspect" or "Playground" on any case; click "Record Result" to log an observation.
- **Expected Output:** Rich test cards displaying unique ID, name, Sinhala glyph, description, purpose, expected behavior, and references.
- **Technical Implementation:** `js/modules/corpus.js`.
- **Mode:** Interactive repository with automated filtering.

### 4. Text Interaction Playground (Module D)
- **Purpose:** Provide a live testing ground to evaluate text insertion, deletion, backspace behavior, caret travel, and selection across four distinct web editing surfaces.
- **How it Works:** Hosts a single-line `<input>`, multiline `<textarea>`, rich `<div contenteditable="true">`, and read-only display. Attaches an event harness listening for `beforeinput`, `input`, `keydown`, `keyup`, and clipboard events, displaying timestamps, input types, and key details in a real-time timeline logger.
- **How to Use:** Navigate to `#playground`, load a string via the test string loader or dropdown, perform manual interactions (type, backspace, highlight, cut/copy), observe the event log, check off manual checklist items, and save the result.
- **Expected Output:** Real-time event stream logging, live caret offset / selection indices (`[start..end]`), and evaluation persistence.
- **Technical Implementation:** `js/modules/interaction-tests.js`.
- **Mode:** Interactive manual test harness with automated event logging.

### 5. Unicode Normalization Testing (Module E)
- **Purpose:** Compare text representations across native Unicode Normalization Forms (NFC, NFD, NFKC, NFKD) to identify canonical equivalence and prevent database index corruption or search failures.
- **How it Works:** Applies native `String.prototype.normalize()` across all four forms; compares resulting strings and their underlying code point sequences; evaluates strict equality (`===`).
- **How to Use:** Navigate to `#normalization`, select a preset (e.g. Composed O-vowel vs Decomposed Kombuva + Aela-pilla) or enter custom sequences, and observe the side-by-side equivalence table and code point diffs.
- **Expected Output:** Direct equality verdict, normalization breakdown table, and exportable JSON comparison.
- **Technical Implementation:** `js/modules/normalization.js`.
- **Mode:** Automated native normalization.

### 6. Text Length & Input Limit Testing (Module F)
- **Purpose:** Demonstrate the disparity between the four counting systems (grapheme clusters, code points, UTF-16 code units, and UTF-8 bytes) and show how standard HTML `maxlength` attributes corrupt Sinhala combining sequences.
- **How it Works:** Computes simultaneous measurements in real time; features a live `maxlength` simulator that flags trailing broken Zero-Width Joiners (`U+200D`) or unattached virama marks; contrasts native browser truncation with grapheme-aware safe slicing.
- **How to Use:** Navigate to `#length`, enter text, adjust the simulated limit number, and observe whether native `maxlength` truncates mid-syllable.
- **Expected Output:** Live 4-way length metrics, native input truncation warnings, and safe grapheme-aware preview.
- **Technical Implementation:** `js/modules/length-tests.js`.
- **Mode:** Automated calculation and interactive simulation.

### 7. Copy and Paste Testing (Module G)
- **Purpose:** Verify clipboard transmission fidelity for Sinhala text and ensure Zero-Width Joiners (`U+200D`) and combining marks survive copy/cut/paste round-trips.
- **How it Works:** Integrates `navigator.clipboard.writeText` and `readText` with fallback to `document.execCommand('copy')`; runs permission queries; compares source vs pasted code points in a bit-for-bit diff table.
- **How to Use:** Navigate to `#clipboard`, click "Copy to Clipboard", click "Paste via API" (or press Ctrl+V into the target area), and review the fidelity banner and code point diff table.
- **Expected Output:** Bit-for-bit fidelity confirmation or alert indicating stripped ZWJ or altered marks.
- **Technical Implementation:** `js/modules/clipboard-tests.js`.
- **Mode:** Semi-automated (user gesture required for clipboard read).

### 8. Browser Environment Information (Module H)
- **Purpose:** Inspect browser platform properties, internationalization API support, and compare rendering across major Sinhala font stacks.
- **How it Works:** Queries `navigator.userAgent`, `navigator.languages`, `window.isSecureContext`; executes runtime capability checks for `Intl.Segmenter` and `normalize`; renders side-by-side Sinhala phrases using `Noto Sans Sinhala`, `Iskoola Pota`, and `Nirmala UI`.
- **How to Use:** Navigate to `#browser` to view environmental telemetry and visual font comparisons.
- **Expected Output:** Verified API status badges, platform identification, and font rendering specimens.
- **Technical Implementation:** `js/modules/browser-info.js`.
- **Mode:** Automated runtime diagnosis.

### 9. Test Results & Reports System (Module I)
- **Purpose:** Store, review, manage, and export reproducible test execution reports.
- **How it Works:** Manages test records in `localStorage` under `siwit_test_records_v1`; provides storage usage measurement; exports comprehensive reports as structured JSON or GitHub-flavored Markdown; supports importing previous JSON reports.
- **How to Use:** Navigate to `#reports`, review recorded test runs, click "Export JSON Report" or "Export Markdown Report", or click "Clear All Records" to purge storage.
- **Expected Output:** Formatted `.json` and `.md` files containing environment metadata, timestamps, test strings, and observed behaviors.
- **Technical Implementation:** `js/modules/reports.js` and `js/utils/storage.js`.
- **Mode:** Automated storage and report generation.

---

## Planned Future Capabilities (Roadmap)

1. **Automated Cross-Browser CI Matrix:** GitHub Actions workflow executing Playwright across headless Chromium, Firefox, and WebKit on Windows, macOS, and Ubuntu.
2. **OpenType Feature Table Inspector:** Direct client-side parsing of TTF/WOFF2 font files to inspect `GSUB` (Glyph Substitution) and `GPOS` (Glyph Positioning) tables for Sinhala ligatures.
3. **W3C Internationalization Test Importer:** Automated ingestion of upstream W3C Sinhala test cases into SiWIT format.

