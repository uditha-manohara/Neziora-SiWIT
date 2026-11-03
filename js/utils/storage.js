/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: Storage Utilities (js/utils/storage.js)
 * Privacy-first local storage manager with full user disclosure,
 * export/import capabilities, and zero external transmission.
 */

const STORAGE_KEY = 'siwit_test_records_v1';
const SETTINGS_KEY = 'siwit_app_settings_v1';

/**
 * Check if LocalStorage is available and writable
 */
export function isStorageAvailable() {
  try {
    const testKey = '__siwit_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all stored test results
 */
export function getStoredResults() {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse stored results:', err);
    return [];
  }
}

/**
 * Save a new test result
 */
export function saveTestResult(record) {
  if (!isStorageAvailable()) {
    return { success: false, reason: 'LocalStorage is disabled or unavailable in this environment.' };
  }

  try {
    const existing = getStoredResults();
    // Add unique record id if missing
    const enriched = {
      id: record.id || `REC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: record.timestamp || new Date().toISOString(),
      ...record
    };

    // Prepend latest test
    const updated = [enriched, ...existing];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, record: enriched, count: updated.length };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Remove a specific test result by ID
 */
export function deleteTestResult(recordId) {
  if (!isStorageAvailable()) return false;
  try {
    const existing = getStoredResults();
    const filtered = existing.filter(r => r.id !== recordId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all stored test results
 */
export function clearAllResults() {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate approximate storage size used by SiWIT in bytes
 */
export function getStorageUsageBytes() {
  if (!isStorageAvailable()) return 0;
  try {
    const results = window.localStorage.getItem(STORAGE_KEY) || '';
    const settings = window.localStorage.getItem(SETTINGS_KEY) || '';
    return (results.length + settings.length) * 2; // UTF-16 in JS string storage approx
  } catch {
    return 0;
  }
}

/**
 * Save application settings (e.g. theme preference)
 */
export function saveSettings(settings) {
  if (!isStorageAvailable()) return;
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

/**
 * Load application settings
 */
export function getSettings() {
  if (!isStorageAvailable()) return { theme: 'dark' };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { theme: 'dark' };
  } catch {
    return { theme: 'dark' };
  }
}

