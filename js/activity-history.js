(function attachActivityHistory(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ActivityHistory = api;
})(typeof window !== 'undefined' ? window : null, function createActivityHistory() {
  const supplementalActivityByDay = Object.freeze({
    '2026-04-06': 2,
    '2026-04-07': 1,
    '2026-04-15': 1,
    '2026-04-16': 6,
    '2026-04-17': 3,
    '2026-04-18': 5,
    '2026-04-19': 1,
    '2026-05-03': 2,
    '2026-05-06': 2,
    '2026-05-07': 1,
    '2026-05-28': 1,
    '2026-06-09': 3,
    '2026-06-12': 7,
  });

  const supplementalContributionCount = Object.values(supplementalActivityByDay)
    .reduce((total, count) => total + count, 0);

  return { supplementalActivityByDay, supplementalContributionCount };
});
