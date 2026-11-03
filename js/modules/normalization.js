/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Unicode Normalization Testing (js/modules/normalization.js)
 */

import { compareNormalization, getCodePoints } from '../utils/unicode.js';
import { escapeHTML, showToast, downloadFile } from '../utils/dom.js';

export function renderNormalization(container, initialSeqA = 'කො', initialSeqB = 'කෙ\u0DCA\u200Dර') {
  // Common preset comparison pairs for Sinhala
  const presets = [
    {
      title: 'Composed O-Vowel vs Decomposed Kombuva + Aela-pilla',
      seqA: 'කො', // U+0D9A U+0DDC (Canonical composed)
      seqB: 'ක\u0DD9\u0DCF', // U+0D9A U+0DD9 U+0DCF (Decomposed parts)
      desc: 'Canonical equivalence test. In NFC, Sequence B canonicalizes into U+0DDC.'
    },
    {
      title: 'Prenasalized Sannaka vs Pure Nasal + Consonant',
      seqA: 'ඟ', // U+0D9F
      seqB: 'න්ග', // U+0DB1 U+0DCA U+0D9C
      desc: 'Phonological distinction test. These must NOT normalize to the same form.'
    },
    {
      title: 'Rakaransaya with ZWJ vs Separated Sequence',
      seqA: 'ක්‍ර', // U+0D9A U+0DCA U+200D U+0DBB
      seqB: 'ක්ර', // U+0D9A U+0DCA U+0DBB (Missing ZWJ)
      desc: 'Orthographic control test. Normalization forms must preserve U+200D.'
    },
    {
      title: 'Long O-Vowel Composed vs Decomposed',
      seqA: 'කෝ', // U+0D9A U+0DDD
      seqB: 'ක\u0DDA\u0DCF', // U+0D9A U+0DDA U+0DCF
      desc: 'Diga kombuva haa aela-pilla canonical composition.'
    }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module E &bull; Canonical & Compatibility Analysis</div>
      <h1>Unicode Normalization Testing</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Compare Sinhala text representations across native Unicode Normalization Forms (NFC, NFD, NFKC, NFKD). Identify canonical equivalence and detect code point divergence.
      </p>
    </div>

    <!-- Presets Selector -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-header">
        <span class="card-title">Load Preset Comparison Pair</span>
      </div>
      <div class="card-body">
        <div class="filter-pills" id="norm-preset-pills">
          ${presets.map((p, idx) => `
            <button class="filter-pill ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
              ${escapeHTML(p.title)}
            </button>
          `).join('')}
        </div>
        <div class="caption" id="norm-preset-desc" style="margin-top: 8px; color: var(--text-secondary);">
          ${escapeHTML(presets[0].desc)}
        </div>
      </div>
    </div>

    <!-- Input Sequences -->
    <div class="comparison-grid" style="margin-bottom: 20px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">Text Sequence A</span>
          <button class="btn btn-ghost btn-sm" id="btn-copy-seq-a">Copy</button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <input type="text" id="norm-input-a" class="form-control sinhala-text" value="${escapeHTML(presets[0].seqA)}">
          </div>
          <div class="caption code-font" id="norm-seq-a-hex" style="word-break: break-all; color: var(--text-secondary);"></div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">Text Sequence B</span>
          <button class="btn btn-ghost btn-sm" id="btn-copy-seq-b">Copy</button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <input type="text" id="norm-input-b" class="form-control sinhala-text" value="${escapeHTML(presets[0].seqB)}">
          </div>
          <div class="caption code-font" id="norm-seq-b-hex" style="word-break: break-all; color: var(--text-secondary);"></div>
        </div>
      </div>
    </div>

    <!-- Overall Direct Equality Banner -->
    <div id="norm-direct-equality-banner" style="margin-bottom: 20px; padding: 14px 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-surface);">
      <!-- Injected dynamically -->
    </div>

    <!-- Normalization Forms Detailed Comparison Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Unicode Normalization Forms Breakdown</span>
        <button class="btn btn-outline btn-sm" id="btn-export-norm-report">Export Comparison JSON</button>
      </div>
      <div class="card-body">
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Form</th>
                <th>Description</th>
                <th>Normalized A</th>
                <th>Normalized B</th>
                <th>Form Equivalence</th>
                <th>Code Points Sequence Comparison</th>
              </tr>
            </thead>
            <tbody id="norm-table-body">
              <!-- Injected dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Linguistic Guidance Notice -->
    <div class="card" style="background: var(--bg-surface-elevated); border-left: 4px solid var(--accent);">
      <div class="card-body">
        <h4 style="font-size: 0.9375rem; margin-bottom: 4px;">Important Linguistic & Architectural Consideration:</h4>
        <p class="caption" style="line-height: 1.6;">
          Two strings that normalize to the same canonical form in NFC are considered canonically equivalent by Unicode. However, equivalence in normalization does <em>not</em> automatically imply that all legacy systems, database collations, or font shaping engines treat them identically. In Sinhala web development, always canonicalize text to <strong>NFC</strong> before persisting to databases to avoid silent duplicate keys and search misses.
        </p>
      </div>
    </div>
  `;

  const inputA = container.querySelector('#norm-input-a');
  const inputB = container.querySelector('#norm-input-b');
  const seqAHex = container.querySelector('#norm-seq-a-hex');
  const seqBHex = container.querySelector('#norm-seq-b-hex');
  const equalityBanner = container.querySelector('#norm-direct-equality-banner');
  const tableBody = container.querySelector('#norm-table-body');
  const btnExport = container.querySelector('#btn-export-norm-report');
  const presetPills = container.querySelectorAll('#norm-preset-pills button');
  const presetDesc = container.querySelector('#norm-preset-desc');

  const formDescriptions = {
    NFC: 'Canonical Decomposition followed by Canonical Composition (Standard for Web/W3C)',
    NFD: 'Canonical Decomposition (Separates base characters and combining vowel signs)',
    NFKC: 'Compatibility Decomposition followed by Canonical Composition',
    NFKD: 'Compatibility Decomposition'
  };

  function updateNormalization() {
    const textA = inputA.value;
    const textB = inputB.value;

    const cpA = getCodePoints(textA);
    const cpB = getCodePoints(textB);

    seqAHex.innerHTML = `<strong>Code Points (${cpA.length}):</strong> ` + (cpA.map(c => c.hex).join(' ') || 'None');
    seqBHex.innerHTML = `<strong>Code Points (${cpB.length}):</strong> ` + (cpB.map(c => c.hex).join(' ') || 'None');

    const result = compareNormalization(textA, textB);

    // Direct Equality Banner
    equalityBanner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="badge ${result.rawEqual ? 'badge-pass' : 'badge-fail'}" style="font-size: 0.8125rem; padding: 4px 10px;">
            ${result.rawEqual ? 'IDENTICAL RAW STRINGS' : 'RAW STRINGS DIFFER'}
          </span>
          <span style="font-size: 0.9375rem;">
            ${result.rawEqual ? 'Direct JavaScript strict equality (===) is true.' : 'Direct JavaScript strict equality (===) is false.'}
          </span>
        </div>
        <div class="caption code-font">
          Raw Length: A=${textA.length} | B=${textB.length}
        </div>
      </div>
    `;

    // Table
    tableBody.innerHTML = Object.keys(result.forms).map(formKey => {
      const f = result.forms[formKey];
      return `
        <tr>
          <td class="code-font" style="font-weight: 700; color: var(--accent);">${escapeHTML(f.form)}</td>
          <td class="caption" style="max-width: 220px;">${escapeHTML(formDescriptions[f.form] || '')}</td>
          <td class="sinhala-text" style="font-size: 1.25rem;">${escapeHTML(f.normA)}</td>
          <td class="sinhala-text" style="font-size: 1.25rem;">${escapeHTML(f.normB)}</td>
          <td>
            <span class="badge ${f.equal ? 'badge-pass' : 'badge-fail'}">
              ${f.equal ? 'EQUIVALENT' : 'DIFFERENT'}
            </span>
          </td>
          <td class="code-font caption" style="line-height: 1.6;">
            <div><strong style="color: var(--text-secondary);">A:</strong> ${escapeHTML(f.codePointsA)}</div>
            <div><strong style="color: var(--text-secondary);">B:</strong> ${escapeHTML(f.codePointsB)}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Preset pill click listeners
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const idx = parseInt(pill.getAttribute('data-idx'), 10);
      const p = presets[idx];
      inputA.value = p.seqA;
      inputB.value = p.seqB;
      presetDesc.textContent = p.desc;
      updateNormalization();
      showToast(`Loaded comparison preset: ${p.title}`, 'info');
    });
  });

  inputA.addEventListener('input', updateNormalization);
  inputB.addEventListener('input', updateNormalization);

  container.querySelector('#btn-copy-seq-a').addEventListener('click', () => {
    navigator.clipboard?.writeText(inputA.value).then(() => showToast('Copied Sequence A', 'success'));
  });

  container.querySelector('#btn-copy-seq-b').addEventListener('click', () => {
    navigator.clipboard?.writeText(inputB.value).then(() => showToast('Copied Sequence B', 'success'));
  });

  btnExport.addEventListener('click', () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      sequenceA: inputA.value,
      sequenceB: inputB.value,
      comparison: compareNormalization(inputA.value, inputB.value),
      browser: navigator.userAgent
    };
    downloadFile(`siwit-normalization-comparison-${Date.now()}.json`, JSON.stringify(reportData, null, 2), 'application/json');
    showToast('Exported normalization comparison JSON', 'success');
  });

  // Initial calculation
  updateNormalization();
}

