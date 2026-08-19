import React, { useEffect } from "react";
import "../styles/SponsorshipConfirmationModal.css";

const SponsorshipConfirmationModal = ({ open, amount, onContinue, onCancel }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="sponsor-modal-overlay" onClick={onCancel}>
      <div
        className="sponsor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sponsor-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="sponsor-modal-title">
          Ready to sponsor ₹{amount.toLocaleString("en-IN")}?
        </h3>
        <p>Payment integration will be available soon.</p>
        <div className="sponsor-modal-actions">
          <button type="button" className="sponsor-modal-cancel" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="sponsor-modal-continue" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipConfirmationModal;