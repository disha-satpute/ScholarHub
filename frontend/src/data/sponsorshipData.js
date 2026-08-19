// TEMPORARY frontend-only sponsorship funding data.
// The scholarships API does not yet return targetAmount/sponsoredAmount.
// Replace this file with a real backend endpoint when the Razorpay feature is wired up.
// If the API ever returns targetAmount/sponsoredAmount on a scholarship,
// getFunding() below will automatically use those instead of these mocks.

export const MOCK_FUNDING = {
  2: { targetAmount: 40000, sponsoredAmount: 18000 },
  3: { targetAmount: 60000, sponsoredAmount: 41500 },
  6: { targetAmount: 50000, sponsoredAmount: 32500 },
  7: { targetAmount: 75000, sponsoredAmount: 28500 },
  8: { targetAmount: 100000, sponsoredAmount: 61000 },
  9: { targetAmount: 90000, sponsoredAmount: 52000 },
};

export const DEFAULT_FUNDING = { targetAmount: 50000, sponsoredAmount: 15000 };

export function getFunding(scholarship) {
  if (!scholarship) return DEFAULT_FUNDING;

  if (
    scholarship.targetAmount != null &&
    scholarship.sponsoredAmount != null
  ) {
    return {
      targetAmount: Number(scholarship.targetAmount),
      sponsoredAmount: Number(scholarship.sponsoredAmount),
    };
  }

  return MOCK_FUNDING[scholarship.id] || DEFAULT_FUNDING;
}

// Featured scholarships shown in the "Sponsor a Scholarship" home section.
// ids/titles/descriptions come from the real scholarships API.
export const SPONSOR_SCHOLARSHIPS = [
  {
    id: 6,
    title: "Tata Capital Pankh Scholarship",
    description:
      "Help support deserving students pursuing undergraduate studies.",
    targetAmount: 50000,
    sponsoredAmount: 32500,
  },
  {
    id: 7,
    title: "HDFC Bank Parivartan Scholarship",
    description:
      "Scholarship for deserving students facing financial difficulties.",
    targetAmount: 75000,
    sponsoredAmount: 28500,
  },
  {
    id: 8,
    title: "Reliance Foundation Scholarship",
    description: "Supports meritorious undergraduate students across India.",
    targetAmount: 100000,
    sponsoredAmount: 61000,
  },
  {
    id: 3,
    title: "Post Matric Scholarship",
    description:
      "Financial assistance for SC, ST and OBC students pursuing higher education.",
    targetAmount: 60000,
    sponsoredAmount: 41500,
  },
];
