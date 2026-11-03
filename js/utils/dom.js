/**
 * SiWIT — Sinhala Web Interoperability Test Kit
 * Created & Led by: Uditha Manohara Prasad
 * Published under the Neziora brand
 * 
 * Module: DOM Utilities (js/utils/dom.js)
 * Safe DOM manipulation, XSS escaping, toast alerts, and modal dialogs.
 */

/**
 * Escape HTML characters to prevent XSS injection
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Display a non-intrusive toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('siwit-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'siwit-toast-container';
    container.className = 'siwit-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `siwit-toast siwit-toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/**
 * Copy text to clipboard with modern API and textarea fallback
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      // Fallback
    }
  }

  // Fallback for non-secure contexts or legacy browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      return { success: true };
    }
    return { success: false, reason: 'execCommand copy failed' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Trigger download of text or JSON file in client browser
 */
export function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 150);
}

