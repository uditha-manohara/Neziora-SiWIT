# SiWIT User Guide & Operational Manual

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  
**Version:** 0.1.0  

Welcome to SiWIT! This guide provides step-by-step instructions for testing, inspecting, and documenting Sinhala text interoperability in web applications.

---

## 1. Getting Started

### 1.1 Opening SiWIT
You can run SiWIT locally or host it statically on GitHub Pages.

#### Running Locally (Recommended):
Due to browser security restrictions on ES module imports via the `file://` protocol, run a lightweight static server:
- **Using Node.js:**
  ```bash
  npx serve .
  ```
  Open `http://localhost:3000` in your browser.
- **Using Python:**
  ```bash
  python -m http.server 8080
  ```
  Open `http://localhost:8080` in your browser.

---

## 2. Navigating the Interface

SiWIT is organized into a clean sidebar navigation with two primary theme modes:
- **Theme Toggle:** Click the **🌙 Dark Mode / ☀️ Light Mode** button in the top right header at any time. The interface dynamically adjusts surface colors according to official Neziora Brand Book rules while preserving official brand logo marks.
- **Sidebar Menu:** Click any section to navigate instantly:
  - **Dashboard:** Overview of test cases, recent test runs, and browser engine capabilities.
  - **Unicode Inspector:** Decompose any Sinhala text into atomic code points and graphemes.
  - **Test Corpus:** Browse, search, and filter 29 curated Sinhala test cases.
  - **Interaction Playground:** Test typing, deletion, caret positioning, and event streams.
  - **Normalization:** Compare NFC, NFD, NFKC, and NFKD forms.
  - **Length & Limits:** Compare counting methods and test `maxlength` truncation.
  - **Copy & Paste:** Verify clipboard round-trip fidelity and ZWJ retention.
  - **Browser Environment:** View detected browser APIs, platform details, and font fallbacks.
  - **Results & Reports:** Review saved results and export reports as JSON or Markdown.

---

## 3. Step-by-Step Module Guides

