import { dowOf, TODAY_DATE } from './timeHelpers';
import { historyDates } from '../data/initialData';

export const LEVEL_THRESHOLDS = [0, 250, 600, 1050, 1600, 2250, 3000, 3850, 4800, 5850, 7000, 8000, 10000, 12500, 15500, 19000, 23000, 27500, 32500, 38000];
export const LEVEL_TITLES = [
  'Novice', 'Learner', 'Steady Starter', 'Focused Mind', 'Disciplined Scholar',
  'Rising Scorer', 'Momentum Builder', 'Sharp Solver', 'Consistent Achiever',
  'Exam Ready', 'Precision Tracker', 'Consistent Performer', 'Command-Center Pro',
  'Elite Strategist', 'Rank Climber', 'Target Locked', 'JEE Contender',
  'Advanced Aspirant', 'Peak Performer', 'Command Master'
];

export function levelInfo(xp) {
  let idx = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) idx = i;
  }
  const next = LEVEL_THRESHOLDS[idx + 1] ?? LEVEL_THRESHOLDS[idx] + 5000;
  return {
    level: idx + 1,
    title: LEVEL_TITLES[idx] || 'Command Master',
    floor: LEVEL_THRESHOLDS[idx],
    next
  };
}

export const pct = (obtained, max) => Math.round((obtained / max) * 1000) / 10;

export function plannedForDate(timetable, dateStr) {
  const dow = dowOf(dateStr);
  return (timetable[dow] || []).reduce((a, s) => a + (s.end - s.start), 0);
}

export function actualForDate(studyLog, dateStr) {
  return studyLog.filter((e) => e.date === dateStr).reduce((a, e) => a + e.duration, 0);
}

export function actualForDateSubject(studyLog, dateStr, subject) {
  return studyLog.filter((e) => e.date === dateStr && e.subject === subject).reduce((a, e) => a + e.duration, 0);
}

export function dailyRows(timetable, studyLog) {
  return historyDates.map((date) => ({
    date,
    planned: plannedForDate(timetable, date),
    actual: actualForDate(studyLog, date)
  }));
}

export function computeStreak(rows) {
  let streak = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    const c = rows[i].planned > 0 ? (rows[i].actual / rows[i].planned) * 100 : 0;
    if (c >= 80) streak++; else break;
  }
  return streak;
}

export function subjectHistory(tests, subject) {
  return tests
    .filter((t) => t.subject === subject)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => ({ ...t, pct: pct(t.marksObtained, t.maxMarks) }));
}

export function subjectStats(tests, subject) {
  const h = subjectHistory(tests, subject);
  if (!h.length) return null;
  const latest = h[h.length - 1];
  const prev = h.length > 1 ? h[h.length - 2] : null;
  const scores = h.map((t) => t.pct);
  const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  const best = Math.max(...scores);
  const improvement = prev ? Math.round((latest.pct - prev.pct) * 10) / 10 : 0;
  const mean = avg;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
  return { subject, history: h, latest, prev, avg, best, improvement, stdev: Math.sqrt(variance), count: h.length };
}

export function categoryStats(tests, category) {
  const h = tests.filter((t) => t.category === category);
  if (!h.length) return { avg: 0, count: 0 };
  const avg = Math.round((h.reduce((a, t) => a + pct(t.marksObtained, t.maxMarks), 0) / h.length) * 10) / 10;
  return { avg, count: h.length };
}

export function testXP(test, prevTest) {
  let xp = 0;
  const p = pct(test.marksObtained, test.maxMarks);
  if (p >= 98) xp += 150;
  else if (p >= 95) xp += 100;
  else if (p >= 90) xp += 75;

  if (prevTest) {
    const delta = p - pct(prevTest.marksObtained, prevTest.maxMarks);
    if (delta >= 10) xp += 100;
    else if (delta >= 5) xp += 50;
  }
  return xp;
}

export const PERIOD_TIER_NAMES = {
  Weekly: [
    { min: 100, name: 'Perfect Week Reward' },
    { min: 95, name: 'Gold Study Reward' },
    { min: 90, name: 'Weekly Discipline Reward' }
  ],
  Monthly: [
    { min: 100, name: 'Perfect Month Reward' },
    { min: 95, name: 'Monthly Excellence Reward' },
    { min: 90, name: 'Monthly Consistency Reward' }
  ],
  Quarterly: [
    { min: 100, name: 'Perfect Quarter Reward' },
    { min: 95, name: 'Quarterly Excellence Reward' },
    { min: 90, name: 'Quarterly Momentum Reward' }
  ],
};

export function tierFor(period, p) {
  for (const t of PERIOD_TIER_NAMES[period]) {
    if (p >= t.min) return t;
  }
  return null;
}

export function nextTierFor(period, p) {
  const asc = [...PERIOD_TIER_NAMES[period]].reverse();
  for (const t of asc) {
    if (p < t.min) return t;
  }
  return null;
}

export const CURRENT_WEEK_DATES = ['2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08'];

export function computePeriodRewards(timetable, studyLog) {
  const rows = [
    ...historyDates.map((d) => ({ date: d, planned: plannedForDate(timetable, d), actual: actualForDate(studyLog, d) })),
    { date: TODAY_DATE, planned: plannedForDate(timetable, TODAY_DATE), actual: actualForDate(studyLog, TODAY_DATE) }
  ];
  const agg = (filtered) => {
    const planned = filtered.reduce((a, r) => a + r.planned, 0);
    const actual = filtered.reduce((a, r) => a + r.actual, 0);
    return { planned, actual, pctVal: planned > 0 ? Math.round((actual / planned) * 1000) / 10 : 0 };
  };
  const w = agg(rows.filter((r) => CURRENT_WEEK_DATES.includes(r.date)));
  const m = agg(rows.filter((r) => r.date >= '2026-08-01'));
  const q = agg(rows);

  const build = (period, cycleId, cycleLabel, a) => ({
    period, cycleId, cycleLabel, ...a, tier: tierFor(period, a.pctVal), next: nextTierFor(period, a.pctVal)
  });

  return [
    build('Weekly', 'week-2026-W32', 'This week (2–8 Aug)', w),
    build('Monthly', 'month-2026-08', 'August 2026 (so far)', m),
    build('Quarterly', 'quarter-2026-Q3', 'Jul–Sep 2026 (so far)', q),
  ];
}
