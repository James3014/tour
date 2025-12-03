export interface ResortSummary {
  resort_id: string;
  name: string;
  region: string;
  country_code: string;
  timezone?: string | null;
  tagline?: string | null;
}
