import { dowOf, TODAY_DATE } from './timeHelpers';

/** Array of 7 date strings (YYYY-MM-DD) for the current Mon-Sun week */
export const CURRENT_WEEK_DATES = (() => {
  const today = new Date();
  const dow = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
})();

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

export function computePercentile(rank, totalStudents, explicitPercentile) {
  if (explicitPercentile !== undefined && explicitPercentile !== null && explicitPercentile !== '') {
    return Number(explicitPercentile);
  }
  if (rank && totalStudents && totalStudents > 0) {
    const calculated = ((totalStudents - rank + 1) / totalStudents) * 100;
    return Math.round(calculated * 100) / 100;
  }
  return null;
}

export function computeProjectedAIR(rank, totalStudents, explicitExpectedRank) {
  if (explicitExpectedRank !== undefined && explicitExpectedRank !== null && explicitExpectedRank !== '') {
    return explicitExpectedRank;
  }
  if (rank && totalStudents && totalStudents > 0) {
    const projected = Math.max(1, Math.round(rank * (150000 / totalStudents)));
    return `AIR ~${projected.toLocaleString()}`;
  }
  return null;
}

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
  const dates = Array.from(new Set([...studyLog.map((e) => e.date), TODAY_DATE])).sort();
  return dates.map((date) => ({
    date,
    planned: plannedForDate(timetable, date),
    actual: actualForDate(studyLog, date)
  }));
}

export function computeStreak(rows) {
  let streak = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    const c = rows[i].planned > 0 ? (rows[i].actual / rows[i].planned) * 100 : (rows[i].actual > 0 ? 100 : 0);
    if (c >= 80 || rows[i].actual >= 120) streak++; else break;
  }
  return streak;
}

export function subjectHistory(tests, subject) {
  return tests
    .filter((t) => t.subject === subject)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => ({
      ...t,
      pct: pct(t.marksObtained, t.maxMarks),
      percentile: computePercentile(t.rank, t.totalStudents, t.percentile),
      projectedAIR: computeProjectedAIR(t.rank, t.totalStudents, t.expectedRank)
    }));
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

export function computeStudyAchievements(timetable, studyLog) {
  if (!studyLog.length) {
    return {
      maxDay: { date: '-', min: 0, label: '0h' },
      weekly: { planned: 0, actual: 0, pctVal: 0, label: '0h / 0h' },
      monthly: { planned: 0, actual: 0, pctVal: 0, label: '0h / 0h' },
      quarterly: { planned: 0, actual: 0, pctVal: 0, label: '0h / 0h' }
    };
  }

  // Max study day calculation
  const dayMap = {};
  studyLog.forEach((e) => {
    dayMap[e.date] = (dayMap[e.date] || 0) + e.duration;
  });

  let maxDate = TODAY_DATE;
  let maxMin = 0;
  Object.entries(dayMap).forEach(([d, min]) => {
    if (min > maxMin) {
      maxMin = min;
      maxDate = d;
    }
  });

  const currentYearMonth = TODAY_DATE.slice(0, 7);

  // Group study time
  const totalActualMin = studyLog.reduce((a, e) => a + e.duration, 0);
  const monthlyActualMin = studyLog.filter((e) => e.date.startsWith(currentYearMonth)).reduce((a, e) => a + e.duration, 0);

  const plannedPerDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    .reduce((a, dow) => a + (timetable[dow] || []).reduce((s, slot) => s + (slot.end - slot.start), 0), 0);

  const weeklyPlannedMin = plannedPerDay;
  const weeklyActualMin = studyLog.filter((e) => {
    const d = new Date(e.date);
    const now = new Date(TODAY_DATE);
    const diffDays = Math.abs((now - d) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).reduce((a, e) => a + e.duration, 0);

  const monthlyPlannedMin = weeklyPlannedMin * 4;
  const quarterlyPlannedMin = weeklyPlannedMin * 12;

  const weeklyPct = weeklyPlannedMin > 0 ? Math.round((weeklyActualMin / weeklyPlannedMin) * 100) : (weeklyActualMin > 0 ? 100 : 0);
  const monthlyPct = monthlyPlannedMin > 0 ? Math.round((monthlyActualMin / monthlyPlannedMin) * 100) : (monthlyActualMin > 0 ? 100 : 0);
  const quarterlyPct = quarterlyPlannedMin > 0 ? Math.round((totalActualMin / quarterlyPlannedMin) * 100) : (totalActualMin > 0 ? 100 : 0);

  return {
    maxDay: {
      date: maxDate,
      min: maxMin,
      label: `${(maxMin / 60).toFixed(1)} hrs (${maxDate})`
    },
    weekly: {
      planned: weeklyPlannedMin,
      actual: weeklyActualMin,
      pctVal: Math.min(100, weeklyPct),
      label: `${(weeklyActualMin / 60).toFixed(1)}h / ${(weeklyPlannedMin / 60).toFixed(1)}h`
    },
    monthly: {
      planned: monthlyPlannedMin,
      actual: monthlyActualMin,
      pctVal: Math.min(100, monthlyPct),
      label: `${(monthlyActualMin / 60).toFixed(1)}h / ${(monthlyPlannedMin / 60).toFixed(1)}h`
    },
    quarterly: {
      planned: quarterlyPlannedMin,
      actual: totalActualMin,
      pctVal: Math.min(100, quarterlyPct),
      label: `${(totalActualMin / 60).toFixed(1)}h / ${(quarterlyPlannedMin / 60).toFixed(1)}h`
    }
  };
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

export function computePeriodRewards(timetable, studyLog) {
  const achievements = computeStudyAchievements(timetable, studyLog);

  const build = (period, cycleId, cycleLabel, a) => ({
    period, cycleId, cycleLabel, ...a, tier: tierFor(period, a.pctVal), next: nextTierFor(period, a.pctVal)
  });

  return [
    build('Weekly', 'week-current', 'This Week Target', achievements.weekly),
    build('Monthly', 'month-current', 'This Month Target', achievements.monthly),
    build('Quarterly', 'quarter-current', 'Quarterly Target', achievements.quarterly),
  ];
}
