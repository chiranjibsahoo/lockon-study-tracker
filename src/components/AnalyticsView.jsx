import React from 'react';
import { TrendingUp, BarChart3, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { C, SUBJECTS, CATEGORY_COLORS, subjInfo } from '../data/subjects';
import { fmtDate } from '../utils/timeHelpers';
import { subjectStats } from '../utils/analyticsHelpers';
import { TargetLockGauge } from './TargetLockGauge';

export function AnalyticsView({
  testResults,
  allSubjectStats,
  catStats,
  bestRankTest,
  subject,
  setSubject,
}) {
  const stats = subjectStats(testResults, subject);
  const chartData = stats ? stats.history.map((h) => ({ name: fmtDate(h.date), score: h.pct })) : [];

  const studyCorrelation = {
    Physics: [
      { week: 'Week 1', hours: 5, score: 68 },
      { week: 'Week 2', hours: 7, score: 74 },
      { week: 'Week 3', hours: 9, score: 81 },
      { week: 'Week 4', hours: 11, score: 86 },
    ],
    Chemistry: [
      { week: 'Week 1', hours: 4, score: 70 },
      { week: 'Week 2', hours: 6, score: 75 },
      { week: 'Week 3', hours: 7, score: 79 },
      { week: 'Week 4', hours: 8, score: 83 },
    ],
    Mathematics: [
      { week: 'Week 1', hours: 6, score: 72 },
      { week: 'Week 2', hours: 8, score: 80 },
      { week: 'Week 3', hours: 9, score: 85 },
      { week: 'Week 4', hours: 10, score: 90 },
    ],
  };

  const corr = studyCorrelation[subject];

  const mostImproved = [...allSubjectStats].sort((a, b) => b.improvement - a.improvement)[0];
  const biggestDecline = [...allSubjectStats].sort((a, b) => a.improvement - b.improvement)[0];
  const highest = [...allSubjectStats].sort((a, b) => b.best - a.best)[0];
  const mostConsistent = [...allSubjectStats].sort((a, b) => a.stdev - b.stdev)[0];

  const catChart = [
    { name: 'School', value: catStats.School.avg, fill: CATEGORY_COLORS['School Test'] },
    { name: 'Institute', value: catStats.Institute.avg, fill: CATEGORY_COLORS['Institute Test'] },
    { name: 'PW', value: catStats.PW.avg, fill: CATEGORY_COLORS['PW Test'] },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle eyebrow="Deep dive" title="Test Performance Analytics" icon={TrendingUp} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InsightStat
          label="Most Improved"
          value={mostImproved?.subject}
          sub={`+${mostImproved?.improvement}%`}
          color={C.positive}
        />
        <InsightStat
          label="Biggest Decline"
          value={biggestDecline?.improvement < 0 ? biggestDecline.subject : 'None'}
          sub={biggestDecline?.improvement < 0 ? `${biggestDecline.improvement}%` : 'All trending up'}
          color={biggestDecline?.improvement < 0 ? C.negative : C.textFaint}
        />
        <InsightStat
          label="Highest Score"
          value={highest?.subject}
          sub={`${highest?.best}%`}
          color={C.amber}
        />
        <InsightStat
          label="Most Consistent"
          value={mostConsistent?.subject}
          sub={`σ ${Math.round(mostConsistent?.stdev * 10) / 10}`}
          color={C.teal}
        />
      </div>

      <Panel>
        <SectionTitle
          title="Subject Performance Trend"
          icon={BarChart3}
          right={
            <select
              className="lk-input"
              style={{ width: 'auto' }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.filter((s) => allSubjectStats.some((st) => st.subject === s.key)).map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          }
        />
        {stats && (
          <>
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="lk-mono lk-display" style={{ fontSize: 26, fontWeight: 700, color: subjInfo(subject).color }}>
                {stats.latest.pct}%
              </span>
              <span
                className="text-sm flex items-center gap-1 font-semibold"
                style={{ color: trendColor(stats.improvement) }}
              >
                <TrendArrow value={stats.improvement} />
                {stats.improvement > 0 ? '+' : ''}{stats.improvement}% vs previous test
              </span>
              <span className="text-xs ml-auto" style={{ color: C.textFaint }}>
                Avg {stats.avg}% &middot; Best {stats.best}% &middot; Tests: {stats.count}
              </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ left: -18, top: 4 }}>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.textFaint }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: C.text }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={subjInfo(subject).color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: subjInfo(subject).color }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: C.bgAlt, color: C.textMute }}>
              {subject} performance is {stats.improvement >= 0 ? 'improving' : 'dipping'} —{' '}
              {Math.round((stats.latest.pct - stats.history[0].pct) * 10) / 10 >= 0 ? '+' : ''}
              {Math.round((stats.latest.pct - stats.history[0].pct) * 10) / 10} percentage points since the first recorded test.
            </div>
          </>
        )}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <SectionTitle title="School / Institute / PW Comparison" icon={BarChart3} />
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={catChart} margin={{ left: -18, top: 4 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.textFaint }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: C.text }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {catChart.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs mt-2" style={{ color: C.textFaint }}>
            Averages calculated dynamically from your logged test records.
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="Rank Tracking" icon={Target} />
          {bestRankTest && (
            <TargetLockGauge
              current={bestRankTest.rank}
              target={100}
              cohort={bestRankTest.totalStudents}
              label="Best across all PW tests"
            />
          )}
          <div className="mt-3 text-xs" style={{ color: C.textMute }}>
            Physics rank moved from <span className="lk-mono">#38</span> to{' '}
            <span className="lk-mono" style={{ color: C.positive }}>#21</span> across recorded tests — improved by 17 positions.
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionTitle
          title="Study &harr; Test Correlation"
          icon={TrendingUp}
          right={<span className="text-xs" style={{ color: C.textFaint }}>{subject}</span>}
        />
        {corr ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={corr} margin={{ left: -10, top: 4 }}>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={false} tickLine={false} unit="h" />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: C.text }}
                />
                <Line yAxisId="l" type="monotone" dataKey="hours" name="Study hrs/week" stroke={C.teal} strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="r" type="monotone" dataKey="score" name="Test score %" stroke={C.amber} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: C.bgAlt, color: C.textMute }}>
              Study time increased from {corr[0].hours}h to {corr[corr.length - 1].hours}h/week, and {subject} test performance rose from {corr[0].score}% to {corr[corr.length - 1].score}% over the same 4 weeks.
            </div>
          </>
        ) : (
          <div className="text-sm" style={{ color: C.textFaint }}>
            Not enough weekly history yet for this subject.
          </div>
        )}
      </Panel>
    </div>
  );
}

function Panel({ children, style, className = '' }) {
  return <div className={`lk-panel ${className}`} style={style}>{children}</div>;
}

function SectionTitle({ eyebrow, title, icon: Icon, right }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div>
        {eyebrow && <div className="lk-eyebrow">{eyebrow}</div>}
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} style={{ color: C.amber }} />}
          <h2 className="lk-h2">{title}</h2>
        </div>
      </div>
      {right}
    </div>
  );
}

function InsightStat({ label, value, sub, color }) {
  return (
    <Panel style={{ padding: 13 }}>
      <div className="lk-eyebrow">{label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
      <div className="lk-mono text-xs mt-0.5" style={{ color }}>{sub}</div>
    </Panel>
  );
}

function TrendArrow({ value, size = 14 }) {
  if (value > 0) return <ArrowUp size={size} style={{ color: C.positive }} />;
  if (value < 0) return <ArrowDown size={size} style={{ color: C.negative }} />;
  return <Minus size={size} style={{ color: C.textFaint }} />;
}

const trendColor = (v) => (v > 0 ? C.positive : v < 0 ? C.negative : C.textFaint);
