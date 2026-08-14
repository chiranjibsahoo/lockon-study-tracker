import React, { useState } from 'react';
import { 
  Users, Clock, CheckCircle2, Flame, GraduationCap, FileText, 
  TrendingUp, ClipboardList, Lock, ShieldCheck, Key 
} from 'lucide-react';
import { C } from '../data/subjects';
import { minToHM } from '../utils/timeHelpers';
import { pct } from '../utils/analyticsHelpers';
import { XpRewardStrip } from './XpRewardStrip';

export function ParentView({
  studentName,
  todayPlanned,
  todayActual,
  todayCompletion,
  streak,
  allSubjectStats,
  testResults,
  lvl,
  periodRewards,
  isPeriodGiven,
  onMarkPeriodGiven,
  totalRewardsGiven,
  availableXP,
  catalog,
  profileSettings,
}) {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!profileSettings.parentPin);

  const strongest = [...allSubjectStats].sort((a, b) => b.avg - a.avg)[0];
  const weakest = [...allSubjectStats].sort((a, b) => a.avg - b.avg)[0];
  const improving = allSubjectStats.filter((s) => s.improvement >= 0).length >= allSubjectStats.length / 2;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput === profileSettings.parentPin) {
      setIsUnlocked(true);
    } else {
      alert('Incorrect Parent PIN. Please try again.');
    }
  };

  if (profileSettings.parentPin && !isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Panel className="w-full max-w-sm text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            <Lock size={22} className="text-amber" />
          </div>
          <h2 className="lk-h2 mb-1">Parent Mode Protected</h2>
          <p className="text-xs text-gray-400 mb-4">
            Enter 4-digit Parent PIN to access Parent View & approve rewards.
          </p>
          <form onSubmit={handleUnlock} className="flex flex-col gap-3">
            <input
              type="password"
              maxLength={6}
              className="lk-input text-center text-lg tracking-widest"
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="lk-btn w-full">
              <Key size={14} /> Unlock Parent View
            </button>
          </form>
        </Panel>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle
        eyebrow={`${studentName} · ${profileSettings.classGrade}`}
        title="Parent / Admin Command Center"
        icon={Users}
        right={
          profileSettings.parentPin && (
            <button className="lk-btn-ghost" onClick={() => setIsUnlocked(false)}>
              <Lock size={13} /> Lock Parent Mode
            </button>
          )
        }
      />

      <Panel style={{ background: improving ? C.positiveSoft : C.negativeSoft, borderColor: improving ? '#1E4A38' : '#4A2A22' }}>
        <div className="lk-eyebrow" style={{ color: improving ? C.positive : C.negative }}>
          Is {studentName} following the plan and improving?
        </div>
        <div className="lk-display" style={{ fontSize: 20, fontWeight: 700, color: improving ? C.positive : C.negative }}>
          {improving ? 'Yes — on track and trending up.' : 'Mixed — some subjects need attention.'}
        </div>
        <div className="text-sm mt-1" style={{ color: C.textMute }}>
          {todayCompletion}% of today's study plan completed so far &middot; {streak}-day consistent study streak.
        </div>
      </Panel>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Today Planned" value={minToHM(todayPlanned)} icon={Clock} />
        <StatCard label="Today Actual" value={minToHM(todayActual)} icon={CheckCircle2} />
        <StatCard label="Study Streak" value={`${streak}d`} icon={Flame} accent="#F0894A" />
        <StatCard label="Level" value={`${lvl.level}`} icon={GraduationCap} />
      </div>

      <Panel>
        <SectionTitle
          eyebrow="What you need to give, and when"
          title="Reward Report for Parents"
          icon={FileText}
          right={<Chip color={C.teal} bg={C.tealSoft} border="#1E4A44">{totalRewardsGiven} given lifetime</Chip>}
        />
        <div className="flex flex-col gap-2.5">
          {periodRewards.map((pr) => (
            <PeriodRewardRow
              key={pr.period}
              pr={pr}
              given={isPeriodGiven(pr)}
              onMarkGiven={onMarkPeriodGiven}
            />
          ))}
        </div>
        <XpRewardStrip availableXP={availableXP} catalog={catalog} />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <SectionTitle title="Strong vs Weak Subjects" icon={TrendingUp} />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: C.positiveSoft }}>
              <span className="text-sm">Strongest — <b>{strongest?.subject}</b></span>
              <span className="lk-mono font-semibold" style={{ color: C.positive }}>{strongest?.avg}% avg</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: C.negativeSoft }}>
              <span className="text-sm">Needs attention — <b>{weakest?.subject}</b></span>
              <span className="lk-mono font-semibold" style={{ color: C.negative }}>{weakest?.avg}% avg</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="Recent Test Results" icon={ClipboardList} />
          <div className="flex flex-col gap-2">
            {[...testResults].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.textMute }}>{t.subject === 'Combined' ? 'Combined' : t.subject} — {t.testName}</span>
                <span className="lk-mono font-semibold" style={{ color: C.amber }}>{pct(t.marksObtained, t.maxMarks)}%</span>
              </div>
            ))}
          </div>
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

function StatCard({ label, value, icon: Icon, accent = C.amber }) {
  return (
    <Panel style={{ padding: 14 }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="lk-eyebrow" style={{ marginBottom: 0 }}>{label}</span>
        <Icon size={14} style={{ color: accent }} />
      </div>
      <div className="lk-mono lk-display" style={{ fontSize: 21, fontWeight: 700, color: accent }}>{value}</div>
    </Panel>
  );
}

function Chip({ children, color = C.textMute, bg = C.panel2, border = C.border }) {
  return (
    <span className="lk-chip" style={{ color, background: bg, borderColor: border }}>
      {children}
    </span>
  );
}

function PeriodRewardRow({ pr, given, onMarkGiven }) {
  const earned = !!pr.tier;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg flex-wrap"
      style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
    >
      <div style={{ minWidth: 90 }}>
        <div className="lk-eyebrow" style={{ marginBottom: 1 }}>{pr.period}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>{pr.cycleLabel}</div>
      </div>
      <div className="lk-mono text-xs" style={{ width: 46, color: earned ? C.positive : C.textMute }}>
        {pr.pctVal}%
      </div>
      <div className="flex-1 min-w-[120px] text-sm font-medium" style={{ color: earned ? C.text : C.textFaint }}>
        {earned ? pr.tier.name : `Needs 90%+ (${pr.next ? `${(pr.next.min - pr.pctVal).toFixed(1)}% to go` : ''})`}
      </div>
      {earned && (
        given ? (
          <Chip color={C.positive} bg={C.positiveSoft} border="#1E4A38">
            <ShieldCheck size={11} style={{ marginRight: 4 }} /> Given by Parent
          </Chip>
        ) : (
          <button
            className="lk-btn"
            style={{ padding: '6px 12px', fontSize: 11.5 }}
            onClick={() => onMarkGiven(pr)}
          >
            Mark as Given
          </button>
        )
      )}
    </div>
  );
}
