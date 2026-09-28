(function attachActivityCalendar(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ActivityCalendar = api;
})(typeof window !== 'undefined' ? window : null, function createActivityCalendar() {
  const WEEK_COUNT = 53;
  const DAYS_PER_WEEK = 7;
  const DAY_COUNT = WEEK_COUNT * DAYS_PER_WEEK;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dateKey = (date) => date.toISOString().slice(0, 10);

  const activityLevel = (count) => {
    if (count >= 8) return 4;
    if (count >= 4) return 3;
    if (count >= 2) return 2;
    if (count >= 1) return 1;
    return 0;
  };

  const buildActivityCalendar = (commits, requestedEndDate = new Date(), supplementalActivityByDay = {}) => {
    const endDate = new Date(requestedEndDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const rangeStart = new Date(endDate);
    rangeStart.setUTCDate(endDate.getUTCDate() - 364);
    rangeStart.setUTCHours(0, 0, 0, 0);

    const gridStart = new Date(rangeStart);
    gridStart.setUTCDate(rangeStart.getUTCDate() - rangeStart.getUTCDay());

    const commitsByDay = commits.reduce((counts, commit) => {
      const timestamp = commit?.commit?.author?.date || commit?.commit?.committer?.date;
      if (!timestamp) return counts;

      const commitDate = new Date(timestamp);
      if (commitDate < rangeStart || commitDate > endDate) return counts;

      const key = dateKey(commitDate);
      counts.set(key, (counts.get(key) || 0) + 1);
      return counts;
    }, new Map());

    Object.entries(supplementalActivityByDay || {}).forEach(([key, rawCount]) => {
      const count = Number(rawCount);
      const activityDate = new Date(`${key}T00:00:00Z`);

      if (!Number.isFinite(count) || count <= 0 || Number.isNaN(activityDate.getTime())) return;
      if (activityDate < rangeStart || activityDate > endDate) return;

      commitsByDay.set(key, (commitsByDay.get(key) || 0) + Math.floor(count));
    });

    let totalCommits = 0;
    const cells = Array.from({ length: DAY_COUNT }, (_, index) => {
      const date = new Date(gridStart);
      date.setUTCDate(gridStart.getUTCDate() + index);
      const isBeforeRange = date < rangeStart;
      const isFuture = date > endDate;
      const count = isBeforeRange || isFuture ? 0 : (commitsByDay.get(dateKey(date)) || 0);
      totalCommits += count;

      return {
        date: dateKey(date),
        count,
        level: activityLevel(count),
        weekIndex: Math.floor(index / DAYS_PER_WEEK),
        dayIndex: index % DAYS_PER_WEEK,
        isFuture,
        isOutsideRange: isBeforeRange || isFuture,
      };
    });

    const months = [];
    let previousMonth = gridStart.getUTCMonth();

    for (let weekIndex = 1; weekIndex < WEEK_COUNT; weekIndex += 1) {
      const weekStart = new Date(gridStart);
      weekStart.setUTCDate(gridStart.getUTCDate() + (weekIndex * DAYS_PER_WEEK));
      const month = weekStart.getUTCMonth();

      if (month !== previousMonth) {
        months.push({ label: MONTHS[month], weekIndex });
        previousMonth = month;
      }
    }

    return {
      cells,
      months,
      totalCommits,
      startDate: dateKey(gridStart),
      rangeStartDate: dateKey(rangeStart),
      endDate: dateKey(endDate),
      gridEndDate: cells[cells.length - 1].date,
    };
  };

  const formatActivitySummary = (count) => `${count} GitHub ${count === 1 ? 'contribution' : 'contributions'} in the last year`;

  return { buildActivityCalendar, formatActivitySummary };
});
