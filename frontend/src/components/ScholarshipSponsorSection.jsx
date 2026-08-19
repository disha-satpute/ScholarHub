import React, { useState } from "react";
import SponsorScholarshipCard from "./SponsorScholarshipCard";
import SponsorshipPaymentModal from "./SponsorshipPaymentModal";
import { SPONSOR_SCHOLARSHIPS } from "../data/sponsorshipData";
import "../styles/ScholarshipSponsorSection.css";

const ScholarshipSponsorSection = () => {
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  return (
    <section className="sponsor-section fade-in">
      <div className="sponsor-section-header">
        <span className="sponsor-section-eyebrow">💙 Sponsor a Scholarship</span>
        <h2 className="sponsor-section-title">Support a Student's Dream</h2>
        <p className="sponsor-section-desc">
          Help deserving students achieve their educational goals by contributing to
          scholarships that need support.
        </p>
      </div>

      <div className="sponsor-section-grid">
        {SPONSOR_SCHOLARSHIPS.map((scholarship) => (
          <SponsorScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onSponsor={() => setSelectedScholarship(scholarship)}
          />
        ))}
      </div>

      <SponsorshipPaymentModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
      />
    </section>
  );
};

export default ScholarshipSponsorSection;