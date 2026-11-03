/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Text Interaction Playground (js/modules/interaction-tests.js)
 */

import { escapeHTML, showToast } from '../utils/dom.js';
import { getCodePoints } from '../utils/unicode.js';
import { saveTestResult } from '../utils/storage.js';

export function renderInteractionPlayground(container, corpus, initialText = 'ශ්‍රී ලංකා', initialCase = null) {
  let activeCase = initialCase;
  const eventLog = [];

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Module D &bull; Interactive Testing</div>
      <h1>Text Interaction Playground</h1>
      <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
        Examine text insertion, deletion, backspace behavior, caret travel, selection boundaries, and input events across standard web editing environments.
      </p>
    </div>

    <!-- Active Test Case Information Card -->
    <div class="card" id="playground-case-card" style="${activeCase ? '' : 'display: none;'}">
      <div class="card-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="code-font" style="font-weight: 700; color: var(--accent);" id="pg-case-id">${activeCase ? escapeHTML(activeCase.id) : ''}</span>
          <span style="font-weight: 600;" id="pg-case-name">${activeCase ? escapeHTML(activeCase.name) : ''}</span>
        </div>
        <button class="btn btn-outline btn-sm" id="btn-pg-clear-case">Unload Case</button>
      </div>
      <div class="card-body">
        <div style="font-size: 0.875rem; margin-bottom: 8px;" id="pg-case-desc">${activeCase ? escapeHTML(activeCase.description) : ''}</div>
        <div class="caption" style="margin-bottom: 4px;"><strong style="color: var(--text-secondary);">Expected Behavior:</strong> <span id="pg-case-expected">${activeCase ? escapeHTML(activeCase.expectedBehavior || '') : ''}</span></div>
        <div class="caption"><strong style="color: var(--text-secondary);">Specific Test Steps:</strong> <span id="pg-case-steps">${activeCase ? escapeHTML(activeCase.testInstructions || '') : ''}</span></div>
      </div>
    </div>

    <!-- Load Test String Controls -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Test String Controls</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" id="btn-pg-reset-all">Reset All Fields</button>
          <button class="btn btn-primary btn-sm" id="btn-pg-load-all">Load String into All Fields</button>
        </div>
      </div>
      <div class="card-body">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px;">
            <input type="text" id="pg-string-input" class="form-control sinhala-text" value="${escapeHTML(initialText)}" placeholder="Enter Sinhala test string...">
          </div>
          <div style="min-width: 200px;">
            <select id="pg-corpus-select" class="form-control">
              <option value="">Select from Corpus...</option>
              ${corpus ? corpus.map(c => `
                <option value="${escapeHTML(c.id)}" ${activeCase && activeCase.id === c.id ? 'selected' : ''}>
                  ${escapeHTML(c.id)}: ${escapeHTML(c.name)} (${escapeHTML(c.testString)})
                </option>
              `).join('') : ''}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Playground Environments Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px; margin-bottom: 24px;">
      
      <!-- 1. Single-Line Text Input -->
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">1. Single-Line HTML &lt;input&gt;</span>
          <span class="caption">Standard input</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <input type="text" id="env-input" class="form-control sinhala-text" value="${escapeHTML(initialText)}" autocomplete="off" spellcheck="false">
          </div>
          <div class="caption code-font" id="env-input-meta" style="color: var(--text-secondary);">
            Caret: 0 &bull; Selection: [0..0] &bull; Length: ${initialText.length}
          </div>
        </div>
      </div>

      <!-- 2. Multiline Textarea -->
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">2. Multiline &lt;textarea&gt;</span>
          <span class="caption">Wrapping & breaks</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <textarea id="env-textarea" class="form-control sinhala-text" spellcheck="false">${escapeHTML(initialText)}</textarea>
          </div>
          <div class="caption code-font" id="env-textarea-meta" style="color: var(--text-secondary);">
            Caret: 0 &bull; Selection: [0..0] &bull; Length: ${initialText.length}
          </div>
        </div>
      </div>

      <!-- 3. Rich Contenteditable Area -->
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">3. &lt;div contenteditable="true"&gt;</span>
          <span class="caption">Rich text editing</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div id="env-editable" class="editable-area" contenteditable="true" spellcheck="false">${escapeHTML(initialText)}</div>
          </div>
          <div class="caption code-font" id="env-editable-meta" style="color: var(--text-secondary);">
            DOM Caret: Ready &bull; Contenteditable active
          </div>
        </div>
      </div>

      <!-- 4. Read-Only Display -->
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <span class="card-title">4. Read-Only Display</span>
          <span class="caption">Selection & copy source</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div id="env-readonly" class="readonly-display">${escapeHTML(initialText)}</div>
          </div>
          <div class="caption" style="color: var(--text-secondary);">
            Click and drag or double click to test OS text selection boundaries.
          </div>
        </div>
      </div>

    </div>

    <!-- Live Event Stream Logger & Caret Inspector -->
    <div class="card">
      <div class="card-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="card-title">Real-Time Event Stream Logger</span>
          <span class="badge badge-untested" id="event-count-badge">0 events</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" id="btn-clear-log">Clear Event Log</button>
        </div>
      </div>
      <div class="card-body">
        <div class="timeline-logger" id="event-timeline" style="min-height: 180px;">
          <div style="color: var(--text-muted); text-align: center; padding: 20px;">
            Interact with any field above (type, backspace, navigate with arrows, paste, or select) to observe DOM input and keyboard events in real-time.
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Test Checklist & Result Submission -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Interactive Manual Test Checklist & Result Logging</span>
        <span class="badge badge-manual">Exploratory Verification</span>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" id="chk-step-backspace" style="margin-top: 3px;">
            <div>
              <strong>Backspace Deletion:</strong>
              <div class="caption">Does Backspace cleanly remove the vowel sign/virama or cluster without leaving orphaned combining marks?</div>
            </div>
          </label>
          <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" id="chk-step-arrows" style="margin-top: 3px;">
            <div>
              <strong>Arrow-Key Navigation:</strong>
              <div class="caption">Does the caret step smoothly across the complex Sinhala sequence without splitting ligature glyphs awkwardly?</div>
            </div>
          </label>
          <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" id="chk-step-selection" style="margin-top: 3px;">
            <div>
              <strong>Text Selection:</strong>
              <div class="caption">Does mouse drag or Shift+Arrow highlight the entire grapheme cluster cleanly?</div>
            </div>
          </label>
          <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" id="chk-step-paste" style="margin-top: 3px;">
            <div>
              <strong>Clipboard Insertion:</strong>
              <div class="caption">Does pasted Sinhala text preserve ZWJ (U+200D) and render conjuncts faithfully?</div>
            </div>
          </label>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;">
          <div style="flex: 1; min-width: 220px;">
            <label class="form-label" for="pg-record-status">Evaluation Status:</label>
            <select id="pg-record-status" class="form-control">
              <option value="Pass">Pass (All verified cleanly)</option>
              <option value="Fail">Fail (Rendering or editing glitch observed)</option>
              <option value="Needs Review">Needs Review (Uncertain/discrepancy)</option>
              <option value="Manual Test" selected>Manual Test (Recorded observation)</option>
            </select>
          </div>
          <div style="flex: 2; min-width: 280px;">
            <label class="form-label" for="pg-record-notes">Tester Notes / Reproduction Details:</label>
            <input type="text" id="pg-record-notes" class="form-control" placeholder="e.g. Backspacing over 'ශ්‍රී' decomposes into 'ශ්‍ර' in Chrome 124 on Windows">
          </div>
          <div>
            <button class="btn btn-primary" id="btn-pg-save-result">Save Test Result</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Element handles
  const stringInput = container.querySelector('#pg-string-input');
  const corpusSelect = container.querySelector('#pg-corpus-select');
  const btnLoadAll = container.querySelector('#btn-pg-load-all');
  const btnResetAll = container.querySelector('#btn-pg-reset-all');

  const envInput = container.querySelector('#env-input');
  const envTextarea = container.querySelector('#env-textarea');
  const envEditable = container.querySelector('#env-editable');
  const envReadonly = container.querySelector('#env-readonly');

  const envInputMeta = container.querySelector('#env-input-meta');
  const envTextareaMeta = container.querySelector('#env-textarea-meta');
  const envEditableMeta = container.querySelector('#env-editable-meta');

  const eventTimeline = container.querySelector('#event-timeline');
  const eventCountBadge = container.querySelector('#event-count-badge');
  const btnClearLog = container.querySelector('#btn-clear-log');

  const btnSaveResult = container.querySelector('#btn-pg-save-result');
  const recordStatus = container.querySelector('#pg-record-status');
  const recordNotes = container.querySelector('#pg-record-notes');

  const caseCard = container.querySelector('#playground-case-card');
  const btnClearCase = container.querySelector('#btn-pg-clear-case');

  function logEvent(source, eventType, detail = '') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    const entry = { time, source, eventType, detail };
    eventLog.unshift(entry);
    if (eventLog.length > 80) eventLog.pop();

    renderTimeline();
  }

  function renderTimeline() {
    eventCountBadge.textContent = `${eventLog.length} events`;
    if (eventLog.length === 0) {
      eventTimeline.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No events recorded.</div>`;
      return;
    }

    eventTimeline.innerHTML = eventLog.map(e => {
      let eventClass = 'event-input';
      if (e.eventType.startsWith('key')) eventClass = 'event-keydown';
      else if (e.eventType.startsWith('before')) eventClass = 'event-beforeinput';
      else if (['copy', 'cut', 'paste'].includes(e.eventType)) eventClass = 'event-clipboard';

      return `
        <div class="timeline-entry ${eventClass}">
          <span class="timeline-time">${escapeHTML(e.time)}</span>
          <span class="timeline-type">[${escapeHTML(e.source)}] ${escapeHTML(e.eventType)}</span>
          <span class="timeline-detail">${escapeHTML(e.detail)}</span>
        </div>
      `;
    }).join('');
  }

  function updateInputMeta(el, metaEl) {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const len = el.value.length;
    const selectedText = el.value.substring(start, end);
    const selHex = selectedText ? ` (Selected: ${selectedText})` : '';
    metaEl.textContent = `Caret: ${start} • Selection: [${start}..${end}]${selHex} • Length: ${len}`;
  }

  // Bind instrumentation events to HTML input
  ['beforeinput', 'input', 'keydown', 'keyup', 'copy', 'cut', 'paste', 'select'].forEach(evt => {
    envInput.addEventListener(evt, (e) => {
      let detail = '';
      if (evt === 'beforeinput') {
        detail = `inputType: ${e.inputType || 'unknown'}, data: ${e.data || 'none'}`;
      } else if (evt === 'input') {
        detail = `value length: ${envInput.value.length}`;
      } else if (evt.startsWith('key')) {
        detail = `key: '${e.key}', code: '${e.code}', alt: ${e.altKey}, ctrl: ${e.ctrlKey}`;
      } else if (evt === 'select') {
        detail = `range [${envInput.selectionStart}..${envInput.selectionEnd}]`;
      }
      logEvent('input', evt, detail);
      updateInputMeta(envInput, envInputMeta);
    });
  });

  // Bind instrumentation to textarea
  ['beforeinput', 'input', 'keydown', 'keyup', 'copy', 'cut', 'paste', 'select'].forEach(evt => {
    envTextarea.addEventListener(evt, (e) => {
      let detail = '';
      if (evt === 'beforeinput') {
        detail = `inputType: ${e.inputType || 'unknown'}, data: ${e.data || 'none'}`;
      } else if (evt.startsWith('key')) {
        detail = `key: '${e.key}'`;
      }
      logEvent('textarea', evt, detail);
      updateInputMeta(envTextarea, envTextareaMeta);
    });
  });

  // Bind instrumentation to contenteditable
  ['beforeinput', 'input', 'keydown', 'keyup', 'copy', 'cut', 'paste'].forEach(evt => {
    envEditable.addEventListener(evt, (e) => {
      let detail = '';
      if (evt === 'beforeinput') {
        detail = `inputType: ${e.inputType || 'unknown'}, data: ${e.data || 'none'}`;
      } else if (evt.startsWith('key')) {
        detail = `key: '${e.key}'`;
      } else if (evt === 'input') {
        detail = `innerText length: ${envEditable.innerText.length}`;
      }
      logEvent('contenteditable', evt, detail);
    });
  });

  // Track selection changes on contenteditable
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === envEditable) {
      const sel = window.getSelection();
      if (sel) {
        envEditableMeta.textContent = `Selection: Anchor offset ${sel.anchorOffset}, Focus offset ${sel.focusOffset}, Selected: '${sel.toString()}'`;
      }
    }
  });

  // Load string to all fields
  btnLoadAll.addEventListener('click', () => {
    const val = stringInput.value;
    envInput.value = val;
    envTextarea.value = val;
    envEditable.innerText = val;
    envReadonly.textContent = val;
    updateInputMeta(envInput, envInputMeta);
    updateInputMeta(envTextarea, envTextareaMeta);
    logEvent('system', 'loaded-text', `Loaded: '${val}' into all editing targets`);
    showToast('Loaded text into all editing environments', 'success');
  });

  btnResetAll.addEventListener('click', () => {
    stringInput.value = '';
    envInput.value = '';
    envTextarea.value = '';
    envEditable.innerText = '';
    envReadonly.textContent = '';
    updateInputMeta(envInput, envInputMeta);
    updateInputMeta(envTextarea, envTextareaMeta);
    logEvent('system', 'reset-all', 'Cleared all fields');
    showToast('Reset all playground fields', 'info');
  });

  btnClearLog.addEventListener('click', () => {
    eventLog.length = 0;
    renderTimeline();
    showToast('Event log cleared', 'info');
  });

  // Corpus select dropdown
  corpusSelect.addEventListener('change', (e) => {
    const id = e.target.value;
    if (!id || !corpus) return;
    const tc = corpus.find(c => c.id === id);
    if (tc) {
      activeCase = tc;
      stringInput.value = tc.testString;
      btnLoadAll.click();

      // Show case info card
      caseCard.style.display = 'block';
      container.querySelector('#pg-case-id').textContent = tc.id;
      container.querySelector('#pg-case-name').textContent = tc.name;
      container.querySelector('#pg-case-desc').textContent = tc.description;
      container.querySelector('#pg-case-expected').textContent = tc.expectedBehavior || '';
      container.querySelector('#pg-case-steps').textContent = tc.testInstructions || '';
      showToast(`Loaded test case ${tc.id}`, 'info');
    }
  });

  btnClearCase.addEventListener('click', () => {
    activeCase = null;
    caseCard.style.display = 'none';
    corpusSelect.value = '';
    showToast('Unloaded test case context', 'info');
  });

  // Save manual test result
  btnSaveResult.addEventListener('click', () => {
    const testId = activeCase ? activeCase.id : `CUSTOM-${Date.now().toString(36).toUpperCase()}`;
    const category = activeCase ? activeCase.category : 'interactive-playground';
    const testString = envInput.value || stringInput.value;
    const status = recordStatus.value;
    const notes = recordNotes.value.trim();

    const record = {
      testId,
      name: activeCase ? activeCase.name : 'Custom Playground Interaction Test',
      category,
      testString,
      expectedBehavior: activeCase ? activeCase.expectedBehavior : 'Standard DOM text editing without glitch',
      observedBehavior: notes || 'Tested interactively in playground',
      status,
      notes,
      browser: navigator.userAgent
    };

    const res = saveTestResult(record);
    if (res.success) {
      showToast(`Recorded test result for ${testId} (${status})`, 'success');
      recordNotes.value = '';
    } else {
      showToast(`Error saving result: ${res.reason}`, 'error');
    }
  });

  // Initial setup
  updateInputMeta(envInput, envInputMeta);
  updateInputMeta(envTextarea, envTextareaMeta);
}

