# REFERENCES.md — Standards, Prior Art & Bibliography

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  

This document acknowledges and indexes the foundational international standards, specifications, research, and open-source tools consulted during the conception, architecture, and engineering of SiWIT.

---

## 1. Unicode Consortium Standards & Technical Reports

1. **The Unicode Standard (Version 15.0 / 16.0)**  
   *Chapter 13: South and Central Asian Scripts - I (Sinhala Block U+0D80–U+0DFF)*  
   Defines the authoritative character repertoire, character properties, combining classes, and canonical decomposition mappings for the Sinhala script.  
   Link: [https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/)

2. **Unicode Standard Annex #15 (UAX #15): Unicode Normalization Forms**  
   *Authors: Mark Davis, Ken Whistler*  
   Specifies the four canonical and compatibility normalization forms (NFC, NFD, NFKC, NFKD). Foundational for Module E.  
   Link: [https://www.unicode.org/reports/tr15/](https://www.unicode.org/reports/tr15/)

3. **Unicode Standard Annex #29 (UAX #29): Unicode Text Segmentation**  
   *Authors: Mark Davis, Peter Edberg*  
   Specifies guidelines for determining grapheme cluster boundaries, word boundaries, and sentence boundaries. Crucial for understanding why OpenType font shaping ligatures diverge from default ICU / `Intl.Segmenter` boundaries.  
   Link: [https://www.unicode.org/reports/tr29/](https://www.unicode.org/reports/tr29/)

---

## 2. National Standards of Sri Lanka

4. **SLS 1134:2011 — Sinhala Character Code for Information Interchange**  
   *Sri Lanka Standards Institution (SLSI) / ICTA*  
   The authoritative national standard governing Sinhala digital character encoding, collation, and keyboard layout specifications.  
   Reference: SLS 1134:2004 / SLS 1134:2011 Revision.

---

## 3. World Wide Web Consortium (W3C) Internationalization

5. **W3C Internationalization Working Group (i18n)**  
   *Developing guidelines, tests, and best practices for multilingual web content.*  
   Link: [https://www.w3.org/International/](https://www.w3.org/International/)

6. **Sinhala Script Summary (r12a / Richard Ishida)**  
   *A comprehensive linguistic, typographic, and orthographic resource covering Sinhala vowels, consonants, conjuncts, and combining behaviors.*  
   Link: [https://r12a.github.io/scripts/sinh/si.html](https://r12a.github.io/scripts/sinh/si.html)

7. **W3C Internationalization Test Suite (`w3c/i18n-tests`)**  
   *Repository of interactive and automated tests covering script rendering, bidirectional text, and text input.*  
   Link: [https://github.com/w3c/i18n-tests](https://github.com/w3c/i18n-tests)

8. **Web Platform Tests (`web-platform-tests/wpt`)**  
   *Cross-browser test suite for the Web-platform stack.*  
   Link: [https://github.com/web-platform-tests/wpt](https://github.com/web-platform-tests/wpt)

---

## 4. Prior Open-Source Sinhala Typography Projects

9. **Mooniak Sinhala Font Testing Page (`mooniak/sinhala-font-testing-page`)**  
   *A web-based typeface testing harness for verifying OpenType table rules and glyph coverage.*  
   Link: [https://github.com/mooniak/sinhala-font-testing-page](https://github.com/mooniak/sinhala-font-testing-page)

10. **Mooniak Sinhala Font Tools (`mooniak/sinhala-font-tools`)**  
    *Utilities and build chains for Sinhala font authoring and validation.*  
    Link: [https://github.com/mooniak/sinhala-font-tools](https://github.com/mooniak/sinhala-font-tools)

---

## 5. Organizational & Brand References

11. **Neziora Brand Guidelines (Brand Book)**  
    *Author: Uditha Manohara Prasad / Neziora, October 2026*  
    Specifies visual identity, typography (`Michroma`, `Sora`, `Inter`, `Jost`), primary colors (`#FC0229`, `#0A0A0A`, `#FFFFFF`), supporting colors (`#1A1A1A`, `#8A8A8A`, `#F2F2F2`), and logo clear space guidelines.

---

## 6. Responsible Disclosure & Claim Boundaries

SiWIT does not claim to replace W3C Internationalization tests or Unicode standards. Rather, SiWIT provides a consolidated, browser-executable testing workbench and test corpus aimed specifically at solving web application interoperability challenges (DOM editing, cursor placement, clipboard fidelity, length truncation, and normalization) for Sinhala software engineers.

