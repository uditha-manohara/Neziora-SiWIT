/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Main Application Orchestrator (js/app.js)
 */

import { renderDashboard } from './modules/dashboard.js';
import { renderUnicodeInspector } from './modules/unicode-inspector.js';
import { renderCorpus } from './modules/corpus.js';
import { renderInteractionPlayground } from './modules/interaction-tests.js';
import { renderNormalization } from './modules/normalization.js';
import { renderLengthTests } from './modules/length-tests.js';
import { renderClipboardTests } from './modules/clipboard-tests.js';
import { renderBrowserInfo } from './modules/browser-info.js';
import { renderReports } from './modules/reports.js';
import { getSettings, saveSettings } from './utils/storage.js';
import { showToast } from './utils/dom.js';

class SiWITApp {
  constructor() {
    this.corpus = [];
    this.currentRoute = 'dashboard';
    this.theme = 'dark';
    this.pendingInspectorText = null;
    this.pendingPlaygroundText = null;
    this.pendingPlaygroundCase = null;
  }

  async init() {
    // 1. Initialize Theme
    const settings = getSettings();
    this.theme = settings.theme || 'dark';
    this.applyTheme(this.theme);

    // 2. Fetch Sinhala Test Corpus
    try {
      const resp = await fetch('data/sinhala-test-cases.json');
      if (resp.ok) {
        this.corpus = await resp.json();
      } else {
        console.warn('Failed to fetch corpus via relative URL, using bundled fallback');
        this.corpus = [];
      }
    } catch (err) {
      console.warn('Corpus fetch error (likely file:// protocol):', err);
      this.corpus = [];
    }

    // 3. Setup Navigation & Routing
    this.setupEventListeners();
    this.handleRoute();

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    saveSettings({ theme });

    // Update logo mark image according to brand rules
    const logoImg = document.getElementById('app-brand-logo');
    if (logoImg) {
      logoImg.src = theme === 'light' 
        ? 'assets/logos/neziora-mark-light-500x500.png'
        : 'assets/logos/neziora-mark-dark-500x500.png';
    }

    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
  }

