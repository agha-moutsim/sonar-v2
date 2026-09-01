export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Security", href: "#security" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
] as const;

export type ProblemCardData = {
  id: string;
  title: string;
  visual: "stack" | "gear" | "tiles" | "dashboard";
};

export const problemCards: ProblemCardData[] = [
  {
    id: "visibility",
    title: "No clear view of what's running/stuck",
    visual: "stack",
  },
  {
    id: "automation",
    title: "Automations break silently",
    visual: "gear",
  },
  {
    id: "fragmentation",
    title: "Tasks live across multiple apps",
    visual: "tiles",
  },
  {
    id: "overwhelm",
    title: "Dashboards feel overwhelming",
    visual: "dashboard",
  },
];

export type FeatureHighlightData = {
  id: string;
  title: string;
  subtitle: string;
  icon: "clock" | "target" | "shield" | "heart";
};

export const featureHighlights: FeatureHighlightData[] = [
  {
    id: "time",
    title: "Save 10+ Hours",
    subtitle: "Every Week",
    icon: "clock",
  },
  {
    id: "focus",
    title: "Focus on What",
    subtitle: "Actually Matters",
    icon: "target",
  },
  {
    id: "security",
    title: "Built for Security",
    subtitle: "and Scale",
    icon: "shield",
  },
  {
    id: "loved",
    title: "Loved by Modern",
    subtitle: "Teams",
    icon: "heart",
  },
];

// Icons used across the workflow platform's app tray, in tray order (left to right, row by row).
export const workflowApps = [
  "paper-plane",
  "grid",
  "cube",
  "layers",
  "dots",
  "flag",
  "letter",
  "bird",
] as const;