### 3.1 Module B: Inspecting Sinhala Unicode Sequences
1. Click **Unicode Inspector** in the sidebar.
2. Type or paste Sinhala text into the text area, or click one of the quick preset buttons (e.g. `ශ්‍රී`, `ක්‍රමය`, `විද්‍යාව`).
3. Notice the four metrics displayed immediately:
   - **Grapheme Clusters:** The count of visible syllables (e.g. `ශ්‍රී` = 2 clusters in standard UAX #29; `ක` = 1 cluster).
   - **Unicode Code Points:** The count of Unicode scalar values (e.g. `ශ්‍රී` = 5 code points).
   - **UTF-16 Code Units:** Standard JavaScript `string.length` (e.g. `ශ්‍රී` = 5 units).
   - **UTF-8 Byte Size:** Storage/wire size (e.g. `ශ්‍රී` = 15 bytes).
4. Scroll down to review the **Grapheme Clusters & Code Point Decomposition** cards. Each code point shows its hexadecimal value (`U+XXXX`), character name, and script category.
5. Use the **Visual Sequence Comparator** at the bottom to test two visually similar sequences (e.g. `ක්‍ර` with ZWJ vs `ක්ර` without ZWJ) to detect hidden differences.

### 3.2 Module C: Using the Test Corpus
1. Click **Test Corpus** in the sidebar.
2. Use the search bar to find cases by keyword (e.g. "Yansaya", "Sri", "Kunddaliya").
3. Filter by category pills (e.g. "Independent Vowels", "Vowel Signs", "Bandi-akuru").
4. On any test case card:
   - Click **Inspect** to load the string directly into the Unicode Inspector.
   - Click **Playground** to load the string into the Interaction Playground.
   - Click **Record Result** to record whether your current browser passed or failed the expected behavior.

### 3.3 Module D: Testing Editing & Caret Movement
1. Click **Interaction Playground** in the sidebar.
2. Choose a test string from the dropdown or type your own, then click **Load String into All Fields**.
3. Perform the following manual checks:
   - **Typing:** Type Sinhala characters and observe the **Real-Time Event Stream Logger**.
   - **Backspace Test:** Place the caret after a complex cluster (like `ක්‍ර` or `ශ්‍රී`) and press **Backspace** once. Does the browser remove the whole cluster, or does it remove one code point at a time?
   - **Arrow Navigation:** Press Left and Right arrow keys across conjuncts. Does the cursor jump cleanly between syllables, or does it stop inside invisible format characters?
   - **Selection:** Drag the mouse or press Shift+Right Arrow. Does the selection highlight entire syllables?
4. Under the **Manual Test Checklist**, check off the verified steps, select an **Evaluation Status** (Pass, Fail, or Needs Review), add any relevant notes, and click **Save Test Result**.

### 3.4 Module E: Testing Normalization Forms
1. Click **Normalization Testing** in the sidebar.
2. Select a preset (e.g. "Composed O-Vowel vs Decomposed Kombuva + Aela-pilla") or enter two custom strings.
3. Observe the **Direct Equality Banner**:
   - If raw strings differ, check the **Unicode Normalization Forms Breakdown** table.
   - Look at the **NFC** row: if `කො` (U+0D9A U+0DDC) and decomposed `කො` (U+0D9A U+0DD9 U+0DCF) display **EQUIVALENT**, the engine canonicalizes them to the same form.
4. Click **Export Comparison JSON** to save the comparison payload.

### 3.5 Module F: Testing Length & Input Limits
1. Click **Length & Input Limits** in the sidebar.
2. Enter text into the top box to inspect simultaneous counts across Graphemes, Code Points, UTF-16 units, and UTF-8 bytes.
3. In the **HTML maxlength Truncation Simulator**:
   - Set a limit (e.g. `6`).
   - Click one of the test phrases (e.g. `"ශ්‍රී ලංකා"` or `"විශ්වවිද්‍යාලය"`).
   - Observe the native input on the left vs the safe grapheme slice on the right.
   - If the native input cut off a word mid-combining-mark, the **Truncation Artifact Alert** will flag the exact defect.

### 3.6 Module G: Testing Copy & Paste Integrity
1. Click **Copy & Paste Testing** in the sidebar.
2. Check the **Context Security** and **Clipboard API** status badges.
3. Click **Copy to Clipboard**.
4. Click **Paste via API** (or focus the paste target and press Ctrl+V / Cmd+V).
5. Review the **Round-Trip Transmission Integrity Analysis** banner.
   - If **100% BIT-FOR-BIT FIDELITY** is green, all ZWJ joiners and combining marks survived clipboard transmission.
   - If a failure is shown, inspect the **Diff Table** below to identify which code point was dropped or modified.

### 3.7 Module I: Generating & Exporting Reports
1. Click **Results & Reports** in the sidebar.
2. Review all test runs recorded during your session.
3. Click **Export JSON Report** to download a structured JSON file suitable for automated analysis or CI archives.
4. Click **Export Markdown Report** to generate a formatted Markdown summary ready to paste into GitHub issues, bug trackers, or email reports.
5. If you want to purge recorded data, click **Clear All Records** and confirm.

---

## 4. Understanding Unicode Measurements

| Metric | What it Measures | JavaScript Expression | When to Use in Applications |
|---|---|---|---|
| **Grapheme Clusters** | Visible orthographic syllables | `Intl.Segmenter(..., { granularity: 'grapheme' })` | User-facing character counts (e.g. post length limits, SMS message counters). |
| **Unicode Code Points** | Assigned scalar values in Unicode | `[...str].length` or `Array.from(str).length` | General string iteration, regex matching, character lookups. |
| **UTF-16 Code Units** | 16-bit code units | `str.length` | Standard DOM string operations; HTML `maxlength` attribute. |
| **UTF-8 Bytes** | Wire transmission & storage bytes | `new TextEncoder().encode(str).length` | Database column sizing (e.g. `VARCHAR(N)` in MySQL/PostgreSQL), network payloads. |

---

## 5. Troubleshooting Common Problems

### Problem 1: Test cases or JSON files fail to load
- **Cause:** Opening `index.html` via `file://` in browsers that block local file `fetch()` calls.
- **Solution:** Start a local HTTP server using `npx serve .` or `python -m http.server 8080`.

### Problem 2: Async Clipboard read fails
- **Cause:** Browser security policies require a secure context (HTTPS or localhost) and explicit user permission to read the clipboard.
- **Solution:** Focus the destination textarea directly and press `Ctrl+V` (Windows/Linux) or `Cmd+V` (macOS). The native paste event will be captured and evaluated automatically.

### Problem 3: Sinhala text looks spaced or disconnected
- **Cause:** Missing Sinhala-capable font on your operating system, or broken Zero-Width Joiner (`U+200D`).
- **Solution:** Ensure `Noto Sans Sinhala` or `Iskoola Pota` is installed. Check the string in the **Unicode Inspector** to verify that `U+200D` is present between the virama and consonant.

