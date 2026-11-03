/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Test Results & Reports System (js/modules/reports.js)
 */

import { getStoredResults, deleteTestResult, clearAllResults, getStorageUsageBytes, saveTestResult } from '../utils/storage.js';
import { escapeHTML, showToast, downloadFile } from '../utils/dom.js';

export function renderReports(container) {
  function refreshView() {
    const results = getStoredResults();
    const bytesUsed = getStorageUsageBytes();
    const passed = results.filter(r => r.status === 'Pass').length;
    const failed = results.filter(r => r.status === 'Fail').length;
    const review = results.filter(r => r.status === 'Needs Review').length;
    const manual = results.filter(r => r.status === 'Manual Test').length;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module I &bull; Evidence & Reproduction</div>
        <h1>Test Results & Reports</h1>
        <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
          Review recorded Sinhala interoperability test outcomes. Export comprehensive reproduction reports in JSON or GitHub-flavored Markdown for sharing with browser vendors, font designers, or QA teams.
        </p>
      </div>

      <!-- Storage Disclosure & Action Controls -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <span class="card-title">Local Browser Storage Disclosure</span>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" id="btn-import-json">Import JSON</button>
            <input type="file" id="file-import-json" accept=".json" style="display: none;">
            <button class="btn btn-secondary btn-sm" id="btn-export-markdown">Export Markdown Report</button>
            <button class="btn btn-primary btn-sm" id="btn-export-json">Export JSON Report</button>
            <button class="btn btn-outline btn-sm" id="btn-clear-all" style="color: var(--status-fail); border-color: var(--status-fail);">Clear All Records</button>
          </div>
        </div>
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div class="caption" style="max-width: 720px;">
              <strong>Data Privacy:</strong> All test runs are persisted exclusively in your browser's private <code>localStorage</code>. No text, results, or telemetry are ever transmitted to any external server or API.
            </div>
            <div class="caption code-font">
              Storage in use: <strong>${(bytesUsed / 1024).toFixed(2)} KB</strong> (${results.length} records)
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Total Recorded Runs</span>
          <span class="metric-value">${results.length}</span>
          <span class="metric-sub">Session test entries</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Passed</span>
          <span class="metric-value" style="color: var(--status-pass);">${passed}</span>
          <span class="metric-sub">Expected behavior verified</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Failed</span>
          <span class="metric-value" style="color: var(--status-fail);">${failed}</span>
          <span class="metric-sub">Reproduced bugs/glitches</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Review / Manual</span>
          <span class="metric-value" style="color: var(--status-review);">${review + manual}</span>
          <span class="metric-sub">${review} review &bull; ${manual} manual tests</span>
        </div>
      </div>

      <!-- Test Runs Table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recorded Test Executions</span>
          <span class="caption">Ordered by most recent</span>
        </div>
        <div class="card-body">
          ${results.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
              <div style="font-size: 1.125rem; margin-bottom: 8px;">No test runs have been recorded yet</div>
              <p class="caption">Execute test cases in the Corpus or Playground modules to compile your test report.</p>
            </div>
          ` : `
            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Record ID / Test</th>
                    <th>Category</th>
                    <th>Sinhala Test String</th>
                    <th>Status</th>
                    <th>Observed Notes</th>
                    <th>Date & Platform</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.map(r => `
                    <tr>
                      <td>
                        <div class="code-font" style="font-weight: 700; color: var(--accent);">${escapeHTML(r.testId || 'CUSTOM')}</div>
                        <div style="font-size: 0.8125rem;">${escapeHTML(r.name || 'Custom Test')}</div>
                      </td>
                      <td><span class="badge badge-untested">${escapeHTML(r.category || 'general')}</span></td>
                      <td class="sinhala-text" style="font-size: 1.25rem;">${escapeHTML(r.testString || '')}</td>
                      <td>
                        <span class="badge ${
                          r.status === 'Pass' ? 'badge-pass' :
                          r.status === 'Fail' ? 'badge-fail' :
                          r.status === 'Needs Review' ? 'badge-review' : 'badge-manual'
                        }">${escapeHTML(r.status)}</span>
                      </td>
                      <td class="caption" style="max-width: 280px; word-break: break-word;">
                        ${escapeHTML(r.observedBehavior || r.notes || '—')}
                      </td>
                      <td class="caption">
                        <div>${new Date(r.timestamp).toLocaleDateString()} ${new Date(r.timestamp).toLocaleTimeString()}</div>
                        <div style="color: var(--text-muted); font-size: 0.75rem; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHTML(r.browser || '')}</div>
                      </td>
                      <td>
                        <button class="btn btn-ghost btn-sm btn-delete-record" data-id="${escapeHTML(r.id)}" style="color: var(--status-fail);">Delete</button>
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

    // Bind action listeners
    const btnClear = container.querySelector('#btn-clear-all');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all locally stored test records? This cannot be undone.')) {
          clearAllResults();
          showToast('Cleared all local test records', 'info');
          refreshView();
        }
      });
    }

    const btnExportJSON = container.querySelector('#btn-export-json');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        const payload = {
          toolkit: 'SiWIT (Sinhala Web Interoperability Test Kit)',
          projectLead: 'Uditha Manohara Prasad',
          brand: 'Neziora',
          exportDate: new Date().toISOString(),
          environment: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          },
          summary: { total: results.length, passed, failed, review, manual },
          records: results
        };
        downloadFile(`siwit-test-report-${Date.now()}.json`, JSON.stringify(payload, null, 2), 'application/json');
        showToast('Exported test report as JSON', 'success');
      });
    }

    const btnExportMD = container.querySelector('#btn-export-markdown');
    if (btnExportMD) {
      btnExportMD.addEventListener('click', () => {
        let md = `# SiWIT Test Execution Report\n\n`;
        md += `**Project:** SiWIT (Sinhala Web Interoperability Test Kit)  \n`;
        md += `**Created & Led by:** Uditha Manohara Prasad  \n`;
        md += `**Published under:** Neziora  \n`;
        md += `**Report Generated:** ${new Date().toISOString()}  \n\n`;
        md += `## 1. Test Environment\n\n`;
        md += `- **User Agent:** \`${navigator.userAgent}\`\n`;
        md += `- **Platform:** \`${navigator.platform || 'Unknown'}\`\n`;
        md += `- **Language:** \`${navigator.language}\`\n\n`;
        md += `## 2. Summary Statistics\n\n`;
        md += `| Total Tests | Passed | Failed | Needs Review | Manual Tests |\n`;
        md += `| :---: | :---: | :---: | :---: | :---: |\n`;
        md += `| ${results.length} | ${passed} | ${failed} | ${review} | ${manual} |\n\n`;
        md += `## 3. Detailed Test Results\n\n`;

        results.forEach((r, idx) => {
          md += `### ${idx + 1}. [${r.status.toUpperCase()}] ${r.testId || 'CUSTOM'}: ${r.name || 'Custom Test'}\n\n`;
          md += `- **Test String:** \`${r.testString}\`\n`;
          md += `- **Category:** \`${r.category}\`\n`;
          md += `- **Timestamp:** ${r.timestamp}\n`;
          md += `- **Expected Behavior:** ${r.expectedBehavior || 'Standard expected behavior'}\n`;
          md += `- **Observed Behavior:** ${r.observedBehavior || r.notes || 'No notes provided'}\n`;
          md += `- **Status:** **${r.status}**\n\n`;
        });

        md += `---\n*Report generated by SiWIT v0.1.0 — Neziora.*\n`;

        downloadFile(`siwit-test-report-${Date.now()}.md`, md, 'text/markdown;charset=utf-8');
        showToast('Exported test report as Markdown', 'success');
      });
    }

    const btnImportJSON = container.querySelector('#btn-import-json');
    const fileImportInput = container.querySelector('#file-import-json');
    if (btnImportJSON && fileImportInput) {
      btnImportJSON.addEventListener('click', () => fileImportInput.click());
      fileImportInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            const importedRecords = data.records || (Array.isArray(data) ? data : []);
            let count = 0;
            importedRecords.forEach(rec => {
              if (rec.testString) {
                saveTestResult(rec);
                count++;
              }
            });
            showToast(`Successfully imported ${count} test records!`, 'success');
            refreshView();
          } catch (err) {
            showToast(`Failed to import JSON: ${err.message}`, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    container.querySelectorAll('.btn-delete-record').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          deleteTestResult(id);
          showToast('Deleted record', 'info');
          refreshView();
        }
      });
    });
  }

  refreshView();
}

