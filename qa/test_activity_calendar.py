from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[1]


def run():
    script = r"""
const assert = require('node:assert/strict');
const {
  buildActivityCalendar,
  formatActivitySummary,
} = require('./js/activity-calendar.js');
const {
  supplementalActivityByDay,
  supplementalContributionCount,
} = require('./js/activity-history.js');

const commits = [
  { commit: { author: { date: '2025-09-29T01:00:00Z' } } },
  { commit: { committer: { date: '2025-09-29T08:00:00Z' } } },
  { commit: { author: { date: '2026-04-15T12:00:00Z' } } },
  { commit: { author: { date: '2025-09-27T12:00:00Z' } } },
  { commit: { author: { date: '2026-09-30T12:00:00Z' } } },
];

const calendar = buildActivityCalendar(commits, new Date('2026-09-28T23:59:59Z'));

assert.equal(calendar.cells.length, 371);
assert.equal(calendar.startDate, '2025-09-28');
assert.equal(calendar.endDate, '2026-09-28');
assert.equal(calendar.gridEndDate, '2026-10-03');
assert.equal(calendar.totalCommits, 3);

const monday = calendar.cells.find((cell) => cell.date === '2025-09-29');
assert.deepEqual(
  { count: monday.count, level: monday.level, weekIndex: monday.weekIndex, dayIndex: monday.dayIndex },
  { count: 2, level: 2, weekIndex: 0, dayIndex: 1 }
);

const futureCell = calendar.cells.find((cell) => cell.date === '2026-09-30');
assert.equal(futureCell.isFuture, true);
assert.equal(futureCell.count, 0);

assert.deepEqual(calendar.months[0], { label: 'Oct', weekIndex: 1 });
assert.deepEqual(calendar.months.at(-1), { label: 'Sep', weekIndex: 49 });

assert.equal(supplementalContributionCount, 35);
const historical = buildActivityCalendar(
  [],
  new Date('2026-09-28T23:59:59Z'),
  supplementalActivityByDay
);
assert.equal(historical.totalCommits, 35);
assert.equal(historical.cells.find((cell) => cell.date === '2026-04-16').count, 6);
assert.equal(historical.cells.find((cell) => cell.date === '2026-05-06').count, 2);
assert.equal(historical.cells.find((cell) => cell.date === '2026-06-12').count, 7);

const merged = buildActivityCalendar(
  [{ commit: { author: { date: '2026-04-16T12:00:00Z' } } }],
  new Date('2026-09-28T23:59:59Z'),
  supplementalActivityByDay
);
assert.equal(merged.cells.find((cell) => cell.date === '2026-04-16').count, 7);

assert.equal(formatActivitySummary(1), '1 GitHub contribution in the last year');
assert.equal(formatActivitySummary(35), '35 GitHub contributions in the last year');
"""

    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise AssertionError(result.stderr or result.stdout)

    print("PASS calendar-aligned public + supplemental GitHub activity behavior")


if __name__ == "__main__":
    run()
