export const PLACEMENTS = [
  "content-bottom",
  "article-middle",
  "sidebar",
  "landing-secondary",
  "footer-above-author",
] as const;
export type Placement = (typeof PLACEMENTS)[number];
export const SIZES = [
  "320x50",
  "468x60",
  "728x90",
  "320x100",
  "300x250",
] as const;
export type Size = (typeof SIZES)[number];
export type Mode = "mixed" | "house-only" | "google-only" | "off";
export type Rotation = "equal" | "weighted";
export interface Variant {
  src: string;
  width: number;
  height: number;
}
export interface CommonAd {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  weight: number;
  start: string;
  end: string;
  minScreen: number;
  maxScreen: number;
}
export interface Campaign extends CommonAd {
  category: string;
  sites: string[];
  placements: Placement[];
  variants: Variant[];
  alt: string;
  destination: string;
  disclosure: "Advertisement" | "Paid advertisement" | "House advertisement";
}
export interface GoogleUnit extends CommonAd {
  placement: Placement;
  slot: string;
  size: Size;
  format: "fixed" | "responsive-horizontal";
}
export interface Site {
  id: string;
  domain: string;
  pathPrefixes: string[];
  audience: "general" | "child-directed";
  enabled: boolean;
  houseAdsApproved: boolean;
  googleEnabled: boolean;
  googleApproved: boolean;
  mode: Mode;
  maxAdsPerPage: number;
  categories: string[];
  allowedSizes: Size[];
  exclusions: string[];
  longContentPaths: string[];
  placements: Partial<Record<Placement, { enabled: boolean; sizes: Size[] }>>;
  googleUnits: GoogleUnit[];
}
export interface Config {
  schemaVersion: 1;
  revision: string;
  global: {
    enabled: boolean;
    killSwitch: boolean;
    houseEnabled: boolean;
    googleEnabled: boolean;
    mode: Mode;
    rotation: Rotation;
    maxAdsPerPage: number;
    cacheSeconds: number;
    allowedSizes: Size[];
    imageOrigins: string[];
    destinationOrigins: string[];
    categories: string[];
    fallback: "house" | "empty";
    google: {
      publisherId: string | null;
      autoAdsDisabledConfirmed: boolean;
      certifiedCmpIds: number[];
    };
  };
  sites: Site[];
  campaigns: Campaign[];
}
export interface Context {
  hostname: string;
  path: string;
  placement: Placement;
  width: number;
  screenWidth: number;
  now: number;
  googleConsent: boolean;
  words: number;
}
export interface Candidate {
  id: string;
  kind: "house" | "google";
  weight: number;
  width: number;
  height: number;
  campaign?: Campaign;
  variant?: Variant;
  unit?: GoogleUnit;
}
