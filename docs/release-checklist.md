# SiWIT Release Checklist (v0.1.0)

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  

Before publishing or creating a tagged release on GitHub, execute the following 20 verification steps:

---

## 1. Brand & Attribution Integrity
- [x] Official Neziora logo assets placed in `assets/logos/` without distortion, recoloring, or retyping.
- [x] Brand colors adhere strictly to guidelines: `#FC0229` (spark highlight ≤10%), `#0A0A0A` (dark base), `#FFFFFF` (light/text), `#1A1A1A` (graphite surface), `#8A8A8A` (steel gray secondary).
- [x] Typography system utilizes official Google Fonts: Michroma (Display), Sora (Headings), Inter (Body), Jost (Labels & Slogans) alongside robust Sinhala font fallbacks.
- [x] Creator & Project Lead (Uditha Manohara Prasad) is prominently attributed across Header, Footer, About section, README, and project metadata.
- [x] Publishing affiliation is clearly documented as "Published under the Neziora brand."

## 2. Technical Quality & Testing
- [x] All 29 automated unit tests pass 100% (`node tests/unit/run-tests.js`).
- [x] Sinhala test corpus (`data/sinhala-test-cases.json`) adheres to the JSON schema without duplicate IDs.
- [x] Unicode Inspector (Module B) correctly decomposes complex clusters (`ශ්‍රී`, `ක්‍ර`, `විද්‍යාව`, `කොළඹ`).
- [x] Interaction Playground (Module D) handles `input`, `textarea`, `contenteditable`, and read-only environments without throwing JavaScript errors.
- [x] Real-time event logger captures `beforeinput`, `input`, `keydown`, `keyup`, and clipboard events cleanly.
- [x] Normalization module (Module E) executes native `NFC`, `NFD`, `NFKC`, and `NFKD` comparisons.
- [x] Text length module (Module F) correctly distinguishes between UTF-16 code units, Unicode code points, grapheme clusters, and UTF-8 bytes.
- [x] HTML `maxlength` simulator detects broken combining marks or orphaned ZWJ trailing characters.
- [x] Clipboard module (Module G) gracefully detects permissions and provides manual fallback if unsecure or denied.
- [x] Browser Info module (Module H) tests `Intl.Segmenter` and font stack rendering without crashing.
- [x] Test Results & Reports module (Module I) accurately calculates metrics, saves to `localStorage`, and successfully exports both JSON and Markdown.
- [x] "Clear All Records" control functions cleanly and empties `localStorage`.

## 3. Security, Privacy & Compatibility
- [x] 100% client-side: Zero external API calls, zero telemetry, zero cookies.
- [x] All user-entered text escaped prior to HTML rendering to prevent DOM-based XSS.
- [x] Mobile responsive layout verified across screen widths down to 360px.
- [x] Dark and Light themes switch cleanly with corresponding logo assets.
- [x] Static hosting compatible with GitHub Pages.

