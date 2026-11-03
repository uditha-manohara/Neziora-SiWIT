/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Unicode Utilities (js/utils/unicode.js)
 * Implements deterministic Unicode inspection, decomposition,
 * character naming, grapheme segmentation, and normalization comparisons.
 */

// Comprehensive Unicode 15.0+ character name map for Sinhala block (U+0D80..U+0DFF) and relevant controls
export const UNICODE_NAMES = {
  // Sinhala Special Signs
  0x0D82: { name: 'SINHALA SIGN ANUSVARAYA (ං)', category: 'Sign', type: 'anusvara' },
  0x0D83: { name: 'SINHALA SIGN VISARGAYA (ඃ)', category: 'Sign', type: 'visarga' },

  // Independent Vowels
  0x0D85: { name: 'SINHALA LETTER AYANNA (අ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D86: { name: 'SINHALA LETTER AAYANNA (ආ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D87: { name: 'SINHALA LETTER AEYANNA (ඇ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D88: { name: 'SINHALA LETTER AEEYANNA (ඈ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D89: { name: 'SINHALA LETTER IYANNA (ඉ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8A: { name: 'SINHALA LETTER IIYANNA (ඊ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8B: { name: 'SINHALA LETTER UYANNA (උ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8C: { name: 'SINHALA LETTER UUYANNA (ඌ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8D: { name: 'SINHALA LETTER IRUYANNA (ඍ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8E: { name: 'SINHALA LETTER IRUUYANNA (ඎ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D8F: { name: 'SINHALA LETTER ILUYANNA (ඏ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D90: { name: 'SINHALA LETTER ILUUYANNA (ඐ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D91: { name: 'SINHALA LETTER EYANNA (එ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D92: { name: 'SINHALA LETTER EEYANNA (ඒ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D93: { name: 'SINHALA LETTER AIYANNA (ඓ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D94: { name: 'SINHALA LETTER OYANNA (ඔ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D95: { name: 'SINHALA LETTER OOYANNA (ඕ)', category: 'Vowel (Independent)', type: 'independent-vowel' },
  0x0D96: { name: 'SINHALA LETTER AUYANNA (ඖ)', category: 'Vowel (Independent)', type: 'independent-vowel' },

  // Consonants
  0x0D9A: { name: 'SINHALA LETTER ALPAPRAANA KAYANNA (ක)', category: 'Consonant', type: 'velar' },
  0x0D9B: { name: 'SINHALA LETTER MAHAAPRAANA KAYANNA (ඛ)', category: 'Consonant', type: 'velar' },
  0x0D9C: { name: 'SINHALA LETTER ALPAPRAANA GAYANNA (ග)', category: 'Consonant', type: 'velar' },
  0x0D9D: { name: 'SINHALA LETTER MAHAAPRAANA GAYANNA (ඝ)', category: 'Consonant', type: 'velar' },
  0x0D9E: { name: 'SINHALA LETTER KANTAJA NAASIKYAYA (ඞ)', category: 'Consonant', type: 'nasal' },
  0x0D9F: { name: 'SINHALA LETTER SANYAKA GAYANNA (ඟ)', category: 'Consonant (Prenasalized)', type: 'prenasalized' },

  0x0DA0: { name: 'SINHALA LETTER ALPAPRAANA CAYANNA (ච)', category: 'Consonant', type: 'palatal' },
  0x0DA1: { name: 'SINHALA LETTER MAHAAPRAANA CAYANNA (ඡ)', category: 'Consonant', type: 'palatal' },
  0x0DA2: { name: 'SINHALA LETTER ALPAPRAANA JAYANNA (ජ)', category: 'Consonant', type: 'palatal' },
  0x0DA3: { name: 'SINHALA LETTER MAHAAPRAANA JAYANNA (ඣ)', category: 'Consonant', type: 'palatal' },
  0x0DA4: { name: 'SINHALA LETTER TAALUJA NAASIKYAYA (ඤ)', category: 'Consonant', type: 'nasal' },
  0x0DA5: { name: 'SINHALA LETTER TAALUJA SANYOOGA NAAKIKYAYA (ඥ)', category: 'Consonant', type: 'palatal' },
  0x0DA6: { name: 'SINHALA LETTER SANYAKA JAYANNA (ඦ)', category: 'Consonant (Prenasalized)', type: 'prenasalized' },

  0x0DA7: { name: 'SINHALA LETTER ALPAPRAANA TTAYANNA (ට)', category: 'Consonant', type: 'retroflex' },
  0x0DA8: { name: 'SINHALA LETTER MAHAAPRAANA TTAYANNA (ඨ)', category: 'Consonant', type: 'retroflex' },
  0x0DA9: { name: 'SINHALA LETTER ALPAPRAANA DDAYANNA (ඩ)', category: 'Consonant', type: 'retroflex' },
  0x0DAA: { name: 'SINHALA LETTER MAHAAPRAANA DDAYANNA (ඪ)', category: 'Consonant', type: 'retroflex' },
  0x0DAB: { name: 'SINHALA LETTER MUURDHAJA NAYANNA (ණ)', category: 'Consonant', type: 'nasal' },
  0x0DAC: { name: 'SINHALA LETTER SANYAKA DDAYANNA (ඬ)', category: 'Consonant (Prenasalized)', type: 'prenasalized' },

  0x0DAD: { name: 'SINHALA LETTER ALPAPRAANA TAYANNA (ත)', category: 'Consonant', type: 'dental' },
  0x0DAE: { name: 'SINHALA LETTER MAHAAPRAANA TAYANNA (ථ)', category: 'Consonant', type: 'dental' },
  0x0DAF: { name: 'SINHALA LETTER ALPAPRAANA DAYANNA (ද)', category: 'Consonant', type: 'dental' },
  0x0DB0: { name: 'SINHALA LETTER MAHAAPRAANA DAYANNA (ධ)', category: 'Consonant', type: 'dental' },
  0x0DB1: { name: 'SINHALA LETTER DANTAJA NAYANNA (න)', category: 'Consonant', type: 'dental' },
  0x0DB3: { name: 'SINHALA LETTER SANYAKA DAYANNA (ඳ)', category: 'Consonant (Prenasalized)', type: 'prenasalized' },

  0x0DB4: { name: 'SINHALA LETTER ALPAPRAANA PAYANNA (ප)', category: 'Consonant', type: 'labial' },
  0x0DB5: { name: 'SINHALA LETTER MAHAAPRAANA PAYANNA (ඵ)', category: 'Consonant', type: 'labial' },
  0x0DB6: { name: 'SINHALA LETTER ALPAPRAANA BAYANNA (බ)', category: 'Consonant', type: 'labial' },
  0x0DB7: { name: 'SINHALA LETTER MAHAAPRAANA BAYANNA (භ)', category: 'Consonant', type: 'labial' },
  0x0DB8: { name: 'SINHALA LETTER MAYANNA (ම)', category: 'Consonant', type: 'labial' },
  0x0DB9: { name: 'SINHALA LETTER AMBA BAYANNA (ඹ)', category: 'Consonant (Prenasalized)', type: 'prenasalized' },

  0x0DBA: { name: 'SINHALA LETTER YAYANNA (ය)', category: 'Consonant', type: 'semi-vowel' },
  0x0DBB: { name: 'SINHALA LETTER RAYANNA (ර)', category: 'Consonant', type: 'liquid' },
  0x0DBD: { name: 'SINHALA LETTER DANTAJA LAYANNA (ල)', category: 'Consonant', type: 'liquid' },
  0x0DC0: { name: 'SINHALA LETTER VAYANNA (ව)', category: 'Consonant', type: 'semi-vowel' },
  0x0DC1: { name: 'SINHALA LETTER TAALUJA SAYANNA (ශ)', category: 'Consonant', type: 'sibilant' },
  0x0DC2: { name: 'SINHALA LETTER MUURDHAJA SAYANNA (ෂ)', category: 'Consonant', type: 'sibilant' },
  0x0DC3: { name: 'SINHALA LETTER DANTAJA SAYANNA (ස)', category: 'Consonant', type: 'sibilant' },
  0x0DC4: { name: 'SINHALA LETTER HAYANNA (හ)', category: 'Consonant', type: 'aspirate' },
  0x0DC5: { name: 'SINHALA LETTER MUURDHAJA LAYANNA (ළ)', category: 'Consonant', type: 'liquid' },
  0x0DC6: { name: 'SINHALA LETTER FAYANNA (ෆ)', category: 'Consonant', type: 'labial' },

  // Virama / Hal-lakuna
  0x0DCA: { name: 'SINHALA SIGN AL-LAKUNA / VIRAMA (්)', category: 'Virama / Pure Consonant', type: 'virama' },

  // Dependent Vowel Signs (Pili)
  0x0DCF: { name: 'SINHALA VOWEL SIGN AELA-PILLA (ා)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD0: { name: 'SINHALA VOWEL SIGN KETTI AEDA-PILLA (ැ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD1: { name: 'SINHALA VOWEL SIGN DIGA AEDA-PILLA (ෑ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD2: { name: 'SINHALA VOWEL SIGN KETTI IS-PILLA (ි)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD3: { name: 'SINHALA VOWEL SIGN DIGA IS-PILLA (ී)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD4: { name: 'SINHALA VOWEL SIGN KETTI PAA-PILLA (ු)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD6: { name: 'SINHALA VOWEL SIGN DIGA PAA-PILLA (ූ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD8: { name: 'SINHALA VOWEL SIGN GAETTA-PILLA (ෘ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DD9: { name: 'SINHALA VOWEL SIGN KOMBUVA (ෙ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DDA: { name: 'SINHALA VOWEL SIGN DIGA KOMBUVA (ේ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DDB: { name: 'SINHALA VOWEL SIGN KOMBU DEKA (ෛ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DDC: { name: 'SINHALA VOWEL SIGN KOMBUVA HAA AELA-PILLA (ො)', category: 'Vowel Sign (Two-part)', type: 'dependent-vowel' },
  0x0DDD: { name: 'SINHALA VOWEL SIGN KOMBUVA HAA DIGA AELA-PILLA (ෝ)', category: 'Vowel Sign (Two-part)', type: 'dependent-vowel' },
  0x0DDE: { name: 'SINHALA VOWEL SIGN KOMBUVA HAA GAYANUKITTA (ෞ)', category: 'Vowel Sign (Two-part)', type: 'dependent-vowel' },
  0x0DDF: { name: 'SINHALA VOWEL SIGN GAYANUKITTA (ෟ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DF2: { name: 'SINHALA VOWEL SIGN DIGA GAETTA-PILLA (ෲ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DF3: { name: 'SINHALA VOWEL SIGN DIGA GAYANUKITTA (ෳ)', category: 'Vowel Sign', type: 'dependent-vowel' },
  0x0DF4: { name: 'SINHALA PUNCTUATION KUNDDALIYA (෴)', category: 'Punctuation', type: 'archaic' },

  // Crucial Unicode Format & Whitespace Characters
  0x200D: { name: 'ZERO WIDTH JOINER [ZWJ]', category: 'Format Control', type: 'joiner' },
  0x200C: { name: 'ZERO WIDTH NON-JOINER [ZWNJ]', category: 'Format Control', type: 'non-joiner' },
  0x200B: { name: 'ZERO WIDTH SPACE [ZWSP]', category: 'Separator / Space', type: 'space' },
  0x00A0: { name: 'NO-BREAK SPACE [NBSP]', category: 'Separator / Space', type: 'space' },
  0x0020: { name: 'SPACE', category: 'Separator / Space', type: 'space' }
};

/**
 * Format a code point number as a standard Unicode hex string e.g. U+0D9A
 */
export function formatHex(codePoint) {
  if (typeof codePoint !== 'number' || isNaN(codePoint)) return 'U+????';
  const hex = codePoint.toString(16).toUpperCase();
  return `U+${hex.padStart(4, '0')}`;
}

/**
 * Format a code unit (16-bit) as hex
 */
export function formatCodeUnit(codeUnit) {
  if (typeof codeUnit !== 'number' || isNaN(codeUnit)) return '0x????';
  const hex = codeUnit.toString(16).toUpperCase();
  return `0x${hex.padStart(4, '0')}`;
}

/**
 * Lookup character name and classification
 */
export function getCharInfo(codePoint) {
  if (UNICODE_NAMES[codePoint]) {
    return UNICODE_NAMES[codePoint];
  }
  // Fallback for general ASCII / Unicode
  if (codePoint >= 0x0021 && codePoint <= 0x007E) {
    return {
      name: `BASIC LATIN '${String.fromCodePoint(codePoint)}'`,
      category: 'Basic Latin / ASCII',
      type: 'ascii'
    };
  }
  if (codePoint >= 0x0D80 && codePoint <= 0x0DFF) {
    return {
      name: `SINHALA UNASSIGNED OR UNMAPPED (${formatHex(codePoint)})`,
      category: 'Sinhala Block',
      type: 'sinhala-unmapped'
    };
  }
  return {
    name: `UNICODE CODE POINT (${formatHex(codePoint)})`,
    category: 'General Unicode',
    type: 'unicode-generic'
  };
}

/**
 * Extract an array of code points from a string
 */
export function getCodePoints(text) {
  if (!text) return [];
  const points = [];
  for (const char of text) {
    const cp = char.codePointAt(0);
    points.push({
      char,
      codePoint: cp,
      hex: formatHex(cp),
      info: getCharInfo(cp)
    });
  }
  return points;
}

/**
 * Extract UTF-16 code units from a string
 */
export function getCodeUnits(text) {
  if (!text) return [];
  const units = [];
  for (let i = 0; i < text.length; i++) {
    const cu = text.charCodeAt(i);
    units.push({
      index: i,
      codeUnit: cu,
      hex: formatCodeUnit(cu)
    });
  }
  return units;
}

/**
 * Break text into grapheme clusters using Intl.Segmenter if available,
 * or fallback to code-point iteration.
 */
export function getGraphemeClusters(text) {
  if (!text) return [];
  
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('si', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(text));
      return segments.map((seg, idx) => {
        const cluster = seg.segment;
        const codePoints = Array.from(cluster).map(c => {
          const cp = c.codePointAt(0);
          return {
            char: c,
            codePoint: cp,
            hex: formatHex(cp),
            info: getCharInfo(cp)
          };
        });
        return {
          index: idx,
          cluster,
          startIndex: seg.index,
          lengthUTF16: cluster.length,
          codePointCount: codePoints.length,
          codePoints
        };
      });
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: Code points as fallback units
  const points = Array.from(text);
  let pos = 0;
  return points.map((p, idx) => {
    const cp = p.codePointAt(0);
    const start = pos;
    pos += p.length;
    return {
      index: idx,
      cluster: p,
      startIndex: start,
      lengthUTF16: p.length,
      codePointCount: 1,
      codePoints: [{
        char: p,
        codePoint: cp,
        hex: formatHex(cp),
        info: getCharInfo(cp)
      }]
    };
  });
}

/**
 * Compute all 4 standard lengths for a given string:
 * 1. UTF-16 Code Units (str.length)
 * 2. Unicode Code Points ([...str].length)
 * 3. Grapheme Clusters (Intl.Segmenter)
 * 4. UTF-8 Byte Length (TextEncoder)
 */
export function calculateLengths(text) {
  if (typeof text !== 'string') text = String(text || '');
  const utf16Count = text.length;
  const codePoints = Array.from(text);
  const codePointCount = codePoints.length;
  const graphemeClusters = getGraphemeClusters(text);
  const graphemeCount = graphemeClusters.length;
  
  let utf8ByteCount = 0;
  if (typeof TextEncoder !== 'undefined') {
    utf8ByteCount = new TextEncoder().encode(text).length;
  } else {
    // Fallback: encodeURI byte calculation
    utf8ByteCount = unescape(encodeURIComponent(text)).length;
  }

  return {
    utf16Count,
    codePointCount,
    graphemeCount,
    utf8ByteCount,
    graphemeClusters
  };
}

/**
 * Compare two strings directly and across all 4 Unicode Normalization Forms
 * (NFC, NFD, NFKC, NFKD)
 */
export function compareNormalization(textA, textB) {
  const strA = String(textA || '');
  const strB = String(textB || '');

  const rawEqual = strA === strB;
  
  const forms = ['NFC', 'NFD', 'NFKC', 'NFKD'];
  const formResults = {};

  for (const form of forms) {
    let normA = strA;
    let normB = strB;
    let supported = true;
    try {
      normA = strA.normalize(form);
      normB = strB.normalize(form);
    } catch {
      supported = false;
    }

    const equal = normA === normB;
    const pointsA = Array.from(normA).map(c => formatHex(c.codePointAt(0))).join(' ');
    const pointsB = Array.from(normB).map(c => formatHex(c.codePointAt(0))).join(' ');

    formResults[form] = {
      form,
      supported,
      normA,
      normB,
      equal,
      codePointsA: pointsA,
      codePointsB: pointsB,
      lengthA: normA.length,
      lengthB: normB.length
    };
  }

  return {
    rawEqual,
    forms: formResults
  };
}

