/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Dashboard (js/modules/dashboard.js)
 */

import { getStoredResults } from '../utils/storage.js';
import { escapeHTML } from '../utils/dom.js';

export function renderDashboard(container, corpus, onNavigate) {
  const storedResults = getStoredResults();
  const totalCorpusCases = corpus ? corpus.length : 0;
  
  // Real calculation from stored test records
  const passed = storedResults.filter(r => r.status === 'Pass').length;
  const failed = storedResults.filter(r => r.status === 'Fail').length;
  const review = storedResults.filter(r => r.status === 'Needs Review').length;
  const manual = storedResults.filter(r => r.status === 'Manual Test').length;

  const intlSegmenterSupported = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
  const clipboardSupported = navigator.clipboard && typeof navigator.clipboard.readText === 'function';
  const normalizeSupported = typeof String.prototype.normalize === 'function';

  container.innerHTML = `
    <div class="dashboard-hero" style="margin-bottom: 28px;">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Sinhala Web Interoperability Test Kit</div>
          <h1 style="margin-bottom: 8px;">SiWIT Test Dashboard</h1>
          <p style="color: var(--text-secondary); max-width: 820px; font-size: 0.9375rem;">
            A developer-oriented testing toolkit for investigating, reproducing, documenting, and testing Sinhala Unicode text interoperability in modern web engines.
          </p>
        </div>
        <div style="text-align: right; font-size: 0.8125rem; color: var(--text-secondary);">
          <div>Created & Led by <strong>Uditha Manohara Prasad</strong></div>
          <div style="margin-top: 2px;">Published under <strong style="color: var(--text-primary);">Neziora</strong></div>
          <div class="caption" style="margin-top: 4px;">v0.1.0 (Public Release)</div>
        </div>
      </div>
    </div>

    <!-- Real Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-label">Corpus Test Cases</span>
        <span class="metric-value" style="color: var(--text-primary);">${totalCorpusCases}</span>
        <span class="metric-sub">Curated Sinhala linguistic cases</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Executed Test Runs</span>
        <span class="metric-value" style="color: var(--text-primary);">${storedResults.length}</span>
        <span class="metric-sub">Locally recorded in browser</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Passed Tests</span>
        <span class="metric-value" style="color: var(--status-pass);">${passed}</span>
        <span class="metric-sub">Verified expected behaviors</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Failures / Review</span>
        <span class="metric-value" style="color: ${failed > 0 ? 'var(--status-fail)' : 'var(--status-review)'};">${failed + review}</span>
        <span class="metric-sub">${failed} failed &bull; ${review} needs review</span>
      </div>
    </div>

    <!-- Quick Environment & Capability Status -->
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <span class="card-title">Browser Engine Capabilities</span>
        <span class="badge badge-pass">Client-Side Native</span>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <div style="padding: 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption" style="margin-bottom: 4px;">Intl.Segmenter (Grapheme)</div>
            <div style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span class="badge ${intlSegmenterSupported ? 'badge-pass' : 'badge-fail'}">
                ${intlSegmenterSupported ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
              <span class="caption">${intlSegmenterSupported ? 'Accurate cluster segmentation' : 'Using code-point fallback'}</span>
            </div>
          </div>
          <div style="padding: 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption" style="margin-bottom: 4px;">Unicode Normalization</div>
            <div style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span class="badge ${normalizeSupported ? 'badge-pass' : 'badge-fail'}">
                ${normalizeSupported ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
              <span class="caption">NFC, NFD, NFKC, NFKD native</span>
            </div>
          </div>
          <div style="padding: 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption" style="margin-bottom: 4px;">Clipboard API</div>
            <div style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span class="badge ${clipboardSupported ? 'badge-pass' : 'badge-review'}">
                ${clipboardSupported ? 'AVAILABLE' : 'RESTRICTED'}
              </span>
              <span class="caption">${clipboardSupported ? 'Async read/write supported' : 'Requires user gesture/fallback'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation to Testing Modules -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 1.125rem; margin-bottom: 14px;">Testing Modules</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="inspector">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Unicode Inspector</h3>
              <span class="brand-label" style="color: var(--accent);">Module B</span>
            </div>
            <p class="caption">Inspect Sinhala code points, UTF-16 units, graphemes, and official character names.</p>
          </div>
        </div>
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="corpus">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Sinhala Test Corpus</h3>
              <span class="brand-label" style="color: var(--accent);">Module C</span>
            </div>
            <p class="caption">Browse 20+ verified cases: Yansaya, Rakaransaya, Repaya, Bandiyakuru, and Sannaka.</p>
          </div>
        </div>
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="playground">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Interaction Playground</h3>
              <span class="brand-label" style="color: var(--accent);">Module D</span>
            </div>
            <p class="caption">Test input, textarea, and contenteditable with real-time event & cursor logging.</p>
          </div>
        </div>
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="normalization">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Normalization Testing</h3>
              <span class="brand-label" style="color: var(--accent);">Module E</span>
            </div>
            <p class="caption">Side-by-side NFC, NFD, NFKC, and NFKD string comparison and sequence diff.</p>
          </div>
        </div>
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="length">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Length & Input Limits</h3>
              <span class="brand-label" style="color: var(--accent);">Module F</span>
            </div>
            <p class="caption">Compare UTF-16 length vs code points vs grapheme clusters vs HTML maxlength.</p>
          </div>
        </div>
        <div class="card" style="cursor: pointer; transition: border-color 0.15s ease;" data-nav="clipboard">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 1rem;">Copy & Paste Testing</h3>
              <span class="brand-label" style="color: var(--accent);">Module G</span>
            </div>
            <p class="caption">Test clipboard round-trip integrity, ZWJ retention, and permission behavior.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Stored Test Records -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Recent Local Test Runs</span>
        <button class="btn btn-outline btn-sm" id="btn-view-all-reports">View All Reports</button>
      </div>
      <div class="card-body">
        ${storedResults.length === 0 ? `
          <div style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
            <div style="font-size: 1.25rem; margin-bottom: 8px;">No test runs recorded yet</div>
            <p class="caption" style="max-width: 480px; margin: 0 auto 16px;">
              Execute tests in the Interaction Playground or load test cases from the Corpus to log verified results.
            </p>
            <button class="btn btn-primary btn-sm" id="btn-goto-corpus">Open Test Corpus</button>
          </div>
        ` : `
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Category</th>
                  <th>Test String</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${storedResults.slice(0, 5).map(r => `
                  <tr>
                    <td class="code-font" style="font-weight: 600;">${escapeHTML(r.testId || 'CUSTOM')}</td>
                    <td><span class="badge badge-untested">${escapeHTML(r.category || 'general')}</span></td>
                    <td class="sinhala-text" style="font-size: 1.125rem;">${escapeHTML(r.testString)}</td>
                    <td>
                      <span class="badge ${
                        r.status === 'Pass' ? 'badge-pass' :
                        r.status === 'Fail' ? 'badge-fail' :
                        r.status === 'Needs Review' ? 'badge-review' : 'badge-manual'
                      }">${escapeHTML(r.status)}</span>
                    </td>
                    <td class="caption">${new Date(r.timestamp).toLocaleString()}</td>
                    <td class="caption" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      ${escapeHTML(r.notes || '—')}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  // Attach event listeners for navigation cards
  container.querySelectorAll('[data-nav]').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-nav');
      if (onNavigate) onNavigate(target);
    });
  });

  const btnViewAll = container.querySelector('#btn-view-all-reports');
  if (btnViewAll) {
    btnViewAll.addEventListener('click', () => {
      if (onNavigate) onNavigate('reports');
    });
  }

  const btnGotoCorpus = container.querySelector('#btn-goto-corpus');
  if (btnGotoCorpus) {
    btnGotoCorpus.addEventListener('click', () => {
      if (onNavigate) onNavigate('corpus');
    });
  }
}

