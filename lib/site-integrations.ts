// Public identifiers only. Never place OAuth tokens or API secrets here.
export const siteOrigin = 'https://water-beetle.github.io';
export const googleAnalyticsMeasurementId: string = 'G-8GS6YW56MH';
export const googleAnalyticsDashboard = 'https://analytics.google.com/analytics/web/#/a407183041p553076368/reports/intelligenthome';
export const giscusConfig = {
  repo: 'water-beetle/water-beetle.github.io' as const,
  repoId: 'R_kgDOUQPU3g',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUQPU3s4DFJr9',
};
export function isGoogleAnalyticsConfigured() {
  return /^G-[A-Z0-9]+$/.test(googleAnalyticsMeasurementId);
}
