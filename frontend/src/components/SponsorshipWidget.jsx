import React, { useState } from "react";
import SponsorshipConfirmationModal from "./SponsorshipConfirmationModal";
import { getFunding } from "../data/sponsorshipData";
import "../styles/SponsorshipWidget.css";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];
const PRESET_LABELS = { 500: "₹500", 1000: "₹1K", 2500: "₹2.5K", 5000: "₹5K" };

const SponsorshipWidget = ({ scholarship }) => {
  const funding = getFunding(scholarship);
  const targetAmount = funding.targetAmount;
  const sponsoredAmount = funding.sponsoredAmount;
  const progress = Math.min(100, Math.round((sponsoredAmount / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - sponsoredAmount);

  const [preset, setPreset] = useState(1000);
  const [custom, setCustom] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedAmount =
    preset !== null ? preset : custom ? parseInt(custom, 10) : null;
  const amountValid =
    selectedAmount !== null && Number.isFinite(selectedAmount) && selectedAmount >= 1;
  const displayAmount = amountValid ? selectedAmount : 0;

  const handlePresetClick = (amount) => {
    setPreset(amount);
    setCustom("");
  };

  const handleCustomChange = (e) => {
    setCustom(e.target.value.replace(/[^0-9]/g, ""));
    setPreset(null);
  };

  const handleSponsorClick = () => {
    if (!amountValid) return;
    setConfirmation({ amount: selectedAmount });
  };

  const handleContinue = () => {
    if (!confirmation) return;
    setNotice(
      `Sponsorship amount selected: ₹${confirmation.amount.toLocaleString(
        "en-IN"
      )}. Secure payment powered by Razorpay is coming soon.`
    );
    setConfirmation(null);
  };

  const formatINR = (value) => value.toLocaleString("en-IN");

  return (
    <aside className="sponsorship-widget">
      <p className="sponsorship-widget-eyebrow">Support a Student</p>
      <h3 className="sponsorship-widget-title">Sponsor This Scholarship</h3>
      <p className="sponsorship-widget-desc">
        Your contribution can help a deserving student achieve their educational goals.
      </p>

      <div className="sponsorship-funding">
        <div className="sponsorship-funding-row">
          <span>Sponsored</span>
          <strong>₹{formatINR(sponsoredAmount)}</strong>
        </div>
        <div className="sponsorship-funding-row">
          <span>Target</span>
          <strong>₹{formatINR(targetAmount)}</strong>
        </div>
      </div>

      <div
        className="sponsorship-progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${progress}% funded`}
      >
        <div className="sponsorship-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="sponsorship-progress-label">
        <strong>{progress}% funded</strong>
        <span>₹{formatINR(remaining)} remaining</span>
      </p>

      <div className="sponsorship-amounts">
        <span className="sponsorship-field-label">Choose amount</span>
        <div className="preset-amount-grid">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`preset-amount-btn ${preset === amount ? "selected" : ""}`}
              aria-pressed={preset === amount}
              onClick={() => handlePresetClick(amount)}
            >
              {PRESET_LABELS[amount]}
              {preset === amount && (
                <span className="preset-check" aria-hidden="true"> ✓</span>
              )}
            </button>
          ))}
        </div>

        <label className="sponsorship-field-label" htmlFor="custom-sponsor-amount">
          Or enter custom amount
        </label>
        <div className="custom-amount-wrap">
          <span className="custom-amount-prefix" aria-hidden="true">₹</span>
          <input
            id="custom-sponsor-amount"
            className="custom-amount-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter amount"
            value={custom}
            onChange={handleCustomChange}
          />
        </div>
      </div>

      <div className="sponsorship-total">
        <span>Your contribution</span>
        <strong>₹{formatINR(displayAmount)}</strong>
      </div>

      <button
        type="button"
        className="sponsor-submit-btn"
        disabled={!amountValid}
        onClick={handleSponsorClick}
      >
        💙 Sponsor This Scholarship
      </button>
      <p className="sponsorship-payment-note">Secure payment powered by Razorpay</p>

      {notice && <p className="sponsorship-notice" role="status">{notice}</p>}

      <SponsorshipConfirmationModal
        open={confirmation !== null}
        amount={confirmation ? confirmation.amount : 0}
        onContinue={handleContinue}
        onCancel={() => setConfirmation(null)}
      />
    </aside>
  );
};

export default SponsorshipWidget;