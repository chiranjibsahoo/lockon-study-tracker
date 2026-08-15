import React, { useState } from 'react';
import { Zap, BookOpen, ClipboardList, Clock, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { C, SUBJECTS, subjInfo } from '../data/subjects';
import { TODAY_DATE } from '../utils/timeHelpers';
import { pct } from '../utils/analyticsHelpers';

export function QuickCaptureView({
  subTab,
  setSubTab,
  onAddStudy,
  onAddTest,
  onDeleteStudy,
  studyLog,
  testResults,
  saveMsg,
  setSaveMsg,
}) {
  const sessionEntries = studyLog.filter((e) => !e.id.startsWith('sl'));

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle eyebrow="Fast daily entry" title="Quick Capture" icon={Zap} />
      
      <div className="flex gap-2">
        <div
          className="lk-tab"
          style={{
            background: subTab === 'study' ? C.amberSoft : C.panel2,
            color: subTab === 'study' ? C.amber : C.textMute,
            border: `1px solid ${subTab === 'study' ? '#4A3A20' : C.border}`,
            flex: 1,
            justifyContent: 'center',
            padding: '12px',
          }}
          onClick={() => {
            setSubTab('study');
            setSaveMsg(null);
          }}
        >
          <BookOpen size={15} /> STUDY SESSION
        </div>
        <div
          className="lk-tab"
          style={{
            background: subTab === 'test' ? C.amberSoft : C.panel2,
            color: subTab === 'test' ? C.amber : C.textMute,
            border: `1px solid ${subTab === 'test' ? '#4A3A20' : C.border}`,
            flex: 1,
            justifyContent: 'center',
            padding: '12px',
          }}
          onClick={() => {
            setSubTab('test');
            setSaveMsg(null);
          }}
        >
          <ClipboardList size={15} /> TEST RESULT
        </div>
      </div>

      {saveMsg && (
        <div
          className="flex items-center justify-between p-3 rounded-lg text-sm"
          style={{ background: C.positiveSoft, border: '1px solid #1E4A38', color: C.positive }}
        >
          {saveMsg.text}
          <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSaveMsg(null)} />
        </div>
      )}

      {subTab === 'study' ? (
        <StudyForm onAdd={onAddStudy} />
      ) : (
        <TestForm onAdd={onAddTest} />
      )}

      <Panel>
        <SectionTitle title="Recent Captures (this session)" icon={Clock} />
        {sessionEntries.length === 0 && (
          <div className="text-sm" style={{ color: C.textFaint }}>
            Nothing logged in this session yet — entries saved above appear here instantly and update today's status.
          </div>
        )}
        <div className="flex flex-col gap-2">
          {sessionEntries.slice(0, 8).map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between text-sm p-2.5 rounded-lg flex-wrap gap-2"
              style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-2">
                <SubjectPill subject={e.subject} />
                <span style={{ color: C.textMute }}>{e.topic}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="lk-mono text-xs" style={{ color: C.textFaint }}>
                  {e.duration} min &middot; {e.studyType} &middot; {e.date}
                </span>
                {onDeleteStudy && (
                  <button
                    onClick={() => onDeleteStudy(e.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete log entry"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StudyForm({ onAdd }) {
  const [subject, setSubject] = useState('Physics');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [studyType, setStudyType] = useState('Concept Learning');
  const [date, setDate] = useState(TODAY_DATE);

  const types = [
    'Concept Learning',
    'NCERT',
    'JEE Questions',
    'Advanced Questions',
    'Revision',
    'Homework',
    'Test Preparation',
    'Test',
    'Error Analysis',
  ];

  const valid = duration && topic && date;

  return (
    <Panel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="lk-label">Date</label>
          <input
            className="lk-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Subject</label>
          <select className="lk-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="lk-label">Duration (minutes)</label>
          <input
            className="lk-input"
            type="number"
            placeholder="e.g. 90"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Study Type</label>
          <select className="lk-input" value={studyType} onChange={(e) => setStudyType(e.target.value)}>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="lk-label">Topic / Chapter</label>
          <input
            className="lk-input"
            placeholder="e.g. Rotational Motion — Moment of Inertia Numericals"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      </div>
      <button
        className="lk-btn mt-4"
        disabled={!valid}
        onClick={() => {
          onAdd({ subject, duration: Number(duration), topic, studyType, date });
          setDuration('');
          setTopic('');
        }}
      >
        <Plus size={15} /> Save Study Entry
      </button>
    </Panel>
  );
}

function TestForm({ onAdd }) {
  const [category, setCategory] = useState('PW Test');
  const [subject, setSubject] = useState('Physics');
  const [testName, setTestName] = useState('');
  const [chapter, setChapter] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [marksObtained, setMarksObtained] = useState('');
  const [rank, setRank] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [percentile, setPercentile] = useState('');
  const [expectedRank, setExpectedRank] = useState('');
  const [testScope, setTestScope] = useState('Milestone Test');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [testType, setTestType] = useState('JEE Main Pattern');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(TODAY_DATE);

  const subjectOptions = [...SUBJECTS.map((s) => s.key), 'Combined'];
  const testScopes = [
    'Milestone Test',
    'Major Test',
    'AITS (All India Test Series)',
    'Weekly Test',
    'Full Mock Test',
    'Unit Test',
    'Chapter Test',
    'Other',
  ];
  const testTypes = [
    'JEE Main Pattern',
    'JEE Advanced Pattern',
    'CBSE Pattern',
    'Unit Test',
    'Monthly Test',
    'Half Yearly',
    'Final',
    'Mock Test',
    'Other',
  ];

  const percentage = maxMarks && marksObtained ? pct(Number(marksObtained), Number(maxMarks)) : null;
  const computedPercentile = percentile || (rank && totalStudents ? (((Number(totalStudents) - Number(rank) + 1) / Number(totalStudents)) * 100).toFixed(2) : null);
  const computedAIR = expectedRank || (rank && totalStudents ? `AIR ~${Math.max(1, Math.round(Number(rank) * (150000 / Number(totalStudents)))).toLocaleString()}` : null);

  const valid = testName && maxMarks && marksObtained && date;

  return (
    <Panel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="lk-label">Date of Test</label>
          <input
            className="lk-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Test Category</label>
          <select className="lk-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {['School Test', 'Institute Test', 'PW Test', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="lk-label">Subject</label>
          <select className="lk-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'Combined' ? 'Combined / Full Test' : subjInfo(s).label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="lk-label">Test Scope / Milestone</label>
          <select className="lk-input" value={testScope} onChange={(e) => setTestScope(e.target.value)}>
            {testScopes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="lk-label">Test Name</label>
          <input
            className="lk-input"
            placeholder="e.g. PW Milestone Test 04 / AITS 02"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Chapter / Topic</label>
          <input
            className="lk-input"
            placeholder="e.g. Magnetism & Matter / Full Syllabus"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Maximum Marks</label>
          <input
            className="lk-input"
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Marks Obtained</label>
          <input
            className="lk-input"
            type="number"
            value={marksObtained}
            onChange={(e) => setMarksObtained(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">
            Rank <span style={{ color: C.textFaint, fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            className="lk-input"
            type="number"
            placeholder="e.g. 15"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">
            Total Students <span style={{ color: C.textFaint, fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            className="lk-input"
            type="number"
            placeholder="e.g. 320"
            value={totalStudents}
            onChange={(e) => setTotalStudents(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">
            Percentile (%ile) <span style={{ color: C.textFaint, fontWeight: 400 }}>(auto / optional)</span>
          </label>
          <input
            className="lk-input"
            placeholder="e.g. 99.45"
            value={percentile}
            onChange={(e) => setPercentile(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">
            Expected Final JEE AIR <span style={{ color: C.textFaint, fontWeight: 400 }}>(auto / optional)</span>
          </label>
          <input
            className="lk-input"
            placeholder="e.g. AIR ~1450"
            value={expectedRank}
            onChange={(e) => setExpectedRank(e.target.value)}
          />
        </div>
        <div>
          <label className="lk-label">Difficulty</label>
          <select className="lk-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {['Easy', 'Moderate', 'Hard'].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="lk-label">Test Type</label>
          <select className="lk-input" value={testType} onChange={(e) => setTestType(e.target.value)}>
            {testTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="lk-label">Notes / Mistake Analysis</label>
          <input
            className="lk-input"
            placeholder="What went wrong, specific formula or chapter to revise"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="text-xs flex items-center gap-3" style={{ color: C.textMute }}>
          <span>Score: <b style={{ color: percentage !== null ? C.amber : C.textFaint }}>{percentage !== null ? `${percentage}%` : '—'}</b></span>
          {computedPercentile && <span>Percentile: <b style={{ color: C.teal }}>{computedPercentile}%ile</b></span>}
          {computedAIR && <span>Projected: <b style={{ color: C.positive }}>{computedAIR}</b></span>}
        </div>
        <button
          className="lk-btn"
          disabled={!valid}
          onClick={() => {
            onAdd({
              category,
              subject,
              testName,
              chapter,
              maxMarks: Number(maxMarks),
              marksObtained: Number(marksObtained),
              rank: rank ? Number(rank) : undefined,
              totalStudents: totalStudents ? Number(totalStudents) : undefined,
              percentile: percentile ? Number(percentile) : (computedPercentile ? Number(computedPercentile) : undefined),
              expectedRank: expectedRank || computedAIR || undefined,
              testScope,
              difficulty,
              testType,
              notes,
              date,
            });
            setTestName('');
            setChapter('');
            setMarksObtained('');
            setRank('');
            setTotalStudents('');
            setPercentile('');
            setExpectedRank('');
            setNotes('');
          }}
        >
          <Plus size={15} /> Save Test Result
        </button>
      </div>
    </Panel>
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
