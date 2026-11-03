/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Browser Environment Information (js/modules/browser-info.js)
 */

import { escapeHTML, showToast } from '../utils/dom.js';

export function renderBrowserInfo(container) {
  const ua = navigator.userAgent;
  const platform = navigator.platform || (navigator.userAgentData ? navigator.userAgentData.platform : 'Unknown');
  const languages = navigator.languages ? navigator.languages.join(', ') : navigator.language;
  const isSecure = window.isSecureContext;

  // Feature detection
  const hasIntlSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
  let segmenterGraphemeWorks = false;
  if (hasIntlSegmenter) {
    try {
      const seg = new Intl.Segmenter('si', { granularity: 'grapheme' });
      const count = Array.from(seg.segment('ශ්‍රී')).length;
      segmenterGraphemeWorks = (count === 1);
    } catch {
      segmenterGraphemeWorks = false;
    }
  }

  const hasNormalize = typeof String.prototype.normalize === 'function';
  let normalizationWorks = false;
  if (hasNormalize) {
    try {
      const nfc = 'කො'.normalize('NFC');
      const nfd = 'කො'.normalize('NFD');
      normalizationWorks = (nfc !== nfd && nfc === 'කො');
    } catch {
      normalizationWorks = false;
    }
  }

  const hasClipboardAPI = !!(navigator.clipboard && navigator.clipboard.readText && navigator.clipboard.writeText);
  const hasTextEncoder = typeof TextEncoder !== 'undefined';
  const hasCanvas = !!document.createElement('canvas').getContext;

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module H &bull; Runtime Environment</div>
      <h1>Browser Environment Information</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Inspecting browser engine capabilities, Unicode internationalization APIs, and client platform properties relevant to Sinhala script processing.
      </p>
    </div>

    <!-- APIs & Capabilities Grid -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Internationalization & Web APIs</span>
        <span class="caption">Native engine execution</span>
      </div>
      <div class="card-body">
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Feature / API</th>
                <th>Standard Reference</th>
                <th>Status</th>
                <th>Diagnostic Findings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Intl.Segmenter API</strong></td>
                <td class="caption">ECMA-402 Intl.Segmenter</td>
                <td>
                  <span class="badge ${hasIntlSegmenter ? 'badge-pass' : 'badge-fail'}">
                    ${hasIntlSegmenter ? 'SUPPORTED' : 'UNSUPPORTED'}
                  </span>
                </td>
                <td class="caption">
                  ${hasIntlSegmenter ? (segmenterGraphemeWorks ? 'Passed: Correctly identifies "ශ්‍රී" as 1 grapheme cluster.' : 'Available but failed multi-modifier cluster test.') : 'Missing: Browser requires fallback code-point grouping.'}
                </td>
              </tr>
              <tr>
                <td><strong>Unicode Normalization</strong></td>
                <td class="caption">ECMA-262 String.prototype.normalize</td>
                <td>
                  <span class="badge ${hasNormalize ? 'badge-pass' : 'badge-fail'}">
                    ${hasNormalize ? 'SUPPORTED' : 'UNSUPPORTED'}
                  </span>
                </td>
                <td class="caption">
                  ${hasNormalize ? (normalizationWorks ? 'Passed: Native NFC/NFD decomposition active for Sinhala combining marks.' : 'Available but decomposition test failed.') : 'Missing: Browser cannot decompose/compose text.'}
                </td>
              </tr>
              <tr>
                <td><strong>Asynchronous Clipboard API</strong></td>
                <td class="caption">W3C Clipboard API and Events</td>
                <td>
                  <span class="badge ${hasClipboardAPI ? 'badge-pass' : 'badge-review'}">
                    ${hasClipboardAPI ? 'SUPPORTED' : 'RESTRICTED / PARTIAL'}
                  </span>
                </td>
                <td class="caption">
                  ${hasClipboardAPI ? 'Navigator.clipboard.readText and writeText available in secure context.' : 'Missing or restricted: Requires interactive user gesture or execCommand.'}
                </td>
              </tr>
              <tr>
                <td><strong>UTF-8 TextEncoder / TextDecoder</strong></td>
                <td class="caption">WHATWG Encoding Standard</td>
                <td>
                  <span class="badge ${hasTextEncoder ? 'badge-pass' : 'badge-fail'}">
                    ${hasTextEncoder ? 'SUPPORTED' : 'UNSUPPORTED'}
                  </span>
                </td>
                <td class="caption">
                  ${hasTextEncoder ? 'Accurate byte measurement for storage boundaries and wire transmission.' : 'Missing text encoding API.'}
                </td>
              </tr>
              <tr>
                <td><strong>Secure Context (window.isSecureContext)</strong></td>
                <td class="caption">W3C Secure Contexts</td>
                <td>
                  <span class="badge ${isSecure ? 'badge-pass' : 'badge-review'}">
                    ${isSecure ? 'SECURE (HTTPS / Localhost)' : 'INSECURE (HTTP)'}
                  </span>
                </td>
                <td class="caption">
                  ${isSecure ? 'Modern cryptographic and clipboard permissions can be granted.' : 'Clipboard and modern storage APIs may be blocked by browser security policy.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Client & Operating System Identification -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Client Platform Details</span>
        <span class="caption">Environment headers</span>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div>
            <div class="form-group">
              <label class="form-label">Platform (navigator.platform):</label>
              <div class="readonly-display code-font" style="min-height: 40px; padding: 8px 12px; font-size: 0.875rem;">
                ${escapeHTML(platform)}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Language Preferences (navigator.languages):</label>
              <div class="readonly-display code-font" style="min-height: 40px; padding: 8px 12px; font-size: 0.875rem;">
                ${escapeHTML(languages)}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Screen & Pixel Ratio:</label>
              <div class="readonly-display code-font" style="min-height: 40px; padding: 8px 12px; font-size: 0.875rem;">
                ${window.screen ? `${window.screen.width} × ${window.screen.height} (DPR: ${window.devicePixelRatio || 1})` : 'Unknown'}
              </div>
            </div>
          </div>
          <div>
            <div class="form-group">
              <label class="form-label">User Agent String:</label>
              <textarea class="form-control code-font" readonly style="min-height: 120px; font-size: 0.8125rem;">${escapeHTML(ua)}</textarea>
            </div>
            <div class="caption" style="color: var(--text-muted); line-height: 1.4;">
              * Note: Modern browsers freeze or minimize User-Agent strings. User-Agent strings provide approximate heuristic data rather than guaranteed hardware specifications.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sinhala Font Stack Rendering Preview -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Sinhala Font Stack & Rendering Test</span>
      </div>
      <div class="card-body">
        <p class="caption" style="margin-bottom: 16px;">
          Compare rendering across major Sinhala-capable font families available on common operating systems:
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div class="caption" style="margin-bottom: 4px;">Primary Web Stack (Noto Sans Sinhala, Iskoola Pota, Nirmala UI):</div>
            <div class="sinhala-text" style="font-size: 1.5rem;">
              ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය — 1234567890 — විද්‍යාව සහ තාක්ෂණය
            </div>
          </div>
          <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-family: 'Iskoola Pota', 'Noto Sans Sinhala', sans-serif;">
            <div class="caption" style="margin-bottom: 4px;">Windows Native Stack (Iskoola Pota):</div>
            <div class="sinhala-text" style="font-size: 1.5rem;">
              ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය — 1234567890 — විද්‍යාව සහ තාක්ෂණය
            </div>
          </div>
          <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-family: 'Nirmala UI', sans-serif;">
            <div class="caption" style="margin-bottom: 4px;">Windows Modern Stack (Nirmala UI):</div>
            <div class="sinhala-text" style="font-size: 1.5rem;">
              ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය — 1234567890 — විද්‍යාව සහ තාක්ෂණය
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

