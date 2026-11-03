# Contributing to SiWIT

Thank you for your interest in contributing to **SiWIT (Sinhala Web Interoperability Test Kit)**!

**Creator & Project Lead:** Uditha Manohara Prasad  
**Published under:** Neziora  

SiWIT is an open-source initiative designed to bring precision, reproducibility, and engineering clarity to Sinhala digital text handling on the web.

---

## 1. Code of Conduct & Attribution

- **Creator Recognition:** This project was initiated, architected, and led by Uditha Manohara Prasad, published under the Neziora brand. All contributions remain under the MIT License with appropriate author recognition.
- **Respectful & Constructive Collaboration:** We welcome developers, linguists, QA engineers, font designers, and open-source contributors from Sri Lanka and across the globe.

---

## 2. Development Setup

SiWIT is deliberately engineered with **zero required dependencies** and **no complex build pipeline**.

### Prerequisites:
- A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).
- (Optional) Node.js v16+ for running automated unit tests or local static serving.

### Quick Start:
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/Neziora-SiWIT.git
   cd Neziora-SiWIT
   ```
2. Start a local HTTP server:
   - With Node.js / npx:
     ```bash
     npx serve .
     ```
   - With Python:
     ```bash
     python -m http.server 8080
     ```
   - With PowerShell:
     ```powershell
     # Run any local static server of your choice
     ```
3. Open `http://localhost:3000` (or `http://localhost:8080`) in your web browser.

---

## 3. Coding Standards & Principles

1. **Pure Vanilla Web Technologies:**
   - Write standard HTML5, CSS3, and ES6+ JavaScript modules.
   - Do **NOT** introduce heavy frameworks (React, Vue, Angular, Next.js), UI component kits, or compile-time dependencies into the core application.
2. **Security & DOM Safety:**
   - Never inject unescaped user input into the DOM via raw `innerHTML`. Always use `escapeHTML()` from `js/utils/dom.js` or create text nodes.
3. **Privacy First:**
   - Never send user text or test telemetry to external network endpoints. All processing must remain 100% client-side.
4. **Adherence to Brand Guidelines:**
   - Adhere to the Neziora Brand Guidelines (`neziora_brand_guidelines.pdf` and `BRAND_IMPLEMENTATION.md`):
   - Primary: Neziora Red (`#FC0229`), Neziora Black (`#0A0A0A`), White (`#FFFFFF`).
   - Supporting: Graphite (`#1A1A1A`), Steel Gray (`#8A8A8A`), Light Gray (`#F2F2F2`).
   - Use red strictly as a spark accent (≤ 10% of surface area). Never recolor or distort official logo assets.

---

## 4. How to Add or Refine Sinhala Test Cases

All test cases reside in `data/sinhala-test-cases.json`.

### Schema for New Cases:
```json
{
  "id": "TC-CATEGORY-NUMBER",
  "name": "Descriptive Title",
  "category": "one-of-standard-categories",
  "testString": "actual Sinhala string",
  "description": "Linguistic and orthographic explanation",
  "purpose": "What this case tests in browser engines or fonts",
  "expectedBehavior": "Expected behavior according to Unicode / SLS 1134",
  "testInstructions": "Step-by-step reproduction instructions",
  "sourceOrReference": "Unicode 15.0 / SLS 1134 / W3C",
  "validationStatus": "verified | needs-review | exploratory",
  "notes": "Relevant browser quirks or font nuances"
}
```

### Validation Rules:
- IDs must be unique.
- Do not assert expected outcomes without verified standards evidence. If uncertain, mark `validationStatus` as `"needs-review"`.
- Run automated validation tests after editing:
  ```bash
  node tests/unit/run-tests.js
  ```

---

## 5. Submitting Pull Requests

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/add-repaya-tests
   ```
2. Verify that all automated unit tests pass:
   ```bash
   npm test
   ```
3. Commit your changes with clear, professional commit messages:
   ```bash
   git commit -m "feat(corpus): add classical Repaya test cases for SLS 1134 compliance"
   ```
4. Push to your fork and submit a Pull Request against `main`.
5. In your PR description, explain the rationale, reference applicable Unicode/W3C sections, and detail testing performed across browsers.

