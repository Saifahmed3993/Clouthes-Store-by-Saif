export type AnalyticsPoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type AdminMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
};
