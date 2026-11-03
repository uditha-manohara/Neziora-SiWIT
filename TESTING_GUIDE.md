# SiWIT QA & Verification Guide

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  
**Version:** 0.1.0  

This guide provides QA automation engineers, software testers, and internationalization specialists with the complete verification protocol for testing Sinhala web interoperability.

---

## 1. Test Environment Preparation

### Supported Browsers for Testing:
- **Chromium Engines:** Google Chrome (v110+), Microsoft Edge (v110+), Brave, Opera.
- **Gecko Engine:** Mozilla Firefox (v120+).
- **WebKit Engine:** Apple Safari (v15+ on macOS and iOS).

### Hardware & OS Matrix:
- **Windows:** Windows 10 / Windows 11 (with native `Iskoola Pota` and `Nirmala UI` fonts).
- **macOS:** macOS Monterey / Ventura / Sonoma (with `Sinhala Sangam MN`).
- **Linux:** Ubuntu 22.04+ (with `fonts-noto-core` / `Noto Sans Sinhala`).
- **Android:** Android 11+ with system Sinhala fonts.

---

## 2. Automated Testing Execution

### Running Unit Tests:
Ensure Node.js is installed, then execute:
```bash
node tests/unit/run-tests.js
```
Expected output:
```
Tests Completed: 29
Passed: 29
Failed: 0
All automated unit tests passed successfully!
```

### What Automated Tests Cover:
1. Deterministic Unicode scalar extraction and hexadecimal formatting (`U+XXXX`).
2. Correct character classification for Sinhala vowels, consonants, dependent vowels, virama, and signs.
3. Multi-code-point combining cluster decomposition (e.g. `ශ්‍රී`, `ක්‍ර`, `විද්‍යාව`).
4. Canonical and compatibility normalization equality checks (NFC, NFD, NFKC, NFKD).
5. Retention of Zero-Width Joiner (`U+200D`) under normalization.
6. JSON schema validation and ID uniqueness for the 29 corpus test cases.

---

## 3. Manual Interactive Testing Protocol

### Protocol 1: Text Insertion & Editing (Module D)
1. Load test case **TC-RAK-01** (`ක්‍ර`) into the Playground.
2. Place the cursor between `ක` and `ර` (if possible) or directly after `ක්‍ර`.
3. Press **Backspace**:
   - *Expected Behavior:* The browser should either delete the entire cluster atomically, or decompose `ක්‍ර` to `ක්‍` then `ක`. It must NEVER leave an invisible corrupted joiner or unrendered blank glyph.
4. Press **Delete** (Forward delete):
   - *Expected Behavior:* Caret positioned before `ක්‍ර` deletes the cluster or first consonant cleanly.
5. Record observation in the **Evaluation Status** dropdown and click **Save Test Result**.

### Protocol 2: Caret Positioning & Arrow Navigation (Module D)
1. Load test case **TC-BAN-01** (`ක්ෂ`).
2. Position the caret before the cluster and press the **Right Arrow** key once.
3. *Expected Behavior:* In modern engines, the caret should step over the entire conjunct (`ක්ෂ`) in 1 step, or land cleanly after the conjunct. It should not stop inside the invisible ZWJ `U+200D`.
4. Inspect the **Caret & Selection** counter beneath the input field to verify the caret offset.

### Protocol 3: Normalization Equivalence (Module E)
1. Load preset **Composed O-Vowel vs Decomposed Kombuva + Aela-pilla**.
2. Sequence A: `කො` (`U+0D9A U+0DDC`).
3. Sequence B: `කො` (`U+0D9A U+0DD9 U+0DCF`).
4. Verify that:
   - Raw strict equality is `false`.
   - NFC normalized equality is `true`.
   - Both normalized forms match `කො` (`U+0D9A U+0DDC`).
5. Click **Export Comparison JSON** and verify the downloaded file contains the exact comparison breakdown.

### Protocol 4: HTML `maxlength` Boundary Truncation (Module F)
1. Navigate to Module F.
2. Set simulated limit to `6`.
3. Click preset `"ශ්‍රී ලංකා"`.
4. Observe the **Truncation Simulator**:
   - Native input contains: `ශ්‍රී ල` (6 UTF-16 code units: `U+0DC1 U+0DCA U+200D U+0DBB U+0DD3 U+0020`).
   - Notice that the word `ලංකා` was truncated before the second letter could even be completed!
   - Compare with the **Safe Grapheme-Aware Truncation** output on the right.

### Protocol 5: Clipboard Fidelity & Round-Trip Diff (Module G)
1. Navigate to Module G.
2. Click **Copy to Clipboard**.
3. Click **Paste via API** (or focus the paste target and press `Ctrl+V`).
4. Verify that the **Round-Trip Transmission Integrity Analysis** displays:
   `100% BIT-FOR-BIT FIDELITY`.
5. Check that the source ZWJ count equals the pasted ZWJ count.

### Protocol 6: Report Generation & Clearance (Module I)
1. Navigate to Module I.
2. Confirm all recorded test runs from Protocols 1–5 appear in the table.
3. Click **Export Markdown Report**.
4. Open the downloaded `.md` file in a Markdown previewer; verify that summary tables, timestamps, user-agent details, and test notes are populated cleanly.
5. Click **Clear All Records** and confirm dialog. Verify the table empties and storage usage drops to 0.00 KB.

---

## 4. Failure Investigation Guide

When a test fails, follow this investigation sequence:
1. **Is the defect font-related or engine-related?**
   - Switch fonts in Module H. If the issue occurs only with one font family, report to the font foundry (e.g. Google Fonts / Mooniak). If it occurs across all fonts, it is a browser layout engine issue.
2. **Did the string lose its Zero-Width Joiner (U+200D)?**
   - Inspect the string in Module B. If `U+200D` is missing, the ligature cannot form.
3. **Did normalization change the string?**
   - Test the string in Module E. Verify if NFC alters the combining sequence order.
4. **Was the string truncated by an input restriction?**
   - Test in Module F. Verify if the database column or HTML `maxlength` restricted by UTF-16 units rather than graphemes.

---

## 5. Release QA Checklist

- [x] Unit test suite passes 100% (`npm test`).
- [x] Tested on desktop viewports (1920x1080, 1366x768).
- [x] Tested on tablet viewports (768px).
- [x] Tested on mobile viewports (375px).
- [x] Dark and Light modes display compliant color contrast.
- [x] No console errors or uncaught promise rejections.
- [x] All 29 test cases in corpus have complete, valid metadata.

