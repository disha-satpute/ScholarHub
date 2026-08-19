import React, { useEffect, useRef, useState } from "react";
import { getFunding } from "../data/sponsorshipData";
import "../styles/SponsorshipPaymentModal.css";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const SponsorshipPaymentModal = ({ scholarship, onClose }) => {
  const funding = getFunding(scholarship);
  const targetAmount = funding.targetAmount;
  const sponsoredAmount = funding.sponsoredAmount;
  const progress = Math.min(100, Math.round((sponsoredAmount / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - sponsoredAmount);

  const [preset, setPreset] = useState(1000);
  const [custom, setCustom] = useState("");
  const [paid, setPaid] = useState(false);

  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const selectedAmount =
    preset !== null ? preset : custom ? parseInt(custom, 10) : null;
  const amountValid =
    selectedAmount !== null && Number.isFinite(selectedAmount) && selectedAmount >= 1;
  const displayAmount = amountValid ? selectedAmount : 0;

  useEffect(() => {
    if (!scholarship) return undefined;

    setPreset(1000);
    setCustom("");
    setPaid(false);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKey);

    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [scholarship]);

  if (!scholarship) return null;

  const handlePresetClick = (amount) => {
    setPreset(amount);
    setCustom("");
  };

  const handleCustomChange = (e) => {
    setCustom(e.target.value.replace(/[^0-9]/g, ""));
    setPreset(null);
  };

  const handlePay = () => {
    if (!amountValid) return;
    setPaid(true);
  };

  const formatINR = (value) => value.toLocaleString("en-IN");

  return (
    <div className="sponsor-payment-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="sponsor-payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sponsor-payment-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="sponsor-payment-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {!paid ? (
          <>
            <p className="sponsor-payment-eyebrow">💙 Sponsor a Scholarship</p>
            <h3 id="sponsor-payment-title" className="sponsor-payment-title">
              {scholarship.title}
            </h3>
            <p className="sponsor-payment-desc">{scholarship.description}</p>

            <div className="sponsor-payment-funding">
              <div className="funding-row">
                <span>Sponsored</span>
                <strong>₹{formatINR(sponsoredAmount)}</strong>
              </div>
              <div className="funding-row">
                <span>Target</span>
                <strong>₹{formatINR(targetAmount)}</strong>
              </div>
            </div>

            <div
              className="payment-progress"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${progress}% funded`}
            >
              <div className="payment-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="payment-progress-label">
              <strong>{progress}% funded</strong>
              <span>₹{formatINR(remaining)} remaining</span>
            </p>

            <div className="amount-section">
              <span className="field-label">Choose contribution</span>
              <div className="preset-grid">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`preset-btn ${preset === amount ? "selected" : ""}`}
                    aria-pressed={preset === amount}
                    onClick={() => handlePresetClick(amount)}
                  >
                    ₹{formatINR(amount)}
                    {preset === amount && (
                      <span className="preset-check" aria-hidden="true"> ✓</span>
                    )}
                  </button>
                ))}
              </div>

              <label className="field-label" htmlFor="custom-payment-amount">
                Or enter custom amount
              </label>
              <div className="custom-wrap">
                <span className="custom-prefix" aria-hidden="true">₹</span>
                <input
                  id="custom-payment-amount"
                  className="custom-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter amount"
                  value={custom}
                  onChange={handleCustomChange}
                />
              </div>
            </div>

            <div className="total-row">
              <span>Your contribution</span>
              <strong>₹{formatINR(displayAmount)}</strong>
            </div>

            <button
              type="button"
              className="pay-btn"
              disabled={!amountValid}
              onClick={handlePay}
            >
              Pay ₹{formatINR(displayAmount)}
            </button>
            <p className="secure-note">🔒 Secure payment powered by Razorpay</p>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </>
        ) : (
          <div className="payment-pending">
            <p className="payment-pending-amount">₹{formatINR(displayAmount)}</p>
            <p>Payment integration will be available soon.</p>
            <button type="button" className="pay-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorshipPaymentModal;