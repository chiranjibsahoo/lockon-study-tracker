import React, { useState, useMemo } from 'react';
import { 
  CalendarRange, CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, 
  Plus, Check, Trash2, Filter, Zap, BookOpen
} from 'lucide-react';
import { C, SUBJECTS, subjInfo } from '../data/subjects';
import { fmtRange, minToHM, dowOf, getTodayISO } from '../utils/timeHelpers';
import { actualForDate, plannedForDate } from '../utils/analyticsHelpers';

export function MonthlyMatrixView({ timetable, studyLog, onAddStudy, onDeleteStudy }) {
  const todayIso = getTodayISO();
  const [selectedMonthStr, setSelectedMonthStr] = useState(() => todayIso.slice(0, 7)); // 'YYYY-MM'
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [editingDate, setEditingDate] = useState(null);

  // Form states for quick inline logging
  const [quickSubject, setQuickSubject] = useState('Physics');
  const [quickDuration, setQuickDuration] = useState('60');
  const [quickTopic, setQuickTopic] = useState('');
  const [quickType, setQuickType] = useState('Concept Learning');

  const { year, monthIdx, daysInMonth, monthLabel } = useMemo(() => {
    const [y, m] = selectedMonthStr.split('-').map(Number);
    const date = new Date(y, m - 1, 1);
    const days = new Date(y, m, 0).getDate();
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return { year: y, monthIdx: m - 1, daysInMonth: days, monthLabel: label };
  }, [selectedMonthStr]);

  function changeMonth(offset) {
    const d = new Date(year, monthIdx + offset, 1);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    setSelectedMonthStr(`${yStr}-${mStr}`);
  }

  // Generate date strings for all days in month
  const monthDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dayStr = String(dayNum).padStart(2, '0');
      const mStr = String(monthIdx + 1).padStart(2, '0');
      const dateIso = `${year}-${mStr}-${dayStr}`;
      const dow = dowOf(dateIso);
      const plannedMin = plannedForDate(timetable, dateIso);
      const actualMin = actualForDate(studyLog, dateIso);
      const dayLogs = studyLog.filter((s) => s.date === dateIso);
      const isToday = dateIso === todayIso;

      return {
        dateIso,
        dayNum,
        dow,
        plannedMin,
        actualMin,
        dayLogs,
        isToday,
      };
    });
  }, [year, monthIdx, daysInMonth, timetable, studyLog, todayIso]);

  // Monthly aggregates
  const monthlyTotalActual = useMemo(() => {
    return monthDays.reduce((a, d) => a + d.actualMin, 0);
  }, [monthDays]);

  const monthlyTotalPlanned = useMemo(() => {
    return monthDays.reduce((a, d) => a + d.plannedMin, 0);
  }, [monthDays]);

  const completionPct = monthlyTotalPlanned > 0 ? Math.round((monthlyTotalActual / monthlyTotalPlanned) * 100) : 0;

  function handleQuickLog(dateIso, defaultSubject = 'Physics', defaultDuration = 60, defaultTopic = 'Daily Study') {
    onAddStudy({
      date: dateIso,
      subject: quickSubject || defaultSubject,
      duration: Number(quickDuration) || defaultDuration,
      topic: quickTopic.trim() || defaultTopic,
      studyType: quickType,
    });
    setEditingDate(null);
    setQuickTopic('');
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle
        eyebrow="Monthly Plan vs. Actual Matrix"
        title="Daily Plan vs Actual Quick Entry"
        icon={CalendarRange}
        right={
          <div className="flex items-center gap-2">
            <button className="lk-btn-ghost py-1 px-2.5" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={14} />
            </button>
            <span className="lk-mono font-bold text-sm" style={{ color: C.amber, minWidth: 120, textAlign: 'center' }}>
              {monthLabel}
            </span>
            <button className="lk-btn-ghost py-1 px-2.5" onClick={() => changeMonth(1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        }
      />

      {/* Monthly Summary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Monthly Planned" value={minToHM(monthlyTotalPlanned)} icon={Clock} />
        <StatCard
          label="Monthly Actual"
          value={minToHM(monthlyTotalActual)}
          icon={CheckCircle2}
          accent={completionPct >= 80 ? C.positive : C.amber}
        />
        <StatCard
          label="Monthly Completion"
          value={`${completionPct}%`}
          icon={Zap}
          accent={completionPct >= 80 ? C.positive : C.negative}
        />
        <StatCard
          label="Avg Daily Study"
          value={minToHM(daysInMonth > 0 ? monthlyTotalActual / daysInMonth : 0)}
          icon={BookOpen}
          accent={C.teal}
        />
      </div>

      {/* Filter by Subject */}
      <Panel style={{ padding: 12 }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={13} style={{ color: C.textFaint }} />
            <span className="text-xs font-semibold" style={{ color: C.textMute }}>Filter Subject:</span>
            <div className="flex gap-1 flex-wrap">
              {['All', ...SUBJECTS.map((s) => s.key)].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className="lk-chip cursor-pointer"
                  style={{
                    color: subjectFilter === sub ? '#0A1119' : C.textMute,
                    background: subjectFilter === sub ? C.amber : C.panel2,
                    borderColor: subjectFilter === sub ? C.amber : C.border,
                    padding: '3px 9px',
                    fontSize: 11,
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs" style={{ color: C.textFaint }}>
            Showing {daysInMonth} days for {monthLabel}
          </div>
        </div>
      </Panel>

      {/* Full Month Matrix List */}
      <div className="flex flex-col gap-3">
        {monthDays.map((day) => {
          const plannedSlots = timetable[day.dow] || [];
          const filteredSlots = subjectFilter === 'All' ? plannedSlots : plannedSlots.filter((s) => s.subject === subjectFilter);
          const filteredLogs = subjectFilter === 'All' ? day.dayLogs : day.dayLogs.filter((s) => s.subject === subjectFilter);
          const isInlineOpen = editingDate === day.dateIso;

          return (
            <Panel
              key={day.dateIso}
              style={{
                padding: 14,
                borderColor: day.isToday ? C.amber : C.border,
                background: day.isToday ? `${C.amberSoft}33` : C.panel,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2 mb-3 border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="lk-mono font-bold text-sm px-2.5 py-1 rounded"
                    style={{
                      background: day.isToday ? C.amber : C.panel2,
                      color: day.isToday ? '#0A1119' : C.textMain,
                    }}
                  >
                    Day {day.dayNum} &middot; {day.dow.slice(0, 3)}
                  </div>
                  <div className="text-xs" style={{ color: C.textFaint }}>
                    {day.dateIso}
                  </div>
                  {day.isToday && (
                    <span className="lk-chip" style={{ color: C.positive, background: C.positiveSoft, borderColor: '#1E4A38' }}>
                      Today
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span style={{ color: C.textMute }}>Planned: <b>{minToHM(day.plannedMin)}</b></span>
                  <span style={{ color: day.actualMin >= day.plannedMin && day.plannedMin > 0 ? C.positive : C.amber }}>
                    Actual: <b>{minToHM(day.actualMin)}</b>
                  </span>
                  <button
                    className="lk-btn-ghost py-1 px-2.5 text-xs flex items-center gap-1"
                    onClick={() => {
                      setEditingDate(isInlineOpen ? null : day.dateIso);
                      if (!isInlineOpen && plannedSlots.length > 0) {
                        setQuickSubject(plannedSlots[0].subject);
                        setQuickDuration(String(plannedSlots[0].end - plannedSlots[0].start));
                        setQuickTopic(plannedSlots[0].topic);
                      }
                    }}
                  >
                    <Plus size={12} /> {isInlineOpen ? 'Cancel' : '+ Quick Entry'}
                  </button>
                </div>
              </div>

              {/* Inline Quick Capture Form */}
              {isInlineOpen && (
                <div className="mb-3 p-3 rounded-lg flex flex-col gap-2" style={{ background: C.bgAlt, border: `1px solid ${C.amber}` }}>
                  <div className="lk-eyebrow" style={{ color: C.amber }}>
                    ⚡ 1-Click Quick Entry for {day.dateIso} ({day.dow})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="lk-label">Subject</label>
                      <select
                        className="lk-input text-xs"
                        value={quickSubject}
                        onChange={(e) => setQuickSubject(e.target.value)}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="lk-label">Duration (Minutes)</label>
                      <input
                        type="number"
                        className="lk-input text-xs"
                        value={quickDuration}
                        onChange={(e) => setQuickDuration(e.target.value)}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="lk-label">Study Type</label>
                      <select
                        className="lk-input text-xs"
                        value={quickType}
                        onChange={(e) => setQuickType(e.target.value)}
                      >
                        {['Concept Learning', 'JEE Questions', 'NCERT / School', 'Revision', 'Homework', 'Test Preparation'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="lk-label">Topic / Notes</label>
                      <input
                        className="lk-input text-xs"
                        value={quickTopic}
                        onChange={(e) => setQuickTopic(e.target.value)}
                        placeholder="e.g. Rotational Motion"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      className="lk-btn text-xs py-1.5 px-4"
                      onClick={() => handleQuickLog(day.dateIso)}
                    >
                      <Check size={13} className="mr-1 inline" /> Log Study Session (+10 XP)
                    </button>
                  </div>
                </div>
              )}

              {/* Planned vs Actual Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Planned Slots Column */}
                <div>
                  <div className="lk-eyebrow mb-2">Planned Timetable Slots ({day.dow})</div>
                  {filteredSlots.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {filteredSlots.map((slot, idx) => {
                        const sInfo = subjInfo(slot.subject);
                        const dur = slot.end - slot.start;
                        const isLogged = day.dayLogs.some((l) => l.subject === slot.subject);

                        return (
                          <div
                            key={slot.id || idx}
                            className="flex items-center justify-between p-2 rounded text-xs"
                            style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="lk-mono text-[11px]" style={{ color: C.textFaint, minWidth: 90 }}>
                                {fmtRange(slot.start, slot.end)}
                              </span>
                              <SubjectPill subject={slot.subject} />
                              <span className="truncate font-medium" style={{ color: C.textMain }}>
                                {slot.topic}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="lk-chip cursor-pointer hover:bg-emerald-950 flex-shrink-0"
                              style={{
                                color: isLogged ? C.positive : C.amber,
                                background: isLogged ? C.positiveSoft : C.amberSoft,
                                borderColor: isLogged ? '#1E4A38' : '#4A3A20',
                              }}
                              onClick={() => {
                                onAddStudy({
                                  date: day.dateIso,
                                  subject: slot.subject,
                                  duration: dur,
                                  topic: slot.topic,
                                  studyType: slot.type || 'Concept Learning',
                                });
                              }}
                              title="Click to mark Padh Liya (auto-log session)"
                            >
                              <CheckCircle2 size={11} className="mr-1 inline" />
                              {isLogged ? 'Padh Liya ✓' : 'Mark Padh Liya'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs py-2" style={{ color: C.textFaint }}>No slots planned for {day.dow}.</div>
                  )}
                </div>

                {/* Actual Study Logs Column */}
                <div>
                  <div className="lk-eyebrow mb-2">Actual Logged Study Sessions</div>
                  {filteredLogs.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-2 rounded text-xs"
                          style={{ background: C.panel2, border: `1px solid ${C.border}` }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <SubjectPill subject={log.subject} />
                            <span className="lk-mono font-bold" style={{ color: C.teal }}>
                              {log.duration}m
                            </span>
                            <span className="truncate" style={{ color: C.textMute }}>
                              {log.topic} &middot; <span style={{ color: C.textFaint }}>{log.studyType}</span>
                            </span>
                          </div>
                          {onDeleteStudy && (
                            <button
                              onClick={() => onDeleteStudy(log.id)}
                              className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                              title="Delete log"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs py-2" style={{ color: C.textFaint }}>No sessions logged yet for this date.</div>
                  )}
                </div>
              </div>
            </Panel>
          );
        })}
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
      <div className="lk-mono lk-display" style={{ fontSize: 21, fontWeight: 700, color: accent }}>
        {value}
      </div>
    </Panel>
  );
}

function SubjectPill({ subject }) {
  const s = subjInfo(subject);
  const Icon = s.icon;
  return (
    <span className="lk-chip flex-shrink-0" style={{ color: s.color, background: `${s.color}1A`, borderColor: `${s.color}44` }}>
      <Icon size={11} style={{ marginRight: 4 }} />
      {s.label}
    </span>
  );
}
