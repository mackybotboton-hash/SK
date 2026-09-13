/**
 * SKTrack — Formatters
 * Pure utility functions for formatting display values.
 */

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { APP_CONFIG } from './constants';

// ─── Currency ─────────────────────────────────────────────

/**
 * Format a number as Philippine Peso currency.
 * @param {number} amount
 * @param {boolean} showSymbol - Whether to prepend ₱
 * @returns {string}
 */
export function formatCurrency(amount, showSymbol = true) {
  if (amount == null || isNaN(amount)) return showSymbol ? '₱0.00' : '0.00';
  const formatted = Number(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `${APP_CONFIG.CURRENCY}${formatted}` : formatted;
}

/**
 * Format a number as a compact currency (e.g., ₱100K, ₱1.5M).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyCompact(amount) {
  if (amount == null || isNaN(amount)) return '₱0';
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount);
}

// ─── Dates ────────────────────────────────────────────────

/**
 * Format a date string or Date object.
 * @param {string|Date} date
 * @param {string} fmt - date-fns format string
 * @returns {string}
 */
export function formatDate(date, fmt = APP_CONFIG.DATE_FORMAT) {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, fmt) : '—';
}

/**
 * Format a date with time.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return formatDate(date, APP_CONFIG.DATETIME_FORMAT);
}

/**
 * Format a time string.
 * @param {string} time - HH:mm or HH:mm:ss
 * @returns {string}
 */
export function formatTime(time) {
  if (!time) return '—';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${suffix}`;
}

/**
 * Get relative time (e.g., "2 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? formatDistanceToNow(parsed, { addSuffix: true }) : '—';
}

// ─── Numbers ──────────────────────────────────────────────

/**
 * Format a number with commas.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-PH');
}

/**
 * Format a percentage.
 * @param {number} value - 0 to 1
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  if (value == null || isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

// ─── File Sizes ───────────────────────────────────────────

/**
 * Format bytes to a human-readable file size.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// ─── Text ─────────────────────────────────────────────────

/**
 * Truncate text to a max length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}…` : text;
}

/**
 * Get initials from a full name.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Capitalize first letter.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
