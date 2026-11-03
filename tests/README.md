# SiWIT Automated Testing Guide

This directory contains automated verification suites for the **SiWIT (Sinhala Web Interoperability Test Kit)**.

**Creator & Project Lead:** Uditha Manohara Prasad  
**Published under:** Neziora  

---

## 1. Unit Tests (Zero External Dependencies)

The unit test suite runs directly on Node.js without requiring third-party npm packages. It verifies:
- Unicode hex formatting (`formatHex`, `formatCodeUnit`).
- Character name lookups for the Sinhala Unicode block (`U+0D80`–`U+0DFF`) and format controls (ZWJ, ZWNJ, NBSP).
- Decomposition of complex combining sequences (e.g., `ශ්‍රී`, `ක්‍ර`, `විශ්වවිද්‍යාලය`).
- UAX #29 grapheme cluster segmentation via native `Intl.Segmenter`.
- Unicode Normalization Forms (NFC, NFD, NFKC, NFKD) equivalence and ZWJ retention.
- Schema integrity of `data/sinhala-test-cases.json` (ID uniqueness, non-empty fields, metadata completeness).

### Running Unit Tests:
```bash
node tests/unit/run-tests.js
```
or via npm:
```bash
npm test
```

---

## 2. Optional Browser Automation with Playwright

For teams wishing to run end-to-end browser automation in continuous integration (CI) environments, a lightweight Playwright suite is provided in `tests/browser/`.

> **Note:** Playwright is entirely optional. SiWIT is designed to be 100% functional and testable in any web browser without Node.js or npm packages.

### Setup (Only if running E2E automation):
```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### Running Browser E2E Tests:
```bash
npx playwright test --config=tests/browser/playwright.config.js
```

