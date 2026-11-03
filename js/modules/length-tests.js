/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Text Length & Input Limit Testing (js/modules/length-tests.js)
 */

import { calculateLengths, getGraphemeClusters, formatHex } from '../utils/unicode.js';
import { escapeHTML, showToast } from '../utils/dom.js';

export function renderLengthTests(container, initialText = 'ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය') {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module F &bull; Boundary Analysis</div>
      <h1>Text Length & Input Limit Testing</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Discover how different character counting metrics and HTML <code>maxlength</code> restrictions affect Sinhala input. Understand why forms frequently corrupt or prematurely truncate Sinhala text.
      </p>
    </div>

    <!-- Active Text Field & Counter Summary -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Live Length Analysis</span>
        <button class="btn btn-outline btn-sm" id="btn-length-reset">Reset Text</button>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" for="length-test-input">Type or paste text to measure:</label>
          <textarea id="length-test-input" class="form-control sinhala-text" style="min-height: 90px;">${escapeHTML(initialText)}</textarea>
        </div>

        <!-- Real-Time Metrics Comparison -->
        <div class="metrics-grid" id="length-metrics-grid" style="margin-top: 16px; margin-bottom: 0;">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>

    <!-- The 4 Counting Paradigms Explained -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">The Four Measurement Systems Explained</span>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <strong style="color: var(--text-primary); font-size: 0.875rem;">1. Grapheme Clusters</strong>
            <p class="caption" style="margin-top: 4px;">
              What the user visually perceives as single distinct characters/syllables. Calculated via <code>Intl.Segmenter(..., { granularity: 'grapheme' })</code>. Best for user-facing UI character limit badges (e.g. social posts).
            </p>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-sm); border-left: 3px solid var(--status-manual);">
            <strong style="color: var(--text-primary); font-size: 0.875rem;">2. Unicode Code Points</strong>
            <p class="caption" style="margin-top: 4px;">
              Individual assigned positions in the Unicode code space. Extracted via <code>[...str].length</code>. One grapheme cluster often comprises 2 to 5 code points in Sinhala.
            </p>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-sm); border-left: 3px solid var(--status-review);">
            <strong style="color: var(--text-primary); font-size: 0.875rem;">3. UTF-16 Code Units</strong>
            <p class="caption" style="margin-top: 4px;">
              Standard JavaScript <code>string.length</code> and HTML <code>maxlength</code>. Each unit is a 16-bit word. Supplementary characters consume two units (surrogate pairs).
            </p>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-sm); border-left: 3px solid var(--status-pass);">
            <strong style="color: var(--text-primary); font-size: 0.875rem;">4. UTF-8 Byte Size</strong>
            <p class="caption" style="margin-top: 4px;">
              The actual physical bytes transmitted over the network or saved in <code>VARCHAR(N)</code> / UTF-8 database storage. Most Sinhala code points consume 3 bytes in UTF-8.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- HTML MaxLength Truncation Simulator -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">HTML <code>maxlength</code> Truncation Simulator</span>
        <span class="badge badge-fail">Common Web Failure Point</span>
      </div>
      <div class="card-body">
        <p class="caption" style="margin-bottom: 16px;">
          Standard browser HTML <code>&lt;input maxlength="N"&gt;</code> restricts by <strong>UTF-16 code units</strong>, not visible Sinhala graphemes. If the limit cuts through a combining mark or ZWJ sequence, it leaves orphaned vowel signs or corrupts conjuncts.
        </p>

        <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 16px;">
          <div style="width: 140px;">
            <label class="form-label" for="sim-limit-number">Test Limit (N):</label>
            <input type="number" id="sim-limit-number" class="form-control" value="6" min="1" max="100">
          </div>
          <div style="flex: 1; min-width: 260px;">
            <label class="form-label">Quick Test Phrase:</label>
            <div class="filter-pills" id="sim-presets">
              <button class="filter-pill" data-val="ශ්‍රී ලංකා" data-limit="4">"ශ්‍රී ලංකා" (Limit 4)</button>
              <button class="filter-pill" data-val="විශ්වවිද්‍යාලය" data-limit="8">"විශ්වවිද්‍යාලය" (Limit 8)</button>
              <button class="filter-pill" data-val="ප්‍රශ්නය" data-limit="5">"ප්‍රශ්නය" (Limit 5)</button>
            </div>
          </div>
        </div>

        <div class="comparison-grid">
          <div>
            <label class="form-label">Native HTML Input with <code>maxlength</code>:</label>
            <input type="text" id="sim-native-input" class="form-control sinhala-text" maxlength="6" value="">
            <div class="caption code-font" id="sim-native-meta" style="margin-top: 6px; color: var(--text-secondary);"></div>
          </div>
          <div>
            <label class="form-label">Grapheme-Aware Protected Truncation:</label>
            <div id="sim-safe-output" class="readonly-display" style="min-height: 44px; padding: 10px 14px; font-size: 1.125rem;"></div>
            <div class="caption code-font" id="sim-safe-meta" style="margin-top: 6px; color: var(--text-secondary);"></div>
          </div>
        </div>

        <!-- Truncation Alert Box -->
        <div id="sim-alert-box" style="margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-surface-elevated);">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#length-test-input');
  const metricsGrid = container.querySelector('#length-metrics-grid');
  const btnReset = container.querySelector('#btn-length-reset');

  const simLimitNumber = container.querySelector('#sim-limit-number');
  const simNativeInput = container.querySelector('#sim-native-input');
  const simNativeMeta = container.querySelector('#sim-native-meta');
  const simSafeOutput = container.querySelector('#sim-safe-output');
  const simSafeMeta = container.querySelector('#sim-safe-meta');
  const simAlertBox = container.querySelector('#sim-alert-box');

  function updateMetrics() {
    const text = inputEl.value;
    const lengths = calculateLengths(text);

    metricsGrid.innerHTML = `
      <div class="metric-card">
        <span class="metric-label">Grapheme Clusters</span>
        <span class="metric-value" style="color: var(--accent);">${lengths.graphemeCount}</span>
        <span class="metric-sub">Visible syllables</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Unicode Code Points</span>
        <span class="metric-value">${lengths.codePointCount}</span>
        <span class="metric-sub">Assigned Unicode positions</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">UTF-16 Units</span>
        <span class="metric-value">${lengths.utf16Count}</span>
        <span class="metric-sub">JS .length & HTML maxlength</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">UTF-8 Bytes</span>
        <span class="metric-value">${lengths.utf8ByteCount} B</span>
        <span class="metric-sub">Network / DB storage</span>
      </div>
    `;
  }

  function updateSimulator() {
    const limit = Math.max(1, parseInt(simLimitNumber.value, 10) || 6);
    simNativeInput.setAttribute('maxlength', limit);

    const val = simNativeInput.value;
    const valUnits = val.length;
    const valClusters = getGraphemeClusters(val);

    simNativeMeta.textContent = `Units: ${valUnits}/${limit} | Graphemes: ${valClusters.length}`;

    // Compute Grapheme-Aware safe slice up to 'limit' graphemes
    const fullSource = inputEl.value;
    const allClusters = getGraphemeClusters(fullSource);
    const safeSlice = allClusters.slice(0, limit).map(c => c.cluster).join('');
    
    simSafeOutput.textContent = safeSlice;
    simSafeMeta.textContent = `Safe Graphemes: ${Math.min(limit, allClusters.length)}/${limit} (UTF-16 Units: ${safeSlice.length})`;

    // Check if native input truncated mid-cluster
    let isTruncatedGlitch = false;
    let glitchDetail = '';

    if (val.length > 0) {
      // Check last character of val
      const lastCodePoint = val.codePointAt(val.length - 1);
      // If ends with virama (0x0DCA) or vowel signs without subsequent parts, or ends with ZWJ (0x200D)
      if (lastCodePoint === 0x200D) {
        isTruncatedGlitch = true;
        glitchDetail = 'Native input was cut immediately after a Zero-Width Joiner (U+200D), creating a broken conjunct sequence!';
      } else if (lastCodePoint === 0x0DCA) {
        isTruncatedGlitch = true;
        glitchDetail = 'Native input ends with an unattached Virama (U+0DCA), potentially breaking an intended Yansaya or Rakaransaya ligature.';
      }
    }

    simAlertBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge ${isTruncatedGlitch ? 'badge-fail' : 'badge-pass'}">
          ${isTruncatedGlitch ? 'TRUNCATION ARTIFACT DETECTED' : 'CLEAN BOUNDARY'}
        </span>
        <span style="font-size: 0.875rem;">
          ${isTruncatedGlitch ? escapeHTML(glitchDetail) : 'No trailing broken ZWJ or orphaned virama detected in current input.'}
        </span>
      </div>
      <div class="caption" style="margin-top: 8px; color: var(--text-secondary);">
        <strong>Engineering Advice:</strong> For user-facing forms accepting Sinhala, validate length via <code>Intl.Segmenter</code> in JavaScript rather than relying purely on the HTML <code>maxlength</code> attribute.
      </div>
    `;
  }

  // Event handlers
  inputEl.addEventListener('input', () => {
    updateMetrics();
    updateSimulator();
  });

  btnReset.addEventListener('click', () => {
    inputEl.value = 'ශ්‍රී ලංකා';
    simNativeInput.value = 'ශ්‍රී ලංකා';
    updateMetrics();
    updateSimulator();
    showToast('Reset length analysis text', 'info');
  });

  simLimitNumber.addEventListener('input', updateSimulator);
  simNativeInput.addEventListener('input', updateSimulator);

  container.querySelectorAll('#sim-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      const limit = btn.getAttribute('data-limit');
      if (val && limit) {
        simLimitNumber.value = limit;
        inputEl.value = val;
        simNativeInput.value = val;
        updateMetrics();
        updateSimulator();
        showToast(`Loaded simulator preset with limit ${limit}`, 'info');
      }
    });
  });

  // Initial calculation
  simNativeInput.value = initialText.slice(0, 6);
  updateMetrics();
  updateSimulator();
}

