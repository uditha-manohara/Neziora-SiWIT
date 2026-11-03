/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Copy & Paste Testing (js/modules/clipboard-tests.js)
 */

import { getCodePoints, formatHex } from '../utils/unicode.js';
import { escapeHTML, showToast } from '../utils/dom.js';

export function renderClipboardTests(container, initialSource = 'ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික') {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module G &bull; Data Integrity Analysis</div>
      <h1>Copy and Paste Testing</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Test clipboard transmission fidelity for Sinhala text. Verify whether browsers, OS clipboards, or rich-text filters preserve essential Zero-Width Joiners (ZWJ) and combining marks during copy, cut, and paste.
      </p>
    </div>

    <!-- Clipboard API Availability & Security Status -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-header">
        <span class="card-title">Clipboard API Support & Security Status</span>
        <button class="btn btn-outline btn-sm" id="btn-check-permissions">Query Permissions</button>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption">Context Security:</div>
            <div style="font-weight: 600; display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span class="badge ${window.isSecureContext ? 'badge-pass' : 'badge-review'}">
                ${window.isSecureContext ? 'SECURE CONTEXT (HTTPS/Localhost)' : 'INSECURE CONTEXT (HTTP)'}
              </span>
            </div>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption">Async Clipboard API (navigator.clipboard):</div>
            <div style="font-weight: 600; display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span class="badge ${navigator.clipboard ? 'badge-pass' : 'badge-fail'}">
                ${navigator.clipboard ? 'AVAILABLE' : 'UNSUPPORTED'}
              </span>
            </div>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption">Clipboard Read Permission:</div>
            <div id="clip-perm-badge" style="font-weight: 600; display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span class="badge badge-untested">NOT QUERIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Source Text & Copy Action -->
    <div class="comparison-grid" style="margin-bottom: 20px;">
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">1. Source Text (To Copy)</span>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" id="btn-do-copy">Copy to Clipboard</button>
          </div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <textarea id="clip-source-text" class="form-control sinhala-text" style="min-height: 80px;">${escapeHTML(initialSource)}</textarea>
          </div>
          <div class="caption code-font" id="clip-source-hex" style="word-break: break-all; color: var(--text-secondary);"></div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">2. Destination Paste Target</span>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="btn-do-paste">Paste via API</button>
            <button class="btn btn-outline btn-sm" id="btn-clear-target">Clear</button>
          </div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <textarea id="clip-target-text" class="form-control sinhala-text" style="min-height: 80px;" placeholder="Press 'Paste via API' or click here and press Ctrl+V / Cmd+V..."></textarea>
          </div>
          <div class="caption code-font" id="clip-target-hex" style="word-break: break-all; color: var(--text-secondary);"></div>
        </div>
      </div>
    </div>

    <!-- Comparison & Round-Trip Fidelity Verdict -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Round-Trip Transmission Integrity Analysis</span>
      </div>
      <div class="card-body">
        <div id="clip-fidelity-banner">
          <div style="text-align: center; color: var(--text-muted); padding: 16px;">
            Copy the source text above and paste it into the destination field to evaluate clipboard round-trip fidelity.
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Code Point Diff Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Before vs After Code Point Sequence Comparison</span>
      </div>
      <div class="card-body">
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Source Glyph</th>
                <th>Source Hex</th>
                <th>Pasted Glyph</th>
                <th>Pasted Hex</th>
                <th>Integrity Status</th>
              </tr>
            </thead>
            <tbody id="clip-diff-table-body">
              <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted);">Paste text into target above to generate diff.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const sourceInput = container.querySelector('#clip-source-text');
  const targetInput = container.querySelector('#clip-target-text');
  const sourceHex = container.querySelector('#clip-source-hex');
  const targetHex = container.querySelector('#clip-target-hex');
  const fidelityBanner = container.querySelector('#clip-fidelity-banner');
  const diffTableBody = container.querySelector('#clip-diff-table-body');
  const permBadge = container.querySelector('#clip-perm-badge');

  const btnCopy = container.querySelector('#btn-do-copy');
  const btnPaste = container.querySelector('#btn-do-paste');
  const btnClearTarget = container.querySelector('#btn-clear-target');
  const btnCheckPerms = container.querySelector('#btn-check-permissions');

  async function checkPermissions() {
    if (!navigator.permissions || !navigator.permissions.query) {
      permBadge.innerHTML = `<span class="badge badge-untested">PERMISSIONS API UNSUPPORTED</span>`;
      return;
    }
    try {
      const res = await navigator.permissions.query({ name: 'clipboard-read' });
      const stateBadge = res.state === 'granted' ? 'badge-pass' : (res.state === 'prompt' ? 'badge-review' : 'badge-fail');
      permBadge.innerHTML = `<span class="badge ${stateBadge}">${res.state.toUpperCase()}</span>`;
    } catch {
      permBadge.innerHTML = `<span class="badge badge-review">PERMISSION QUERY RESTRICTED</span>`;
    }
  }

  function updateAnalysis() {
    const src = sourceInput.value || '';
    const tgt = targetInput.value || '';

    const srcPoints = getCodePoints(src);
    const tgtPoints = getCodePoints(tgt);

    sourceHex.innerHTML = `<strong>Source Code Points (${srcPoints.length}):</strong> ` + (srcPoints.map(c => c.hex).join(' ') || 'None');
    targetHex.innerHTML = `<strong>Pasted Code Points (${tgtPoints.length}):</strong> ` + (tgtPoints.map(c => c.hex).join(' ') || 'None');

    if (!tgt) {
      fidelityBanner.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 16px;">
          Paste text into the destination field to trigger round-trip comparison.
        </div>
      `;
      diffTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No target text to compare.</td></tr>`;
      return;
    }

    const exactMatch = src === tgt;
    const srcZWJCount = (src.match(/\u200D/g) || []).length;
    const tgtZWJCount = (tgt.match(/\u200D/g) || []).length;
    const zwjPreserved = srcZWJCount === tgtZWJCount;

    fidelityBanner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="badge ${exactMatch ? 'badge-pass' : 'badge-fail'}" style="font-size: 0.8125rem; padding: 4px 10px;">
            ${exactMatch ? '100% BIT-FOR-BIT FIDELITY' : 'ROUND-TRIP CORRUPTION DETECTED'}
          </span>
          <span style="font-size: 0.9375rem;">
            ${exactMatch ? 'All Sinhala code points and ligatures survived clipboard transmission intact.' : 'Text altered during clipboard round-trip.'}
          </span>
        </div>
        <div class="caption code-font">
          ZWJ Count: Source=${srcZWJCount} | Pasted=${tgtZWJCount}
        </div>
      </div>
      ${!zwjPreserved ? `
        <div class="caption" style="margin-top: 8px; color: var(--status-fail);">
          <strong>Critical Defect:</strong> One or more Zero-Width Joiner (U+200D) characters were stripped! Ligatures (e.g. Yansaya / Rakaransaya) will decompose to disconnected glyphs.
        </div>
      ` : ''}
    `;

    // Build diff table
    const maxLen = Math.max(srcPoints.length, tgtPoints.length);
    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      const s = srcPoints[i];
      const t = tgtPoints[i];

      const match = s && t && s.codePoint === t.codePoint;
      rows.push(`
        <tr>
          <td class="caption">${i + 1}</td>
          <td class="sinhala-text" style="font-size: 1.25rem;">${s ? (s.codePoint === 0x200D ? '<span class="badge badge-fail">[ZWJ]</span>' : escapeHTML(s.char)) : '<span class="caption">—</span>'}</td>
          <td class="code-font">${s ? escapeHTML(s.hex) : '—'}</td>
          <td class="sinhala-text" style="font-size: 1.25rem;">${t ? (t.codePoint === 0x200D ? '<span class="badge badge-fail">[ZWJ]</span>' : escapeHTML(t.char)) : '<span class="caption">—</span>'}</td>
          <td class="code-font">${t ? escapeHTML(t.hex) : '—'}</td>
          <td>
            <span class="badge ${match ? 'badge-pass' : 'badge-fail'}">
              ${match ? 'MATCH' : (s && !t ? 'MISSING' : (!s && t ? 'EXTRA' : 'ALTERED'))}
            </span>
          </td>
        </tr>
      `);
    }
    diffTableBody.innerHTML = rows.join('');
  }

  // Event handlers
  sourceInput.addEventListener('input', updateAnalysis);
  targetInput.addEventListener('input', updateAnalysis);

  btnCopy.addEventListener('click', async () => {
    const text = sourceInput.value;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to system clipboard via Clipboard API', 'success');
        return;
      } catch (err) {
        showToast(`Clipboard write failed: ${err.message}. Using fallback...`, 'warning');
      }
    }

    // Fallback copy
    sourceInput.select();
    const ok = document.execCommand('copy');
    if (ok) {
      showToast('Copied via execCommand fallback', 'success');
    } else {
      showToast('Clipboard access denied. Please copy manually with Ctrl+C.', 'error');
    }
  });

  btnPaste.addEventListener('click', async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText();
        targetInput.value = text;
        updateAnalysis();
        showToast('Pasted from clipboard via Clipboard API', 'success');
        return;
      } catch (err) {
        showToast(`Async clipboard read denied: ${err.message}. Focus the box and press Ctrl+V / Cmd+V.`, 'warning');
      }
    } else {
      showToast('Clipboard read API is unavailable. Please paste directly using Ctrl+V.', 'info');
    }
    targetInput.focus();
  });

  btnClearTarget.addEventListener('click', () => {
    targetInput.value = '';
    updateAnalysis();
    showToast('Target cleared', 'info');
  });

  btnCheckPerms.addEventListener('click', checkPermissions);

  // Initial calls
  checkPermissions();
  updateAnalysis();
}

