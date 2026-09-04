import React, { useState } from 'react';
import { Calendar, Lock, BarChart3, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { C, subjInfo } from '../data/subjects';
import { fmtRange, minToHM, TODAY_DATE, dowOf, fmtT, T } from '../utils/timeHelpers';
import { plannedForDate, actualForDate, actualForDateSubject, CURRENT_WEEK_DATES, getSlotsForDow } from '../utils/analyticsHelpers';

function fixedBlocksFor(dow) {
  if (dow === 'Saturday') {
    return [
      { label: 'PW Coaching', start: T(7, 0), end: T(18, 0) },
      { label: 'Refresh', start: T(18, 0), end: T(19, 0) },
      { label: 'Coaching', start: T(19, 0), end: T(20, 30) },
    ];
  }
  if (dow === 'Sunday') {
    return [
      { label: 'PW Coaching', start: T(7, 0), end: T(18, 0) },
      { label: 'Refresh', start: T(18, 0), end: T(19, 0) },
    ];
  }
  const eve = ['Monday', 'Wednesday', 'Friday'].includes(dow)
    ? { start: T(17, 30), end: T(19, 30) }
    : { start: T(18, 30), end: T(20, 30) };
  return [
    { label: 'School', start: T(7, 0), end: T(14, 0) },
    { label: 'Rest', start: T(14, 0), end: T(16, 0) },
    { label: 'Coaching', start: eve.start, end: eve.end },
  ];
}

export function TimetableView({ timetable, studyLog, onAddSlot, onDeleteSlot }) {
  const [activeDate, setActiveDate] = useState(TODAY_DATE);
  const [showAddModal, setShowAddModal] = useState(false);
  const dow = dowOf(activeDate);
  const items = getSlotsForDow(timetable, dow);
  const fixed = fixedBlocksFor(dow);
  const isToday = activeDate === TODAY_DATE;
  const dayPlanned = plannedForDate(timetable, activeDate);
  const dayActual = actualForDate(studyLog, activeDate);

  const dailyChartData = CURRENT_WEEK_DATES.map((d) => ({
    name: `${dowOf(d).slice(0, 3)} ${d.slice(-2)}`,
    Planned: Math.round(plannedForDate(timetable, d) / 6) / 10,
    Actual: Math.round(actualForDate(studyLog, d) / 6) / 10,
  }));

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle
        eyebrow="Smart Timetable — live, auto-tracked"
        title="Daily core, weekly rotation"
        icon={Calendar}
        right={
          <button className="lk-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Slot to {dow}
          </button>
        }
      />

      <Panel>
        <div className="flex gap-1.5 mb-4 overflow-x-auto lk-scroll pb-1">
          {CURRENT_WEEK_DATES.map((d) => {
            const active = activeDate === d;
            return (
              <div
                key={d}
                onClick={() => setActiveDate(d)}
                className="lk-tab"
                style={{
                  background: active ? C.amberSoft : C.panel2,
                  color: active ? C.amber : C.textMute,
                  border: `1px solid ${active ? '#4A3A20' : C.border}`,
                }}
              >
                {dowOf(d).slice(0, 3)} {d.slice(-2)}
                {d === TODAY_DATE && (
                  <span className="lk-mono" style={{ fontSize: 9, marginLeft: 4, color: C.positive }}>
                    &#9679; today
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {fixed.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {fixed.map((f, i) => (
              <Chip key={i} color={C.textFaint} bg={C.bgAlt} border={C.border}>
                <Lock size={10} style={{ marginRight: 4 }} />
                {f.label} &middot; {fmtRange(f.start, f.end)}
              </Chip>
            ))}
          </div>
        )}

        <div
          className="flex items-center justify-between mb-3 p-3 rounded-lg flex-wrap gap-2"
          style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
        >
          <div className="text-sm" style={{ color: C.textMute }}>
            {isToday ? "Today's total (live)" : `${dow} total`}
          </div>
          <StatusPill planned={dayPlanned} actual={dayActual} />
        </div>

        <div className="flex flex-col gap-2">
          {items.map((it, i) => {
            const s = subjInfo(it.subject);
            const Icon = s.icon;
            const planned = it.end - it.start;
            const actual = actualForDateSubject(studyLog, activeDate, it.subject);
            return (
              <div
                key={it.id || i}
                className="flex items-center gap-3 p-3 rounded-lg flex-wrap"
                style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
              >
                <div className="lk-mono text-xs flex-shrink-0" style={{ minWidth: 100, color: C.textFaint }}>
                  {fmtRange(it.start, it.end)}
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: `${s.color}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <div className="text-sm font-medium truncate">{it.topic}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: s.color }}>{s.label}</span>
                    <Chip>{it.type}</Chip>
                  </div>
                </div>
                <StatusPill planned={planned} actual={actual} />
                {onDeleteSlot && (
                  <button
                    onClick={() => onDeleteSlot(dow, it.id || i)}
                    className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove slot"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-sm text-center py-6" style={{ color: C.textFaint }}>
              No self-study slots scheduled for {dow}. Click 'Add Slot' above to customize your timetable.
            </div>
          )}
        </div>
      </Panel>

      <Panel>
        <SectionTitle title="This Week — Planned vs Actual (Hours)" icon={BarChart3} />
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={dailyChartData} margin={{ left: -18, top: 4 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textFaint }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.textFaint }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip
              contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: C.text }}
            />
            <Bar dataKey="Planned" fill={C.textFaint} radius={[3, 3, 0, 0]} opacity={0.5} />
            <Bar dataKey="Actual" fill={C.amber} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {showAddModal && (
        <AddSlotModal
          dow={dow}
          onClose={() => setShowAddModal(false)}
          onAdd={(newSlot) => {
            onAddSlot(dow, newSlot);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddSlotModal({ dow, onClose, onAdd }) {
  const [startH, setStartH] = useState('16');
  const [startM, setStartM] = useState('00');
  const [endH, setEndH] = useState('17');
  const [endM, setEndM] = useState('30');
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Concept Learning');

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = T(parseInt(startH, 10), parseInt(startM, 10));
    const end = T(parseInt(endH, 10), parseInt(endM, 10));
    if (end <= start || !topic) return;
    onAdd({
      id: `tt-custom-${Date.now()}`,
      start,
      end,
      subject,
      topic,
      type,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="lk-panel w-full max-w-md" style={{ background: C.panel }}>
        <h3 className="lk-h2 mb-4">Add Study Slot to {dow}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="lk-label">Start Time</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="lk-input"
                  value={startH}
                  onChange={(e) => setStartH(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="lk-input"
                  value={startM}
                  onChange={(e) => setStartM(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="lk-label">End Time</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="lk-input"
                  value={endH}
                  onChange={(e) => setEndH(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="lk-input"
                  value={endM}
                  onChange={(e) => setEndM(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="lk-label">Subject</label>
            <select className="lk-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {['Physics', 'Chemistry', 'Mathematics', 'English', 'IT', 'PE'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="lk-label">Topic / Focus</label>
            <input
              className="lk-input"
              placeholder="e.g. Chemical Kinetics Numerical Practice"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="lk-label">Slot Type</label>
            <select className="lk-input" value={type} onChange={(e) => setType(e.target.value)}>
              {['Concept Learning', 'NCERT', 'JEE Questions', 'Advanced Questions', 'Revision', 'Homework', 'Test Preparation', 'Test'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" className="lk-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="lk-btn">
              Add Slot
            </button>
          </div>
        </form>
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

function Chip({ children, color = C.textMute, bg = C.panel2, border = C.border }) {
  return (
    <span className="lk-chip" style={{ color, background: bg, borderColor: border }}>
      {children}
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
