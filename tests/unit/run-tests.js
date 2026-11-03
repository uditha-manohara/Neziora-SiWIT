/**
 * SiWIT — Automated Unit Test Suite
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Verifies core deterministic algorithms:
 * - Unicode decomposition
 * - Hex code formatting
 * - Grapheme cluster calculation
 * - Normalization forms (NFC / NFD / NFKC / NFKD)
 * - Test corpus schema integrity
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  formatHex,
  formatCodeUnit,
  getCodePoints,
  getCodeUnits,
  calculateLengths,
  compareNormalization,
  UNICODE_NAMES
} from '../../js/utils/unicode.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

function assertEqual(actual, expected, testName) {
  totalTests++;
  if (actual === expected) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} (Expected: "${expected}", Received: "${actual}")`);
  }
}

console.log('\n======================================================');
console.log('   SiWIT — Automated Unit Test Suite');
console.log('   Lead Engineer: Uditha Manohara Prasad');
console.log('   Brand: Neziora');
console.log('======================================================\n');

// 1. Unicode Hex Formatting
console.log('--- Suite 1: Hex Formatting & Character Naming ---');
assertEqual(formatHex(0x0D85), 'U+0D85', 'formatHex(0x0D85) formats to U+0D85');
assertEqual(formatHex(0x200D), 'U+200D', 'formatHex(0x200D) formats to U+200D (ZWJ)');
assertEqual(formatCodeUnit(0x0DCA), '0x0DCA', 'formatCodeUnit(0x0DCA) formats to 0x0DCA');
assert(UNICODE_NAMES[0x0D9A].name.includes('KAYANNA'), 'UNICODE_NAMES lookup identifies Kayanna');
assert(UNICODE_NAMES[0x200D].name.includes('ZERO WIDTH JOINER'), 'UNICODE_NAMES lookup identifies ZWJ');

// 2. Code Point & Unit Extraction
console.log('\n--- Suite 2: Code Point & Unit Extraction ---');
const pointsKa = getCodePoints('ක');
assertEqual(pointsKa.length, 1, 'Basic consonant "ක" has exactly 1 code point');
assertEqual(pointsKa[0].hex, 'U+0D9A', 'Code point is U+0D9A');

const pointsSri = getCodePoints('ශ්‍රී');
assertEqual(pointsSri.length, 5, 'Complex cluster "ශ්‍රී" has 5 code points');
assertEqual(pointsSri[0].hex, 'U+0DC1', 'First code point is Sayanna (U+0DC1)');
assertEqual(pointsSri[1].hex, 'U+0DCA', 'Second code point is Virama (U+0DCA)');
assertEqual(pointsSri[2].hex, 'U+200D', 'Third code point is ZWJ (U+200D)');
assertEqual(pointsSri[3].hex, 'U+0DBB', 'Fourth code point is Rayanna (U+0DBB)');
assertEqual(pointsSri[4].hex, 'U+0DD3', 'Fifth code point is Diga Is-pilla (U+0DD3)');

// 3. Length Calculations & Grapheme Segmentation
console.log('\n--- Suite 3: Length Calculations & Grapheme Clusters ---');
const lengthsSri = calculateLengths('ශ්‍රී');
assertEqual(lengthsSri.utf16Count, 5, '"ශ්‍රී" UTF-16 count is 5');
assertEqual(lengthsSri.codePointCount, 5, '"ශ්‍රී" code point count is 5');
// In standard Unicode UAX #29, Sayanna+Virama+ZWJ is 1 cluster and Rayanna+Is-pilla is 2nd cluster
assertEqual(lengthsSri.graphemeCount, 2, '"ශ්‍රී" UAX #29 grapheme cluster count is 2 in Intl.Segmenter');
assertEqual(lengthsSri.utf8ByteCount, 15, '"ශ්‍රී" UTF-8 byte count is 15 bytes (5 code points x 3 bytes)');

const lengthsCompound = calculateLengths('විශ්වවිද්‍යාලය');
assertEqual(lengthsCompound.utf16Count, 14, '"විශ්වවිද්‍යාලය" UTF-16 units is 14');
assertEqual(lengthsCompound.codePointCount, 14, '"විශ්වවිද්‍යාලය" code points count is 14');
assertEqual(lengthsCompound.graphemeCount, 8, '"විශ්වවිද්‍යාලය" grapheme cluster count is 8');

// 4. Unicode Normalization Forms
console.log('\n--- Suite 4: Normalization Comparisons ---');
// Composed vs Decomposed O-vowel
const compO = 'කො'; // U+0D9A U+0DDC
const decompO = 'ක\u0DD9\u0DCF'; // U+0D9A U+0DD9 U+0DCF
const normResult = compareNormalization(compO, decompO);
assert(!normResult.rawEqual, 'Raw strings compO and decompO are NOT strictly equal');
assert(normResult.forms.NFC.equal, 'compO and decompO are equal under NFC normalization');
assert(normResult.forms.NFD.equal, 'compO and decompO are equal under NFD normalization');
assertEqual(normResult.forms.NFC.normA, normResult.forms.NFC.normB, 'NFC normalized forms match');

// ZWJ retention under normalization
const kraWithZWJ = 'ක්‍ර'; // U+0D9A U+0DCA U+200D U+0DBB
const kraNormNFC = kraWithZWJ.normalize('NFC');
const kraNormNFKC = kraWithZWJ.normalize('NFKC');
assert(kraNormNFC.includes('\u200D'), 'NFC normalization preserves ZWJ (U+200D)');
assert(kraNormNFKC.includes('\u200D'), 'NFKC normalization preserves ZWJ (U+200D)');

// 5. Test Corpus JSON Validation
console.log('\n--- Suite 5: Test Corpus Schema Validation ---');
const corpusPath = resolve('data/sinhala-test-cases.json');
const rawCorpus = readFileSync(corpusPath, 'utf8');
const corpusData = JSON.parse(rawCorpus);

assert(Array.isArray(corpusData), 'Corpus is a valid JSON array');
assert(corpusData.length >= 20, `Corpus contains at least 20 test cases (Found: ${corpusData.length})`);

const seenIds = new Set();
let allValid = true;

corpusData.forEach((tc, idx) => {
  if (!tc.id || !tc.name || !tc.category || !tc.testString || !tc.description || !tc.purpose) {
    allValid = false;
    console.error(`Case index ${idx} missing required fields:`, tc);
  }
  if (seenIds.has(tc.id)) {
    allValid = false;
    console.error(`Duplicate case ID found: ${tc.id}`);
  }
  seenIds.add(tc.id);
});

assert(allValid, 'Every corpus test case adheres strictly to metadata schema with unique IDs');

// Print Final Summary
console.log('\n======================================================');
console.log(`Tests Completed: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All automated unit tests passed successfully!\n');
}