  toggleTheme() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    showToast(`Switched to ${next.toUpperCase()} theme`, 'info', 2000);
  }

  setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Sidebar navigation links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = link.getAttribute('data-target');
        if (target) {
          e.preventDefault();
          window.location.hash = target;
        }
      });
    });

    // Mobile nav hamburger toggle
    const hamburgerBtn = document.getElementById('btn-mobile-nav');
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (hamburgerBtn && sidebarNav) {
      hamburgerBtn.addEventListener('click', () => {
        sidebarNav.classList.toggle('mobile-expanded');
      });
    }
  }

  navigate(route) {
    window.location.hash = route;
  }

  handleRoute() {
    const rawHash = window.location.hash.replace(/^#/, '');
    const route = rawHash || 'dashboard';
    this.currentRoute = route;

    // Update active nav link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      if (link.getAttribute('data-target') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Collapse mobile nav if open
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) sidebarNav.classList.remove('mobile-expanded');

    // Title update
    const titleMap = {
      dashboard: 'Dashboard',
      inspector: 'Sinhala Unicode Inspector',
      corpus: 'Sinhala Test Corpus',
      playground: 'Text Interaction Playground',
      normalization: 'Unicode Normalization Testing',
      length: 'Text Length & Input Limits',
      clipboard: 'Copy & Paste Testing',
      browser: 'Browser Environment Information',
      reports: 'Test Results & Reports',
      docs: 'Documentation & Architecture'
    };

    const topbarTitle = document.getElementById('current-module-title');
    if (topbarTitle) {
      topbarTitle.textContent = titleMap[route] || 'SiWIT Toolkit';
    }

    // Render target view
    const mainContainer = document.getElementById('main-viewport');
    if (!mainContainer) return;

    window.scrollTo(0, 0);

    switch (route) {
      case 'dashboard':
        renderDashboard(mainContainer, this.corpus, (target) => this.navigate(target));
        break;

      case 'inspector':
        renderUnicodeInspector(mainContainer, this.pendingInspectorText || 'ශ්‍රී ලංකා');
        this.pendingInspectorText = null;
        break;

      case 'corpus':
        renderCorpus(mainContainer, this.corpus, (target) => this.navigate(target), (action, text, testCase) => {
          if (action === 'inspector') {
            this.pendingInspectorText = text;
            this.navigate('inspector');
          } else if (action === 'playground') {
            this.pendingPlaygroundText = text;
            this.pendingPlaygroundCase = testCase;
            this.navigate('playground');
          }
        });
        break;

      case 'playground':
        renderInteractionPlayground(
          mainContainer,
          this.corpus,
          this.pendingPlaygroundText || 'ශ්‍රී ලංකා',
          this.pendingPlaygroundCase || null
        );
        this.pendingPlaygroundText = null;
        this.pendingPlaygroundCase = null;
        break;

      case 'normalization':
        renderNormalization(mainContainer);
        break;

      case 'length':
        renderLengthTests(mainContainer);
        break;

      case 'clipboard':
        renderClipboardTests(mainContainer);
        break;

      case 'browser':
        renderBrowserInfo(mainContainer);
        break;

      case 'reports':
        renderReports(mainContainer);
        break;

      case 'docs':
        this.renderDocsView(mainContainer);
        break;

      default:
        renderDashboard(mainContainer, this.corpus, (target) => this.navigate(target));
        break;
    }
  }

  renderDocsView(container) {
    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div class="brand-label" style="color: var(--accent); margin-bottom: 4px;">Documentation & Standards Reference</div>
        <h1>SiWIT Architecture & Technical Reference</h1>
        <p style="color: var(--text-secondary); max-width: 840px; font-size: 0.9375rem;">
          Background on Sinhala Unicode script architecture, combining rules, Zero-Width Joiner (ZWJ) semantics, and standards compliance.
        </p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Creator & Brand Attribution</span>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p><strong>Creator & Project Lead:</strong> Uditha Manohara Prasad</p>
            <p><strong>Published under:</strong> Neziora</p>
            <p><strong>Attribution Notice:</strong> SiWIT (Sinhala Web Interoperability Test Kit) was conceptualized, architected, and engineered by Uditha Manohara Prasad, published under the Neziora brand.</p>
            <p class="caption">Copyright &copy; 2026 Uditha Manohara Prasad. Licensed under the MIT License.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Key Sinhala Unicode Mechanics</span>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.9375rem;">
            <div>
              <strong style="color: var(--text-primary);">1. Consonants with Virama (Hal-kirima)</strong>
              <p class="caption" style="margin-top: 2px;">
                A base consonant (e.g. <code>ක</code> <code>U+0D9A</code>) followed by Al-lakuna (<code>U+0DCA</code>) suppresses the inherent vowel /a/ to yield a pure consonant (<code>ක්</code>).
              </p>
            </div>
            <div>
              <strong style="color: var(--text-primary);">2. Yansaya Ligatures (Medial Ya)</strong>
              <p class="caption" style="margin-top: 2px;">
                Formed via the strict sequence: <code>Consonant + Virama (U+0DCA) + ZWJ (U+200D) + Ya (U+0DBA)</code>. Example: <code>ක + ් + [ZWJ] + ය = ක්‍ය</code>.
              </p>
            </div>
            <div>
              <strong style="color: var(--text-primary);">3. Rakaransaya Ligatures (Medial Ra)</strong>
              <p class="caption" style="margin-top: 2px;">
                Formed via the sequence: <code>Consonant + Virama (U+0DCA) + ZWJ (U+200D) + Ra (U+0DBB)</code>. Example: <code>ක + ් + [ZWJ] + ර = ක්‍ර</code>.
              </p>
            </div>
            <div>
              <strong style="color: var(--text-primary);">4. Repaya Ligatures (Initial Ra / Reph)</strong>
              <p class="caption" style="margin-top: 2px;">
                Formed via the sequence: <code>Ra (U+0DBB) + Virama (U+0DCA) + ZWJ (U+200D) + Consonant</code>. Example: <code>ර්‍ය</code>.
              </p>
            </div>
            <div>
              <strong style="color: var(--text-primary);">5. Bandiyakuru (Conjuncts)</strong>
              <p class="caption" style="margin-top: 2px;">
                Formed when two consonants fuse or touch: <code>Consonant + Virama (U+0DCA) + ZWJ (U+200D) + Consonant</code>. Example: <code>ක් + [ZWJ] + ෂ = ක්ෂ</code>; <code>ණ් + [ZWJ] + ඩ = ණ්ඩ</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Standards & References</span>
        </div>
        <div class="card-body">
          <ul style="list-style: square; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
            <li><strong>Unicode Standard (Chapter 13 South and Central Asian Scripts - I):</strong> Official Sinhala code chart (U+0D80–U+0DFF).</li>
            <li><strong>Unicode Standard Annex #15 (UAX #15):</strong> Unicode Normalization Forms (NFC, NFD, NFKC, NFKD).</li>
            <li><strong>Unicode Standard Annex #29 (UAX #29):</strong> Unicode Text Segmentation & Grapheme Cluster Boundaries.</li>
            <li><strong>SLS 1134 (Sri Lanka Standard):</strong> Sinhala Character Code for Information Interchange.</li>
            <li><strong>W3C Internationalization (i18n):</strong> Sinhala Script Resources and Requirements.</li>
          </ul>
        </div>
      </div>
    `;
  }
}

// Instantiate and start on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const app = new SiWITApp();
  app.init();
});

