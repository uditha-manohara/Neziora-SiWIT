/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Sinhala Test Corpus (js/modules/corpus.js)
 */

import { escapeHTML, showToast } from '../utils/dom.js';
import { saveTestResult } from '../utils/storage.js';

export function renderCorpus(container, corpus, onNavigate, onSelectTestCase) {
  let activeCategory = 'all';
  let activeStatus = 'all';
  let searchQuery = '';

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'independent-vowels', label: 'Independent Vowels' },
    { id: 'vowel-signs', label: 'Vowel Signs (Pili)' },
    { id: 'virama-pure-consonants', label: 'Virama / Pure Consonants' },
    { id: 'yansaya', label: 'Yansaya' },
    { id: 'rakaransaya', label: 'Rakaransaya' },
    { id: 'repaya', label: 'Repaya' },
    { id: 'bandi-akuru', label: 'Bandi-akuru (Conjuncts)' },
    { id: 'prenasalized-sannaka', label: 'Sannaka (Prenasalized)' },
    { id: 'punctuation', label: 'Punctuation & Signs' },
    { id: 'mixed-script', label: 'Mixed Script' },
    { id: 'normalization', label: 'Normalization Cases' },
    { id: 'length-truncation', label: 'Length & Truncation' }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module C &bull; Test Case Repository</div>
      <h1>Sinhala Test Corpus</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        A collection of verified Sinhala Unicode sequences across phonological and orthographic categories. Each case includes documented purpose, expected behavior, and direct links to execution modules.
      </p>
    </div>

    <!-- Search & Filter Controls -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-body">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px;">
          <div style="flex: 1; min-width: 260px;">
            <label class="form-label" for="corpus-search">Search Test Cases:</label>
            <input type="text" id="corpus-search" class="form-control" placeholder="Search by ID, keyword, or Sinhala text...">
          </div>
          <div style="min-width: 180px;">
            <label class="form-label" for="corpus-status-filter">Validation Status:</label>
            <select id="corpus-status-filter" class="form-control">
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="needs-review">Needs Review</option>
              <option value="exploratory">Exploratory</option>
            </select>
          </div>
        </div>

        <div>
          <div class="caption" style="margin-bottom: 8px; font-weight: 600;">Filter by Category:</div>
          <div class="filter-pills" id="corpus-category-pills">
            ${categories.map(cat => `
              <button class="filter-pill ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Active Count Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <div class="caption" id="corpus-count-label">Showing all test cases</div>
      <button class="btn btn-outline btn-sm" id="btn-export-corpus-json">Export Corpus JSON</button>
    </div>

    <!-- Test Cases Grid -->
    <div id="corpus-list" style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Populated dynamically -->
    </div>

    <!-- Record Result Modal (Hidden by default) -->
    <div id="record-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; align-items: center; justify-content: center;">
      <div class="card" style="width: 90%; max-width: 540px; margin: 0; background: var(--bg-surface-elevated);">
        <div class="card-header">
          <span class="card-title">Record Test Result</span>
          <button class="btn btn-ghost btn-sm" id="btn-close-modal">&times;</button>
        </div>
        <div class="card-body">
          <div id="modal-test-summary" style="margin-bottom: 16px; padding: 10px; background: var(--bg-input); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <!-- Populated on modal open -->
          </div>
          <div class="form-group">
            <label class="form-label" for="modal-status-select">Result Status:</label>
            <select id="modal-status-select" class="form-control">
              <option value="Pass">Pass (Observed expected behavior)</option>
              <option value="Fail">Fail (Observed rendering/editing error)</option>
              <option value="Needs Review">Needs Review (Uncertain/discrepancy)</option>
              <option value="Manual Test">Manual Test (Exploratory observation)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="modal-observed-notes">Observed Behavior & Notes:</label>
            <textarea id="modal-observed-notes" class="form-control" style="min-height: 80px;" placeholder="Describe what occurred in this browser..."></textarea>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline btn-sm" id="btn-modal-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-modal-save">Save Result to Reports</button>
        </div>
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#corpus-search');
  const statusFilter = container.querySelector('#corpus-status-filter');
  const categoryPillsContainer = container.querySelector('#corpus-category-pills');
  const corpusList = container.querySelector('#corpus-list');
  const countLabel = container.querySelector('#corpus-count-label');
  const btnExport = container.querySelector('#btn-export-corpus-json');

  const modalBackdrop = container.querySelector('#record-modal-backdrop');
  const btnCloseModal = container.querySelector('#btn-close-modal');
  const btnCancelModal = container.querySelector('#btn-modal-cancel');
  const btnSaveModal = container.querySelector('#btn-modal-save');
  const modalSummary = container.querySelector('#modal-test-summary');
  const modalStatusSelect = container.querySelector('#modal-status-select');
  const modalNotes = container.querySelector('#modal-observed-notes');

  let currentRecordingCase = null;

  function filterCorpus() {
    let filtered = corpus || [];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (activeStatus !== 'all') {
      filtered = filtered.filter(item => item.validationStatus === activeStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.testString.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    countLabel.textContent = `Showing ${filtered.length} of ${corpus.length} test cases`;

    if (filtered.length === 0) {
      corpusList.innerHTML = `
        <div class="card">
          <div class="card-body" style="text-align: center; padding: 40px; color: var(--text-secondary);">
            <div style="font-size: 1.125rem; margin-bottom: 8px;">No matching test cases found</div>
            <p class="caption">Try adjusting your category filter or search keywords.</p>
          </div>
        </div>
      `;
      return;
    }

    corpusList.innerHTML = filtered.map(item => `
      <div class="card" id="case-${escapeHTML(item.id)}">
        <div class="card-header">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span class="code-font" style="font-weight: 700; color: var(--accent); font-size: 0.9375rem;">${escapeHTML(item.id)}</span>
            <span style="font-weight: 600; font-size: 1rem;">${escapeHTML(item.name)}</span>
            <span class="badge badge-untested">${escapeHTML(item.category)}</span>
            <span class="badge ${item.validationStatus === 'verified' ? 'badge-pass' : 'badge-review'}">
              ${escapeHTML(item.validationStatus)}
            </span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm btn-inspect-case" data-id="${escapeHTML(item.id)}">Inspect</button>
            <button class="btn btn-secondary btn-sm btn-playground-case" data-id="${escapeHTML(item.id)}">Playground</button>
            <button class="btn btn-primary btn-sm btn-record-case" data-id="${escapeHTML(item.id)}">Record Result</button>
          </div>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: flex-start;">
            <div style="text-align: center; background: var(--bg-surface-elevated); padding: 16px 24px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); min-width: 140px;">
              <div class="caption" style="margin-bottom: 4px;">Test String</div>
              <div class="sinhala-text" style="font-size: 2.25rem; font-weight: 600; line-height: 1.2;">
                ${escapeHTML(item.testString)}
              </div>
            </div>
            <div>
              <p style="font-size: 0.9375rem; margin-bottom: 10px;">${escapeHTML(item.description)}</p>
              <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 0.8125rem;">
                <div><strong style="color: var(--text-secondary);">Purpose:</strong> ${escapeHTML(item.purpose)}</div>
                <div><strong style="color: var(--text-secondary);">Expected:</strong> ${escapeHTML(item.expectedBehavior || 'Observable standard behavior')}</div>
                <div><strong style="color: var(--text-secondary);">Instructions:</strong> ${escapeHTML(item.testInstructions)}</div>
                <div class="caption"><strong style="color: var(--text-muted);">Source / Reference:</strong> ${escapeHTML(item.sourceOrReference || 'Unicode Standard / SLS 1134')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach row button listeners
    corpusList.querySelectorAll('.btn-inspect-case').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tc = corpus.find(c => c.id === id);
        if (tc && onSelectTestCase) {
          onSelectTestCase('inspector', tc.testString);
        }
      });
    });

    corpusList.querySelectorAll('.btn-playground-case').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tc = corpus.find(c => c.id === id);
        if (tc && onSelectTestCase) {
          onSelectTestCase('playground', tc.testString, tc);
        }
      });
    });

    corpusList.querySelectorAll('.btn-record-case').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tc = corpus.find(c => c.id === id);
        if (tc) {
          openRecordModal(tc);
        }
      });
    });
  }

  function openRecordModal(tc) {
    currentRecordingCase = tc;
    modalSummary.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span class="code-font" style="font-weight: 700; color: var(--accent);">${escapeHTML(tc.id)}</span>
        <span class="sinhala-text" style="font-size: 1.5rem;">${escapeHTML(tc.testString)}</span>
      </div>
      <div style="font-size: 0.875rem; font-weight: 600;">${escapeHTML(tc.name)}</div>
      <div class="caption">${escapeHTML(tc.description)}</div>
    `;
    modalStatusSelect.value = 'Pass';
    modalNotes.value = '';
    modalBackdrop.style.display = 'flex';
  }

  function closeModal() {
    modalBackdrop.style.display = 'none';
    currentRecordingCase = null;
  }

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  btnSaveModal.addEventListener('click', () => {
    if (!currentRecordingCase) return;
    const status = modalStatusSelect.value;
    const notes = modalNotes.value.trim();

    const record = {
      testId: currentRecordingCase.id,
      name: currentRecordingCase.name,
      category: currentRecordingCase.category,
      testString: currentRecordingCase.testString,
      expectedBehavior: currentRecordingCase.expectedBehavior,
      observedBehavior: notes || 'Tested as expected in browser environment',
      status: status,
      notes: notes,
      browser: navigator.userAgent
    };

    const res = saveTestResult(record);
    if (res.success) {
      showToast(`Saved test result for ${currentRecordingCase.id} (${status})`, 'success');
      closeModal();
    } else {
      showToast(`Error saving: ${res.reason}`, 'error');
    }
  });

  // Filter Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterCorpus();
  });

  statusFilter.addEventListener('change', (e) => {
    activeStatus = e.target.value;
    filterCorpus();
  });

  categoryPillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-cat');
      filterCorpus();
    });
  });

  btnExport.addEventListener('click', () => {
    const jsonStr = JSON.stringify(corpus, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siwit-sinhala-corpus-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Corpus exported as JSON', 'success');
  });

  // Initial render
  filterCorpus();
}

