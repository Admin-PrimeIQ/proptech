export type PlanFeature = {
  label: string;
  included: boolean;
};

export type PlanOption = {
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  description: string;
  ctaLabel: string;
  highlighted?: boolean;
  current?: boolean;
  features: string[];
};

export type EnterprisePlanUpgradeData = {
  pageTitle: string;
  pageDescription: string;
  activePlanLabel: string;
  activePlanName: string;
  activePlanDescription: string;
  activePlanFeatures: PlanFeature[];
  nextBillingDate: string;
  planOptions: PlanOption[];
  customSolutionTitle: string;
  customSolutionDescription: string;
};
