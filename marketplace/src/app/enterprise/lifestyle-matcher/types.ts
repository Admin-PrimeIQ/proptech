export type PriorityItem = {
  id: string;
  name: string;
  subtitle: string;
  active?: boolean;
};

export type LifestyleMatcherData = {
  title: string;
  subtitle: string;
  stepLabel: string;
  progressPercent: number;
  etaOptions: string[];
  selectedEta: string;
  averageSpeed: number;
  trafficEnabled: boolean;
  priorities: PriorityItem[];
};
