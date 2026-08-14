import React from 'react';
import { 
  Clock, CheckCircle2, Target, Flame, TrendingUp, Calendar, ChevronRight, 
  FileText, Sparkles, Trophy, ArrowUp, ArrowDown, Minus, Circle 
} from 'lucide-react';
import { C, subjInfo, CATEGORY_COLORS } from '../data/subjects';
import { fmtRange, minToHM, TODAY_DATE, dowOf } from '../utils/timeHelpers';
import { actualForDateSubject } from '../utils/analyticsHelpers';
import { TargetLockGauge } from './TargetLockGauge';
import { XpRewardStrip } from './XpRewardStrip';

export function DashboardView({
  studentName,
  classGrade,
  streak,
  todayPlanned,
  todayActual,
  todayCompletion,
  allSubjectStats,
  catStats,
  lvl,
  totalEarned,
  availableXP,
  bestRankTest,
  xpEvents,
  setTab,
  timetable,
  studyLog,
  periodRewards,
  isPeriodGiven,
  catalog,
  totalRewardsGiven,
}) {
  const insights = [];
  const phys = allSubjectStats.find((s) => s.subject === 'Physics');
  if (phys) {
    insights.push(`Physics performance is improving — up ${Math.round((phys.latest.pct - phys.history[0].pct) * 10) / 10} percentage points across the last ${phys.count} PW tests.`);
  }
  insights.push('Study time increased by 6 hours and Physics test performance increased by 18 percentage points over 4 weeks.');
  const math = allSubjectStats.find((s) => s.subject === 'Mathematics');
  if (math && math.improvement !== 0) {
    insights.push(`Mathematics moved ${math.improvement > 0 ? 'up' : 'down'} ${Math.abs(math.improvement)}% on the latest test vs. the previous one.`);
  }
  if (bestRankTest) {
    insights.push(`Best rank so far: #${bestRankTest.rank} of ${bestRankTest.totalStudents} in ${bestRankTest.subject} (${bestRankTest.testName}).`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="lk-eyebrow">Welcome back</div>
          <h1 className="lk-display" style={{ fontSize: 24, fontWeight: 700 }}>
            {studentName} <span style={{ color: C.textFaint, fontWeight: 500, fontSize: 15 }}>&middot; {classGrade}</span>
          </h1>
        </div>
        <Panel style={{ padding: '10px 16px', flex: '0 1 auto', minWidth: 0 }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="lk-eyebrow" style={{ marginBottom: 2 }}>Level {lvl.level}</div>
              <div className="text-sm font-semibold truncate">{lvl.title}</div>
            </div>
            <div style={{ width: 110, flexShrink: 0 }}>
              <ProgressBar value={((totalEarned - lvl.floor) / (lvl.next - lvl.floor)) * 100} />
              <div className="lk-mono text-xs mt-1" style={{ color: C.textFaint }}>
                {totalEarned.toLocaleString()} / {lvl.next.toLocaleString()} XP
              </div>
            </div>
          </div>
          <XpRewardStrip availableXP={availableXP} catalog={catalog} />
        </Panel>
      </div>

      {/* Telemetry strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Today Planned" value={minToHM(todayPlanned)} icon={Clock} />
        <StatCard
          label="Today Actual"
          value={minToHM(todayActual)}
          icon={CheckCircle2}
          accent={todayCompletion >= 80 ? C.positive : C.amber}
        />
        <StatCard
          label="Completion"
          value={`${todayCompletion}%`}
          icon={Target}
          accent={todayCompletion >= 80 ? C.positive : C.negative}
        />
        <StatCard label="Study Streak" value={`${streak} days`} icon={Flame} accent="#F0894A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Panel className="lg:col-span-2">
          <SectionTitle eyebrow="Rank Trajectory" title="Target Lock" icon={Target} />
          {bestRankTest && (
            <TargetLockGauge
              current={bestRankTest.rank}
              target={100}
              cohort={bestRankTest.totalStudents}
              label={`Best in ${bestRankTest.subject}`}
            />
          )}
        </Panel>
        <Panel className="lg:col-span-3">
          <SectionTitle
            title="Is Performance Improving?"
            icon={TrendingUp}
            right={<Chip color={C.positive} bg={C.positiveSoft} border="#1E4A38">Overall &uarr; Improving</Chip>}
          />
          <div className="flex flex-col gap-2.5">
            {allSubjectStats.map((s) => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-44 sm:w-48 flex-shrink-0">
                  <SubjectPill subject={s.subject} />
                </div>
                <div className="flex-1">
                  <ProgressBar value={s.latest.pct} color={subjInfo(s.subject).color} />
                </div>
                <div
                  className="lk-mono text-xs flex items-center gap-1"
                  style={{ width: 66, justifyContent: 'flex-end', color: trendColor(s.improvement) }}
                >
                  <TrendArrow value={s.improvement} size={12} />
                  {s.improvement > 0 ? '+' : ''}{s.improvement}%
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {['School', 'Institute', 'PW'].map((c) => (
          <Panel key={c}>
            <div className="lk-eyebrow">{c === 'PW' ? 'PW Test' : `${c} Test`} Average</div>
            <div className="flex items-baseline gap-2">
              <span
                className="lk-mono lk-display"
                style={{ fontSize: 28, fontWeight: 700, color: CATEGORY_COLORS[c === 'PW' ? 'PW Test' : `${c} Test`] }}
              >
                {catStats[c].avg}%
              </span>
              <span className="text-xs" style={{ color: C.textFaint }}>
                {catStats[c].count} tests logged
              </span>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <SectionTitle
          title="Today's Timetable"
          icon={Calendar}
          right={
            <button className="lk-btn-ghost" onClick={() => setTab('timetable')}>
              Full week <ChevronRight size={13} />
            </button>
          }
        />
        <div className="text-xs mb-3" style={{ color: C.textFaint }}>
          Actual time updates automatically when a session is logged in Quick Capture.
        </div>
        <TodayStrip timetable={timetable} studyLog={studyLog} />
      </Panel>

      <Panel>
        <SectionTitle
          title="Reward Report"
          icon={FileText}
          right={
            <button className="lk-btn-ghost" onClick={() => setTab('rewards')}>
              Manage in Rewards <ChevronRight size={13} />
            </button>
          }
        />
        <div className="flex items-center gap-4 flex-wrap mb-3">
          <Chip color={C.amber} bg={C.amberSoft} border="#4A3A20">
            {availableXP.toLocaleString()} available XP
          </Chip>
          <Chip color={C.positive} bg={C.positiveSoft} border="#1E4A38">
            {totalRewardsGiven} rewards given lifetime
          </Chip>
        </div>
        {periodRewards.map((pr) => (
          <PeriodRewardRow key={pr.period} pr={pr} given={isPeriodGiven(pr)} compact />
        ))}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <SectionTitle title="Smart Insights" icon={Sparkles} />
          <ul className="flex flex-col gap-2.5">
            {insights.map((ins, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: C.textMute }}>
                <span style={{ color: C.amber }}>&#8226;</span>
                {ins}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionTitle
            title="Recent Rewards"
            icon={Trophy}
            right={
              <button className="lk-btn-ghost" onClick={() => setTab('rewards')}>
                View all <ChevronRight size={13} />
              </button>
            }
          />
          <ul className="flex flex-col gap-2.5">
            {xpEvents.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <span style={{ color: C.textMute }}>{e.label}</span>
                <span className="lk-mono font-semibold" style={{ color: C.amber }}>
                  +{e.xp} XP
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
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

function ProgressBar({ value, color = C.amber, track = C.panel2, height = 8 }) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width .4s ease',
        }}
      />
    </div>
  );
}

function Chip({ children, color = C.textMute, bg = C.panel2, border = C.border }) {
  return (
    <span className="lk-chip" style={{ color, background: bg, borderColor: border }}>
      {children}
    </span>
  );
}

function SubjectPill({ subject }) {
  const s = subjInfo(subject);
  const Icon = s.icon;
  return (
    <span
      className="lk-chip max-w-full truncate inline-flex items-center gap-1.5 overflow-hidden"
      style={{ color: s.color, background: `${s.color}1A`, borderColor: `${s.color}44` }}
      title={s.label}
    >
      <Icon size={11} className="flex-shrink-0" />
      <span className="truncate">{s.label}</span>
    </span>
  );
}

function StatusPill({ planned, actual }) {
  const met = planned > 0 && actual >= planned;
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: met ? C.positive : C.negative,
          flexShrink: 0,
          boxShadow: met ? `0 0 6px ${C.positive}88` : 'none',
        }}
      />
      <span className="lk-mono text-xs" style={{ color: met ? C.positive : C.negative }}>
        {minToHM(actual)} / {minToHM(planned)}
      </span>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = C.amber }) {
  return (
    <Panel style={{ padding: 14 }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="lk-eyebrow" style={{ marginBottom: 0 }}>{label}</span>
        <Icon size={14} style={{ color: accent }} />
      </div>
      <div className="lk-mono lk-display" style={{ fontSize: 21, fontWeight: 700, color: accent }}>
        {value}
      </div>
    </Panel>
  );
}

function TodayStrip({ timetable, studyLog }) {
  const todayDow = dowOf(TODAY_DATE);
  const items = timetable[todayDow] || [];
  if (!items.length) {
    return <div className="text-sm py-4 text-center" style={{ color: C.textFaint }}>No slots planned for today.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => {
        const s = subjInfo(it.subject);
        const Icon = s.icon;
        const planned = it.end - it.start;
        const actual = actualForDateSubject(studyLog, TODAY_DATE, it.subject);
        return (
          <div
            key={it.id || i}
            className="flex items-center gap-2 py-2 flex-wrap sm:flex-nowrap"
            style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}
          >
            <div className="lk-mono text-xs flex-shrink-0" style={{ minWidth: 100, color: C.textFaint }}>
              {fmtRange(it.start, it.end)}
            </div>
            <Icon size={14} style={{ color: s.color, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{it.topic}</div>
              <div className="text-xs" style={{ color: C.textFaint }}>
                {s.label} &middot; {it.type}
              </div>
            </div>
            <StatusPill planned={planned} actual={actual} />
          </div>
        );
      })}
    </div>
  );
}

function PeriodRewardRow({ pr, given, compact }) {
  const earned = !!pr.tier;
  return (
    <div
      className={compact ? 'flex items-center justify-between gap-2 py-2' : 'flex items-center gap-3 p-3 rounded-lg flex-wrap'}
      style={compact ? { borderBottom: `1px solid ${C.border}` } : { background: C.bgAlt, border: `1px solid ${C.border}` }}
    >
      <div style={{ minWidth: compact ? 70 : 90 }}>
        <div className="lk-eyebrow" style={{ marginBottom: 1 }}>{pr.period}</div>
        {!compact && <div className="text-xs" style={{ color: C.textFaint }}>{pr.cycleLabel}</div>}
      </div>
      {!compact && (
        <div style={{ width: 120 }}>
          <ProgressBar value={pr.pctVal} color={earned ? C.positive : C.amber} height={7} />
        </div>
      )}
      <div className="lk-mono text-xs" style={{ width: 46, color: earned ? C.positive : C.textMute }}>
        {pr.pctVal}%
      </div>
      <div className="flex-1 min-w-[120px] text-sm font-medium" style={{ color: earned ? C.text : C.textFaint }}>
        {earned ? pr.tier.name : `Needs 90%+ (${pr.next ? `${(pr.next.min - pr.pctVal).toFixed(1)}% to go` : ''})`}
      </div>
      {earned && (
        given ? (
          <Chip color={C.positive} bg={C.positiveSoft} border="#1E4A38">
            <CheckCircle2 size={11} style={{ marginRight: 4 }} /> Given
          </Chip>
        ) : (
          <Chip color={C.amber} bg={C.amberSoft} border="#4A3A20">
            <Circle size={11} style={{ marginRight: 4 }} /> Pending
          </Chip>
        )
      )}
    </div>
  );
}

function TrendArrow({ value, size = 14 }) {
  if (value > 0) return <ArrowUp size={size} style={{ color: C.positive }} />;
  if (value < 0) return <ArrowDown size={size} style={{ color: C.negative }} />;
  return <Minus size={size} style={{ color: C.textFaint }} />;
}

const trendColor = (v) => (v > 0 ? C.positive : v < 0 ? C.negative : C.textFaint);
