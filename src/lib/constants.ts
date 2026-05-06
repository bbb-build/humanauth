export const PLANS = {
  free: {
    name: "Free",
    mauLimit: 1000,
    price: 0,
  },
  pro: {
    name: "Pro",
    mauLimit: 10000,
    price: 49,
  },
  business: {
    name: "Business",
    mauLimit: 100000,
    price: 199,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const VERIFICATION_LEVELS = ["orb", "device", "phone"] as const;
export type VerificationLevel = (typeof VERIFICATION_LEVELS)[number];
