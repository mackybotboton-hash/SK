import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

/**
 * Modal — Reusable modal/dialog component.
 * Uses CSS classes from components.css for styling and responsiveness.
 * On mobile (≤768px) it becomes a bottom sheet automatically via CSS.
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <MdClose size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
