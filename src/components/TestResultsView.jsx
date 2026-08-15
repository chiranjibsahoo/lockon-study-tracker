import React, { useState } from 'react';
import { 
  ClipboardList, Plus, ChevronDown, ArrowUp, ArrowDown, Minus, 
  Search, Trash2, Edit2 
} from 'lucide-react';
import { C, SUBJECTS, CATEGORY_COLORS, subjInfo } from '../data/subjects';
import { fmtDate } from '../utils/timeHelpers';
import { pct, subjectHistory, computePercentile, computeProjectedAIR } from '../utils/analyticsHelpers';

export function TestResultsView({
  testResults,
  filter,
  setFilter,
  expanded,
  setExpanded,
  setTab,
  onEditTest,
  onDeleteTest,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = testResults
    .filter((t) => {
      const matchCat = filter.category === 'All' || t.category === filter.category;
      const matchSub = filter.subject === 'All' || t.subject === filter.subject;
      const matchSearch =
        !searchQuery ||
        t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.chapter && t.chapter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSub && matchSearch;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const subjOptions = ['All', ...SUBJECTS.map((s) => s.key), 'Combined'];

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle
        eyebrow={`${testResults.length} tests on record`}
        title="Test & Results"
        icon={ClipboardList}
        right={
          <button className="lk-btn" onClick={() => setTab('capture')}>
            <Plus size={14} /> Add Test
          </button>
        }
      />

      <Panel style={{ padding: 14 }}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex gap-1.5 flex-wrap items-center">
            {['All', 'School Test', 'Institute Test', 'PW Test', 'Other'].map((c) => (
              <div
                key={c}
                onClick={() => setFilter((f) => ({ ...f, category: c }))}
                className="lk-chip cursor-pointer"
                style={{
                  color: filter.category === c ? '#0A1119' : C.textMute,
                  background: filter.category === c ? C.amber : C.panel2,
                  borderColor: filter.category === c ? C.amber : C.border,
                }}
              >
                {c}
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-48">
              <Search size={13} className="absolute left-2.5 top-3 text-gray-400" />
              <input
                className="lk-input pl-8"
                style={{ padding: '7px 11px 7px 30px' }}
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="lk-input"
              style={{ width: 'auto' }}
              value={filter.subject}
              onChange={(e) => setFilter((f) => ({ ...f, subject: e.target.value }))}
            >
              {subjOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All subjects' : s === 'Combined' ? 'Combined / Full' : subjInfo(s).label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-2.5">
        {filtered.map((t) => {
          const p = pct(t.marksObtained, t.maxMarks);
          const hist = subjectHistory(testResults, t.subject);
          const idx = hist.findIndex((h) => h.id === t.id);
          const prev = idx > 0 ? hist[idx - 1] : null;
          const delta = prev ? Math.round((p - pct(prev.marksObtained, prev.maxMarks)) * 10) / 10 : null;
          const isOpen = expanded === t.id;

          return (
            <Panel key={t.id} style={{ padding: 14 }} className="lk-scroll">
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
                  onClick={() => setExpanded(isOpen ? null : t.id)}
                >
                  <Chip
                    color={CATEGORY_COLORS[t.category]}
                    bg={`${CATEGORY_COLORS[t.category]}1A`}
                    border={`${CATEGORY_COLORS[t.category]}44`}
                  >
                    {t.category}
                  </Chip>
                  <SubjectPill subject={t.subject === 'Combined' ? 'Combined' : t.subject} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.testName}</div>
                    <div className="text-xs truncate" style={{ color: C.textFaint }}>
                      {t.chapter} &middot; {fmtDate(t.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-end">
                  {t.rank && (
                    <div className="lk-mono text-xs" style={{ color: C.textMute }}>
                      #{t.rank}{t.totalStudents ? `/${t.totalStudents}` : ''}
                    </div>
                  )}
                  {(t.percentile != null || (t.rank && t.totalStudents)) && (
                    <div className="lk-chip" style={{ color: C.teal, background: C.tealSoft, borderColor: '#1E4A44', fontFamily: 'monospace' }}>
                      {(t.percentile ?? computePercentile(t.rank, t.totalStudents, null))?.toFixed(1)}%ile
                    </div>
                  )}
                  <div className="lk-mono font-bold" style={{ fontSize: 18, color: C.amber, width: 58, textAlign: 'right' }}>
                    {p}%
                  </div>
                  {delta !== null && (
                    <div className="lk-mono text-xs flex items-center gap-1" style={{ width: 54, color: trendColor(delta) }}>
                      <TrendArrow value={delta} size={11} />
                      {delta > 0 ? '+' : ''}{delta}%
                    </div>
                  )}

                  <div className="flex items-center gap-1 ml-2">
                    {onEditTest && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTest(t);
                        }}
                        className="p-1 text-gray-400 hover:text-amber transition-colors"
                        title="Edit test record"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDeleteTest && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ${t.testName}?`)) onDeleteTest(t.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete test record"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <ChevronDown
                      size={15}
                      className="cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : t.id)}
                      style={{
                        color: C.textFaint,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform .15s',
                      }}
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="mt-3 pt-3 flex flex-col gap-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Chip>{t.difficulty}</Chip>
                    <Chip>{t.testType}</Chip>
                    {t.testScope && <Chip>{t.testScope}</Chip>}
                    <Chip>{t.marksObtained}/{t.maxMarks} marks</Chip>
                  </div>
                  {/* Percentile & AIR row */}
                  {(t.percentile != null || t.expectedRank || (t.rank && t.totalStudents)) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(t.percentile != null || (t.rank && t.totalStudents)) && (
                        <div className="rounded-lg p-2.5" style={{ background: C.tealSoft, border: '1px solid #1E4A44' }}>
                          <div className="lk-eyebrow" style={{ marginBottom: 2 }}>Percentile</div>
                          <div className="lk-mono font-bold" style={{ color: C.teal, fontSize: 18 }}>
                            {(t.percentile ?? computePercentile(t.rank, t.totalStudents, null))?.toFixed(2)}%ile
                          </div>
                        </div>
                      )}
                      {(t.expectedRank || (t.rank && t.totalStudents)) && (
                        <div className="rounded-lg p-2.5" style={{ background: '#10B9811A', border: '1px solid #10B98144' }}>
                          <div className="lk-eyebrow" style={{ marginBottom: 2 }}>Projected JEE AIR</div>
                          <div className="lk-mono font-bold" style={{ color: C.positive, fontSize: 14 }}>
                            {t.expectedRank || computeProjectedAIR(t.rank, t.totalStudents, null)}
                          </div>
                        </div>
                      )}
                      {t.rank && t.totalStudents && (
                        <div className="rounded-lg p-2.5" style={{ background: C.amberSoft, border: '1px solid #4A3A20' }}>
                          <div className="lk-eyebrow" style={{ marginBottom: 2 }}>Batch Rank</div>
                          <div className="lk-mono font-bold" style={{ color: C.amber, fontSize: 16 }}>
                            #{t.rank} / {t.totalStudents}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {t.notes && <div className="text-xs" style={{ color: C.textMute }}>{t.notes}</div>}
                </div>
              )}
            </Panel>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-sm text-center py-8" style={{ color: C.textFaint }}>
            No tests match this filter or search query.
          </div>
        )}
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

function SubjectPill({ subject }) {
  const s = subjInfo(subject);
  const Icon = s.icon;
  return (
    <span className="lk-chip" style={{ color: s.color, background: `${s.color}1A`, borderColor: `${s.color}44` }}>
      <Icon size={11} style={{ marginRight: 4 }} />
      {s.label}
    </span>
  );
}

function TrendArrow({ value, size = 14 }) {
  if (value > 0) return <ArrowUp size={size} style={{ color: C.positive }} />;
  if (value < 0) return <ArrowDown size={size} style={{ color: C.negative }} />;
  return <Minus size={size} style={{ color: C.textFaint }} />;
}

const trendColor = (v) => (v > 0 ? C.positive : v < 0 ? C.negative : C.textFaint);
