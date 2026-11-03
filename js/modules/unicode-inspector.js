/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Sinhala Unicode Inspector (js/modules/unicode-inspector.js)
 */

import { getCodePoints, getCodeUnits, getGraphemeClusters, calculateLengths, formatHex, formatCodeUnit } from '../utils/unicode.js';
import { escapeHTML, showToast } from '../utils/dom.js';

export function renderUnicodeInspector(container, initialText = 'ශ්‍රී ලංකා') {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module B &bull; Precision Analysis</div>
      <h1>Sinhala Unicode Inspector</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Examine the underlying Unicode structure of Sinhala text. Distinguish between UTF-16 code units (JavaScript <code>.length</code>), Unicode code points, and visual grapheme clusters.
      </p>
    </div>

    <!-- Input Section -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Inspect Sinhala Text</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" id="btn-inspector-clear">Clear</button>
          <button class="btn btn-secondary btn-sm" id="btn-inspector-copy-hex">Copy Hex Sequence</button>
        </div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" for="inspector-input">Enter or paste Sinhala text:</label>
          <textarea id="inspector-input" class="form-control sinhala-text" style="min-height: 80px;" placeholder="සිංහල අකුරු මෙහි ටයිප් කරන්න...">${escapeHTML(initialText)}</textarea>
        </div>

        <!-- Quick Sample Presets -->
        <div style="margin-top: 12px;">
          <div class="caption" style="margin-bottom: 6px; font-weight: 600;">Quick Load Verified Sequences:</div>
          <div class="filter-pills" id="inspector-presets">
            <button class="filter-pill" data-preset="ශ්‍රී">ශ්‍රී (Sri — 5 code points, 1 cluster)</button>
            <button class="filter-pill" data-preset="ක්‍රමය">ක්‍රමය (Rakaransaya + ZWJ)</button>
            <button class="filter-pill" data-preset="විද්‍යාව">විද්‍යාව (Yansaya + ZWJ)</button>
            <button class="filter-pill" data-preset="කොළඹ">කොළඹ (Two-part O-vowel + Sannaka)</button>
            <button class="filter-pill" data-preset="මණ්ඩලය">මණ්ඩලය (Bandi-akuru NNDA)</button>
            <button class="filter-pill" data-preset="හඳ">හඳ vs හන්දිය (Sannaka contrast)</button>
            <button class="filter-pill" data-preset="෴">෴ (Kunddaliya Punctuation)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Counts Summary Grid -->
    <div class="metrics-grid" id="inspector-metrics-grid">
      <!-- Injected by updateInspection -->
    </div>

    <!-- Grapheme Clusters & Code Point Sequence Breakdown -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Grapheme Clusters & Code Point Decomposition</span>
        <span class="caption" id="segmenter-status-badge"></span>
      </div>
      <div class="card-body">
        <div id="inspector-sequence-view">
          <!-- Injected by updateInspection -->
        </div>
      </div>
    </div>

    <!-- Detailed Code Point & UTF-16 Units Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Code Point Detail Table</span>
      </div>
      <div class="card-body">
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Glyph</th>
                <th>Hex Code Point</th>
                <th>Official Character Name</th>
                <th>Classification</th>
                <th>UTF-16 Hex</th>
              </tr>
            </thead>
            <tbody id="inspector-table-body">
              <!-- Injected by updateInspection -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Sequence Diff & Visual Comparator -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Visual Sequence Comparator</span>
        <span class="caption">Detect visually identical but structurally divergent sequences (e.g. ZWJ vs raw)</span>
      </div>
      <div class="card-body">
        <div class="comparison-grid">
          <div>
            <label class="form-label">Sequence 1:</label>
            <input type="text" id="comp-seq-1" class="form-control sinhala-text" value="ක්‍ර">
            <div class="caption code-font" id="comp-seq-1-hex" style="margin-top: 6px; word-break: break-all;"></div>
          </div>
          <div>
            <label class="form-label">Sequence 2:</label>
            <input type="text" id="comp-seq-2" class="form-control sinhala-text" value="ක්ර">
            <div class="caption code-font" id="comp-seq-2-hex" style="margin-top: 6px; word-break: break-all;"></div>
          </div>
        </div>
        <div id="comp-result-box" style="margin-top: 16px; padding: 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#inspector-input');
  const metricsGrid = container.querySelector('#inspector-metrics-grid');
  const sequenceView = container.querySelector('#inspector-sequence-view');
  const tableBody = container.querySelector('#inspector-table-body');
  const segmenterBadge = container.querySelector('#segmenter-status-badge');
  const btnClear = container.querySelector('#btn-inspector-clear');
  const btnCopyHex = container.querySelector('#btn-inspector-copy-hex');

  const compSeq1 = container.querySelector('#comp-seq-1');
  const compSeq2 = container.querySelector('#comp-seq-2');
  const compSeq1Hex = container.querySelector('#comp-seq-1-hex');
  const compSeq2Hex = container.querySelector('#comp-seq-2-hex');
  const compResultBox = container.querySelector('#comp-result-box');

  function updateInspection() {
    const text = inputEl.value;
    const lengths = calculateLengths(text);
    const codePoints = getCodePoints(text);
    const codeUnits = getCodeUnits(text);
    const hasIntlSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';

    segmenterBadge.textContent = hasIntlSegmenter ? 'Engine: Intl.Segmenter Active' : 'Engine: Surrogate fallback';

    // Metrics Grid
    metricsGrid.innerHTML = `
      <div class="metric-card">
        <span class="metric-label">Grapheme Clusters</span>
        <span class="metric-value" style="color: var(--accent);">${lengths.graphemeCount}</span>
        <span class="metric-sub">Visible orthographic syllables</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Unicode Code Points</span>
        <span class="metric-value">${lengths.codePointCount}</span>
        <span class="metric-sub">[...string].length</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">UTF-16 Code Units</span>
        <span class="metric-value">${lengths.utf16Count}</span>
        <span class="metric-sub">JavaScript string.length</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">UTF-8 Byte Size</span>
        <span class="metric-value">${lengths.utf8ByteCount} B</span>
        <span class="metric-sub">Wire transmission size</span>
      </div>
    `;

    // Sequence / Grapheme Clusters
    if (codePoints.length === 0) {
      sequenceView.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No text entered. Type or select a preset above.</div>`;
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No code points to display.</td></tr>`;
      return;
    }

    const clusters = lengths.graphemeClusters;
    sequenceView.innerHTML = `
      <div class="caption" style="margin-bottom: 8px;">
        Visualizing <strong>${clusters.length}</strong> Grapheme Cluster${clusters.length === 1 ? '' : 's'}:
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${clusters.map((cluster, cIdx) => `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="sinhala-text" style="font-size: 1.75rem; font-weight: 600; line-height: 1;">${escapeHTML(cluster.cluster)}</span>
                <span class="badge badge-untested">Cluster #${cIdx + 1}</span>
              </div>
              <div class="caption code-font">
                ${cluster.codePointCount} Code Point${cluster.codePointCount === 1 ? '' : 's'} &bull; ${cluster.lengthUTF16} UTF-16 unit${cluster.lengthUTF16 === 1 ? '' : 's'}
              </div>
            </div>
            <div class="seq-grid">
              ${cluster.codePoints.map(cp => `
                <div class="char-pill">
                  <div class="glyph">${cp.codePoint === 0x200D ? '<span style="color: var(--accent); font-size: 0.85rem;">[ZWJ]</span>' : (cp.codePoint === 0x200C ? '<span style="color: var(--status-review); font-size: 0.85rem;">[ZWNJ]</span>' : escapeHTML(cp.char))}</div>
                  <div class="hex-code">${escapeHTML(cp.hex)}</div>
                  <div class="char-title" title="${escapeHTML(cp.info.name)}">${escapeHTML(cp.info.name)}</div>
                  <div class="char-cat">${escapeHTML(cp.info.category)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Table rows
    tableBody.innerHTML = codePoints.map((cp, idx) => {
      const cu = codeUnits[idx];
      return `
        <tr>
          <td class="caption">${idx + 1}</td>
          <td class="sinhala-text" style="font-size: 1.25rem;">
            ${cp.codePoint === 0x200D ? '<span class="badge badge-fail">[ZWJ]</span>' : (cp.codePoint === 0x200C ? '<span class="badge badge-review">[ZWNJ]</span>' : (cp.codePoint === 0x0020 ? '<span class="caption">[SPACE]</span>' : escapeHTML(cp.char)))}
          </td>
          <td class="code-font" style="color: var(--accent); font-weight: 600;">${escapeHTML(cp.hex)}</td>
          <td>${escapeHTML(cp.info.name)}</td>
          <td><span class="badge badge-untested">${escapeHTML(cp.info.category)}</span></td>
          <td class="code-font caption">${cu ? escapeHTML(cu.hex) : '—'}</td>
        </tr>
      `;
    }).join('');
  }

  function updateComparator() {
    const s1 = compSeq1.value || '';
    const s2 = compSeq2.value || '';

    const hex1 = Array.from(s1).map(c => formatHex(c.codePointAt(0))).join(' ');
    const hex2 = Array.from(s2).map(c => formatHex(c.codePointAt(0))).join(' ');

    compSeq1Hex.textContent = hex1 ? `Hex: ${hex1}` : 'Empty';
    compSeq2Hex.textContent = hex2 ? `Hex: ${hex2}` : 'Empty';

    const identical = s1 === s2;
    const sameLength = s1.length === s2.length;
    
    // Check if difference is due to ZWJ or combining marks
    const hasZWJ1 = s1.includes('\u200D');
    const hasZWJ2 = s2.includes('\u200D');

    compResultBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge ${identical ? 'badge-pass' : 'badge-fail'}">
            ${identical ? 'STRICTLY EQUAL' : 'STRINGS DIFFER'}
          </span>
          <span style="font-size: 0.875rem;">
            ${identical ? 'Both sequences are binary and Unicode identical.' : 'Sequences contain different code points.'}
          </span>
        </div>
        <div class="caption code-font">
          Seq 1 length: ${s1.length} | Seq 2 length: ${s2.length}
        </div>
      </div>
      ${!identical ? `
        <div class="caption" style="margin-top: 8px; color: var(--text-secondary);">
          ${(hasZWJ1 !== hasZWJ2) ? '<strong>Note:</strong> One sequence contains a Zero-Width Joiner (U+200D) which triggers ligature rendering (e.g. Yansaya / Rakaransaya / Bandiyakuru), while the other lacks it.' : 'Different characters or decomposition orders present.'}
        </div>
      ` : ''}
    `;
  }

  // Event handlers
  inputEl.addEventListener('input', updateInspection);
  btnClear.addEventListener('click', () => {
    inputEl.value = '';
    updateInspection();
  });

  btnCopyHex.addEventListener('click', () => {
    const text = inputEl.value;
    if (!text) {
      showToast('No text to copy', 'warning');
      return;
    }
    const hex = Array.from(text).map(c => formatHex(c.codePointAt(0))).join(' ');
    navigator.clipboard?.writeText(hex).then(() => {
      showToast(`Copied hex sequence (${hex.length} chars) to clipboard`, 'success');
    }).catch(() => {
      showToast(hex, 'info');
    });
  });

  container.querySelectorAll('#inspector-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (preset) {
        inputEl.value = preset;
        updateInspection();
        showToast(`Loaded preset '${preset}'`, 'info');
      }
    });
  });

  compSeq1.addEventListener('input', updateComparator);
  compSeq2.addEventListener('input', updateComparator);

  // Initialize
  updateInspection();
  updateComparator();
}

