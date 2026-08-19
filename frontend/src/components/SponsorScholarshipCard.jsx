import React from "react";
import "../styles/SponsorScholarshipCard.css";

const SponsorScholarshipCard = ({ scholarship, onSponsor }) => {
  const { title, description, targetAmount, sponsoredAmount } = scholarship;
  const progress = Math.min(100, Math.round((sponsoredAmount / targetAmount) * 100));
  const formatINR = (value) => value.toLocaleString("en-IN");

  return (
    <article className="sponsor-card">
      <h3>{title}</h3>
      <p className="sponsor-card-desc">{description}</p>

      <div className="sponsor-card-funding">
        <span>
          Sponsored
          <strong>₹{formatINR(sponsoredAmount)}</strong>
        </span>
        <span>
          Target
          <strong>₹{formatINR(targetAmount)}</strong>
        </span>
      </div>

      <div
        className="sponsor-progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${progress}% funded`}
      >
        <div className="sponsor-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="sponsor-card-progress-label">{progress}% funded</p>

      <button type="button" className="sponsor-now-btn" onClick={onSponsor}>
        Sponsor Now
      </button>
    </article>
  );
};

export default SponsorScholarshipCard;