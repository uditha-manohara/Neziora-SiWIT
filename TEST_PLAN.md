# TEST_PLAN.md — SiWIT Verification and Test Plan

## 1. Scope and Strategy
The testing strategy for SiWIT combines:
1. **Automated Unit Tests:** Testing deterministic algorithms (Unicode code point extraction, UTF-16 count, grapheme counting via `Intl.Segmenter`, byte length calculation, NFC/NFD normalization, JSON test corpus validity, and report generation).
2. **Interactive Manual Tests:** Verifying browser-specific input, editing, backspace, forward deletion, cursor travel, selection, cut/copy/paste, and focus behavior across standard text input, textarea, and contenteditable elements.
3. **Cross-Browser & Platform Verification:** Validating behavior across modern desktop and mobile browsers (Chrome/Chromium, Firefox, Safari/WebKit, Edge).

---

## 2. Test Categories & Cases

### Category 1: Unicode Decomposition & Character Naming
- **TC-UNI-01:** Basic Sinhala consonant (`ක` `U+0D9A`) decomposes to single code point, 1 UTF-16 code unit, 1 grapheme cluster.
- **TC-UNI-02:** Consonant + dependent vowel sign (`කා` `U+0D9A U+0DCF`) decomposes to 2 code points, 2 UTF-16 code units, 1 grapheme cluster.
- **TC-UNI-03:** Consonant + Virama / Hal-lakuna (`ක්` `U+0D9A U+0DCA`) decomposes to 2 code points, 2 UTF-16 code units, 1 grapheme cluster.
- **TC-UNI-04:** Yansaya sequence (`ක්‍ය` `U+0D9A U+0DCA U+200D U+0D90`) decomposes to 4 code points, 4 UTF-16 units, 1 grapheme cluster.
- **TC-UNI-05:** Rakaransaya sequence (`ක්‍ර` `U+0D9A U+0DCA U+200D U+0DBB`) decomposes to 4 code points, 4 UTF-16 units, 1 grapheme cluster.
- **TC-UNI-06:** Complex multi-modifier sequence (`ශ්‍රී` `U+0D88 U+0DCA U+200D U+0DBB U+0DD3`) decomposes to 5 code points, 5 UTF-16 units, 1 grapheme cluster.
- **TC-UNI-07:** Touch consonant (Bandiyakuru) sequence (`ණ්ඩ` `U+0DAB U+0DCA U+200D U+0DA9`) decomposes to 4 code points, 4 UTF-16 units, 1 or 2 grapheme clusters depending on platform segmentation.

### Category 2: Normalization (NFC / NFD / NFKC / NFKD)
- **TC-NORM-01:** Composed vs decomposed O-vowel sign (`කො` as `U+0D9A U+0DDC` vs `U+0D9A U+0DD9 U+0DCF`). NFC should compose to `U+0DDC`, NFD should decompose to `U+0DD9 U+0DCF`.
- **TC-NORM-02:** Canonical and compatibility equivalence evaluation on ZWJ (`U+200D`) and ZWNJ (`U+200C`). Verify that normalization does NOT remove or distort ZWJ.

### Category 3: Length & Input Limits
- **TC-LEN-01:** Comparison of counting methods (UTF-16 vs Unicode Code Points vs Grapheme Clusters vs UTF-8 Bytes) on single-cluster vs multi-cluster Sinhala words.
- **TC-LEN-02:** Truncation detection when `maxlength` cuts through a multi-code-point combining sequence, leaving an orphaned vowel or virama.

### Category 4: Interaction Playground
- **TC-INT-01:** Typing into standard HTML `input` and checking event sequence (`beforeinput` -> `input` -> `keyup`).
- **TC-INT-02:** Backspacing over a complex cluster (`ශ්‍රී` or `ක්‍ර`): verify whether browser deletes the entire cluster or deletes one code point at a time (decomposing back into `ක්‍` then `ක`).
- **TC-INT-03:** Contenteditable caret positioning and selection across Sinhala words.

### Category 5: Clipboard Operations
- **TC-CLIP-01:** Copy Sinhala text to system clipboard via Clipboard API and verify Unicode integrity upon paste.
- **TC-CLIP-02:** Verify fallback behavior when Clipboard API permission is restricted or denied.

### Category 6: Report Generation & Storage
- **TC-REP-01:** Record test result with status (Pass / Fail / Needs Review / Manual Test) and verify local storage persistence.
- **TC-REP-02:** Export results as valid JSON file and verify schema compliance.
- **TC-REP-03:** Export results as readable, properly formatted Markdown report.
- **TC-REP-04:** Execute "Clear All Stored Results" and verify LocalStorage is emptied.

---

## 3. Regression Testing & Execution
- Unit test suite executable via Node.js: `node tests/unit/run-tests.js`.
- Automated test results must pass 100% before release.

