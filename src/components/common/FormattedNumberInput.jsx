import React, { useRef } from 'react';

/**
 * Utility to format numbers with commas for display (e.g. 2432423 -> 2,432,423).
 * Handles floating points as well (e.g. 2432423.50 -> 2,432,423.50).
 */
export function formatValueWithCommas(val) {
  if (val === null || val === undefined || val === '') return '';
  const str = String(val).replace(/,/g, '');
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Remove commas to get raw numeric string for state / backend storage.
 */
export function parseRawValue(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/,/g, '');
}

export default function FormattedNumberInput({
  value,
  onChange,
  className = 'form-control',
  placeholder = '0.00',
  name,
  disabled = false,
  required = false,
  style = {},
  ...props
}) {
  const inputRef = useRef(null);

  const displayValue = formatValueWithCommas(value);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const rawVal = parseRawValue(inputValue);

    // Allow digits and at most one decimal point
    if (/^\d*\.?\d*$/.test(rawVal)) {
      const cursorStart = e.target.selectionStart;
      const commasBefore = (inputValue.slice(0, cursorStart).match(/,/g) || []).length;

      // Pass synthetic event or raw string depending on onChange usage
      if (name) {
        onChange({
          target: {
            name,
            value: rawVal
          }
        });
      } else {
        onChange(rawVal);
      }

      // Restore intelligent cursor position after React re-renders
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newFormatted = formatValueWithCommas(rawVal);
          const commasAfter = (newFormatted.slice(0, cursorStart).match(/,/g) || []).length;
          const diff = commasAfter - commasBefore;
          const newPos = Math.max(0, cursorStart + diff);
          try {
            inputRef.current.setSelectionRange(newPos, newPos);
          } catch (err) {
            // Ignore selection range errors for unsupported input types
          }
        }
      });
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      name={name}
      className={className}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      style={style}
      {...props}
    />
  );
}
