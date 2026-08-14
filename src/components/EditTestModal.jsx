import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { C, SUBJECTS, subjInfo } from '../data/subjects';

export function EditTestModal({ test, onSave, onClose }) {
  const [category, setCategory] = useState(test.category || 'PW Test');
  const [subject, setSubject] = useState(test.subject || 'Physics');
  const [testName, setTestName] = useState(test.testName || '');
  const [chapter, setChapter] = useState(test.chapter || '');
  const [maxMarks, setMaxMarks] = useState(test.maxMarks || 100);
  const [marksObtained, setMarksObtained] = useState(test.marksObtained || 0);
  const [rank, setRank] = useState(test.rank || '');
  const [totalStudents, setTotalStudents] = useState(test.totalStudents || '');
  const [difficulty, setDifficulty] = useState(test.difficulty || 'Moderate');
  const [testType, setTestType] = useState(test.testType || 'JEE Main Pattern');
  const [notes, setNotes] = useState(test.notes || '');
  const [date, setDate] = useState(test.date || '');

  const subjectOptions = [...SUBJECTS.map((s) => s.key), 'Combined'];
  const testTypes = [
    'Chapter Test',
    'Unit Test',
    'Monthly Test',
    'Half Yearly',
    'Final',
    'JEE Main Pattern',
    'JEE Advanced Pattern',
    'Mock Test',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...test,
      category,
      subject,
      testName,
      chapter,
      maxMarks: Number(maxMarks),
      marksObtained: Number(marksObtained),
      rank: rank ? Number(rank) : undefined,
      totalStudents: totalStudents ? Number(totalStudents) : undefined,
      difficulty,
      testType,
      notes,
      date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="lk-panel w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ background: C.panel }}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-800">
          <h2 className="lk-h2">Edit Test Record</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="lk-label">Date</label>
              <input
                className="lk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">Category</label>
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
              <label className="lk-label">Test Name</label>
              <input
                className="lk-input"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">Chapter / Topic</label>
              <input
                className="lk-input"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
            <div>
              <label className="lk-label">Max Marks</label>
              <input
                className="lk-input"
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">Marks Obtained</label>
              <input
                className="lk-input"
                type="number"
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">Rank (optional)</label>
              <input
                className="lk-input"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          <div>
            <label className="lk-label">Notes / Analysis</label>
            <input
              className="lk-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-800 pt-4">
            <button type="button" className="lk-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="lk-btn">
              <Save size={14} /> Update Test Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
