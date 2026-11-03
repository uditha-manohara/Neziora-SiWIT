# SiWIT Test Case Format & Contribution Specification

**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  
**Created & Led by:** Uditha Manohara Prasad  
**Published under:** Neziora  

---

## 1. Test Case JSON Schema

Every test case in `data/sinhala-test-cases.json` is a structured JSON object adhering to the following schema:

```json
{
  "id": "TC-XYZ-01",
  "name": "Human-readable Title",
  "category": "one-of-standard-categories",
  "testString": "සිංහල text",
  "description": "Thorough linguistic and technical explanation",
  "purpose": "What this test verifies in browser or font engines",
  "expectedBehavior": "Standard behavior according to Unicode / W3C",
  "testInstructions": "Step-by-step actions for manual or automated reproduction",
  "sourceOrReference": "Unicode Standard, SLS 1134, or W3C i18n link",
  "validationStatus": "verified | needs-review | exploratory",
  "notes": "Edge cases, known engine divergences, or historical context"
}
```

---

## 2. Recognized Categories

1. `independent-vowels`: Syllable-initial standalone vowels (e.g. `අ`, `ආ`, `ඇ`, `ඈ`, `ඉ`, `ඊ`, `උ`, `ඌ`, `ඍ`, `එ`, `ඒ`, `ඓ`, `ඔ`, `ඕ`, `ඖ`).
2. `vowel-signs`: Consonants modified by dependent vowel signs / pili (e.g. `කා`, `කැ`, `කි`, `කු`, `කෘ`, `කෙ`, `කො`).
3. `virama-pure-consonants`: Consonants carrying the Al-lakuna (virama `U+0DCA`) suppressing the inherent vowel (e.g. `ක්`, `ත්`, `ම්`).
4. `yansaya`: Medial Ya ligatures formed with ZWJ: `Consonant + U+0DCA + U+200D + U+0DBA` (e.g. `ක්‍ය`, `ත්‍ය`).
5. `rakaransaya`: Medial Ra ligatures formed with ZWJ: `Consonant + U+0DCA + U+200D + U+0DBB` (e.g. `ක්‍ර`, `ප්‍ර`, `ශ්‍රී`).
6. `repaya`: Initial Ra ligatures formed with ZWJ: `U+0DBB + U+0DCA + U+200D + Consonant` (e.g. `ර්‍ය`, `ර්‍ථ`).
7. `bandi-akuru`: Consonant conjuncts (touch/fused): `Consonant + U+0DCA + U+200D + Consonant` (e.g. `ක්ෂ`, `ණ්ඩ`, `ත්ත`, `න්ද`).
8. `touch-consonants`: Touching consonants using ZWNJ: `Consonant + U+0DCA + U+200C + Consonant` (e.g. `ක්‌ෂ`).
9. `prenasalized-sannaka`: Single atomic prenasalized stops (`ඟ`, `ඳ`, `ඬ`, `ඹ`) tested against distinct nasal sequences (`න්ග`, `න්ද`, etc.).
10. `punctuation`: Traditional and special signs (e.g. `෴` Kunddaliya, `ං` Anusvaraya, `ඃ` Visargaya).
11. `mixed-script`: Multilingual sentences, numbers, currencies, and punctuation boundaries.
12. `normalization`: Cases where canonical or compatibility composition/decomposition behavior differs.
13. `length-truncation`: Words containing combining marks or ZWJ where naive length restrictions cause character corruption.

---

## 3. Validation Status Guidelines

- **`verified`**: The expected behavior is explicitly grounded in the Unicode Standard, SLS 1134, or W3C internationalization specifications, and has been verified with reproducible tests.
- **`needs-review`**: The case represents an unresolved discrepancy or conflicting behavior across browser vendors / font foundries.
- **`exploratory`**: The case is under investigation to establish consensus on ideal user experience (e.g. caret travel through multi-character conjuncts).

