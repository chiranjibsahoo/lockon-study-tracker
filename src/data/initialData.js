import { T, dowOf, TODAY_DATE } from '../utils/timeHelpers';

export const testResultsSeed = [
  { id: 't1', category: 'PW Test', date: '2026-06-14', subject: 'Physics', testName: 'PW Weekly Test 14', chapter: 'Rotational Motion', maxMarks: 100, marksObtained: 68, rank: 38, totalStudents: 312, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Lost marks on moment-of-inertia numericals; rushed the last 10 questions.' },
  { id: 't2', category: 'PW Test', date: '2026-06-28', subject: 'Physics', testName: 'PW Weekly Test 16', chapter: 'Electrostatics', maxMarks: 100, marksObtained: 74, rank: 30, totalStudents: 312, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Better pacing; still weak on Gauss law application problems.' },
  { id: 't3', category: 'PW Test', date: '2026-07-12', subject: 'Physics', testName: 'PW Weekly Test 18', chapter: 'Current Electricity', maxMarks: 100, marksObtained: 81, rank: 24, totalStudents: 318, difficulty: 'Moderate', testType: 'JEE Main Pattern', notes: 'Solid on circuits; minor sign-convention errors in Kirchhoff’s law.' },
  { id: 't4', category: 'PW Test', date: '2026-07-26', subject: 'Physics', testName: 'PW Weekly Test 20', chapter: 'Magnetism', maxMarks: 100, marksObtained: 86, rank: 21, totalStudents: 320, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Best score yet — only slipped on the toroid field concept.' },
  { id: 't5', category: 'PW Test', date: '2026-06-14', subject: 'Chemistry', testName: 'PW Weekly Test 14', chapter: 'Chemical Bonding', maxMarks: 100, marksObtained: 70, rank: 45, totalStudents: 312, difficulty: 'Moderate', testType: 'JEE Main Pattern', notes: 'VSEPR shapes need more practice.' },
  { id: 't6', category: 'PW Test', date: '2026-06-28', subject: 'Chemistry', testName: 'PW Weekly Test 16', chapter: 'Chemical Equilibrium', maxMarks: 100, marksObtained: 75, rank: 38, totalStudents: 312, difficulty: 'Moderate', testType: 'JEE Main Pattern', notes: 'Improved on Le Chatelier problems.' },
  { id: 't7', category: 'PW Test', date: '2026-07-12', subject: 'Chemistry', testName: 'PW Weekly Test 18', chapter: 'Electrochemistry', maxMarks: 100, marksObtained: 79, rank: 33, totalStudents: 318, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Nernst equation numericals still slow under time pressure.' },
  { id: 't8', category: 'PW Test', date: '2026-07-26', subject: 'Chemistry', testName: 'PW Weekly Test 20', chapter: 'Coordination Compounds', maxMarks: 100, marksObtained: 83, rank: 27, totalStudents: 320, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Good grip on IUPAC naming and isomerism.' },
  { id: 't9', category: 'PW Test', date: '2026-06-14', subject: 'Mathematics', testName: 'PW Weekly Test 14', chapter: 'Sequences & Series', maxMarks: 100, marksObtained: 72, rank: 29, totalStudents: 312, difficulty: 'Moderate', testType: 'JEE Main Pattern', notes: 'AP-GP mixed problems need more speed.' },
  { id: 't10', category: 'PW Test', date: '2026-06-28', subject: 'Mathematics', testName: 'PW Weekly Test 16', chapter: 'Permutations & Combinations', maxMarks: 100, marksObtained: 80, rank: 19, totalStudents: 312, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Strong improvement on circular arrangement problems.' },
  { id: 't11', category: 'PW Test', date: '2026-07-12', subject: 'Mathematics', testName: 'PW Weekly Test 18', chapter: 'Probability', maxMarks: 100, marksObtained: 85, rank: 14, totalStudents: 318, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Conditional probability is now solid.' },
  { id: 't12', category: 'PW Test', date: '2026-07-26', subject: 'Mathematics', testName: 'PW Weekly Test 20', chapter: 'Vectors & 3D Geometry', maxMarks: 100, marksObtained: 90, rank: 9, totalStudents: 320, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Best rank yet — near-perfect on vector algebra.' },
  { id: 't13', category: 'School Test', date: '2026-06-10', subject: 'Physics', testName: 'Unit Test 1', chapter: 'Laws of Motion', maxMarks: 50, marksObtained: 44, difficulty: 'Moderate', testType: 'Unit Test', notes: '' },
  { id: 't14', category: 'School Test', date: '2026-07-08', subject: 'Mathematics', testName: 'Unit Test 2', chapter: 'Complex Numbers', maxMarks: 50, marksObtained: 47, difficulty: 'Moderate', testType: 'Unit Test', notes: '' },
  { id: 't15', category: 'School Test', date: '2026-07-15', subject: 'Chemistry', testName: 'Unit Test 2', chapter: 'Thermodynamics', maxMarks: 50, marksObtained: 42, difficulty: 'Moderate', testType: 'Unit Test', notes: '' },
  { id: 't16', category: 'School Test', date: '2026-08-01', subject: 'English', testName: 'Unit Test — Prose & Grammar', chapter: 'The Portrait of a Lady + Tenses', maxMarks: 50, marksObtained: 41, difficulty: 'Easy', testType: 'Unit Test', notes: '' },
  { id: 't17', category: 'School Test', date: '2026-07-22', subject: 'IT', testName: 'Practical Assessment', chapter: 'Python Basics + SQL', maxMarks: 50, marksObtained: 46, difficulty: 'Easy', testType: 'Unit Test', notes: '' },
  { id: 't18', category: 'Institute Test', date: '2026-06-20', subject: 'Combined', testName: 'Institute Monthly Test 1', chapter: 'Full syllabus till date', maxMarks: 300, marksObtained: 243, difficulty: 'Hard', testType: 'Monthly Test', notes: 'Chemistry section pulled the score down.' },
  { id: 't19', category: 'Institute Test', date: '2026-07-20', subject: 'Combined', testName: 'Institute Monthly Test 2', chapter: 'Full syllabus till date', maxMarks: 300, marksObtained: 258, difficulty: 'Hard', testType: 'Monthly Test', notes: 'Balanced performance across all three subjects.' },
  { id: 't20', category: 'Other', date: '2026-06-25', subject: 'Combined', testName: 'JEE Main Full Mock 1', chapter: 'Full syllabus', maxMarks: 300, marksObtained: 189, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Time management in the Maths section was the issue.' },
  { id: 't21', category: 'Other', date: '2026-07-25', subject: 'Combined', testName: 'JEE Main Full Mock 2', chapter: 'Full syllabus', maxMarks: 300, marksObtained: 216, difficulty: 'Hard', testType: 'JEE Main Pattern', notes: 'Attempted every section; accuracy up noticeably in Physics.' },
  { id: 't22', category: 'School Test', date: '2026-08-03', subject: 'PE', testName: 'Fitness Assessment', chapter: 'Endurance + Skill Test', maxMarks: 50, marksObtained: 45, difficulty: 'Easy', testType: 'Unit Test', notes: '' },
];

export const timetableSeed = {
  Monday: [
    { id: 'tt-m1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Rotational Motion (contd.)', type: 'Concept Learning' },
    { id: 'tt-m2', start: T(16, 0), end: T(17, 30), subject: 'Chemistry', topic: 'Coordination Compounds', type: 'NCERT' },
    { id: 'tt-m3', start: T(20, 30), end: T(22, 30), subject: 'Mathematics', topic: 'Vectors & 3D Geometry', type: 'JEE Questions' },
  ],
  Tuesday: [
    { id: 'tt-tu1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Magnetism', type: 'JEE Questions' },
    { id: 'tt-tu2', start: T(16, 0), end: T(17, 0), subject: 'Mathematics', topic: 'Probability', type: 'Concept Learning' },
    { id: 'tt-tu3', start: T(17, 0), end: T(18, 0), subject: 'Chemistry', topic: 'Electrochemistry', type: 'Revision' },
    { id: 'tt-tu4', start: T(18, 0), end: T(18, 30), subject: 'English', topic: 'Grammar & Editing Practice', type: 'Homework' },
  ],
  Wednesday: [
    { id: 'tt-w1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Alternating Current', type: 'Concept Learning' },
    { id: 'tt-w2', start: T(16, 0), end: T(17, 0), subject: 'Chemistry', topic: 'd- and f-Block Elements', type: 'NCERT' },
    { id: 'tt-w3', start: T(17, 0), end: T(17, 30), subject: 'IT', topic: 'Python Functions', type: 'Concept Learning' },
    { id: 'tt-w4', start: T(20, 30), end: T(22, 30), subject: 'Mathematics', topic: 'Complex Numbers', type: 'Advanced Questions' },
  ],
  Thursday: [
    { id: 'tt-th1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Current Electricity', type: 'Error Analysis' },
    { id: 'tt-th2', start: T(16, 0), end: T(17, 30), subject: 'Chemistry', topic: 'Chemical Equilibrium', type: 'JEE Questions' },
    { id: 'tt-th3', start: T(17, 30), end: T(18, 30), subject: 'Mathematics', topic: 'Sequences & Series', type: 'NCERT' },
  ],
  Friday: [
    { id: 'tt-f1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Electromagnetic Induction', type: 'JEE Questions' },
    { id: 'tt-f2', start: T(16, 0), end: T(17, 0), subject: 'Mathematics', topic: '3D Geometry', type: 'Concept Learning' },
    { id: 'tt-f3', start: T(17, 0), end: T(17, 30), subject: 'PE', topic: 'Fitness Drill', type: 'Homework' },
    { id: 'tt-f4', start: T(20, 30), end: T(22, 30), subject: 'Chemistry', topic: 'Electrochemistry', type: 'Advanced Questions' },
  ],
  Saturday: [
    { id: 'tt-s1', start: T(5, 30), end: T(7, 0), subject: 'Physics', topic: 'Full Syllabus Revision', type: 'Test Preparation' },
    { id: 'tt-s2', start: T(20, 30), end: T(21, 30), subject: 'Mathematics', topic: 'Mixed JEE Practice', type: 'JEE Questions' },
    { id: 'tt-s3', start: T(21, 30), end: T(22, 0), subject: 'Chemistry', topic: 'Weak Topics Revision', type: 'Revision' },
    { id: 'tt-s4', start: T(22, 0), end: T(22, 30), subject: 'English', topic: 'Reading Comprehension', type: 'Homework' },
  ],
  Sunday: [
    { id: 'tt-su1', start: T(19, 0), end: T(20, 15), subject: 'Physics', topic: 'Weekly Mock + Error Analysis', type: 'Test' },
    { id: 'tt-su2', start: T(20, 15), end: T(21, 15), subject: 'Chemistry', topic: 'Weekly Mock Section', type: 'Test' },
    { id: 'tt-su3', start: T(21, 15), end: T(22, 30), subject: 'Mathematics', topic: 'Weekly Mock + Error Analysis', type: 'Test' },
  ],
};

export const HISTORICAL_RATIOS = {
  '2026-07-26': 1.03, '2026-07-27': 0.95, '2026-07-28': 0.75, '2026-07-29': 0.94,
  '2026-07-30': 0.95, '2026-07-31': 0.96, '2026-08-01': 0.96, '2026-08-02': 0.97,
  '2026-08-03': 0.98, '2026-08-04': 0.98, '2026-08-05': 0.96, '2026-08-06': 1.02,
  '2026-08-07': 0.99,
};
export const historyDates = Object.keys(HISTORICAL_RATIOS);

export function genInitialStudyLog(timetable = timetableSeed) {
  const entries = [];
  let n = 1;
  historyDates.forEach((date) => {
    const dow = dowOf(date);
    const ratio = HISTORICAL_RATIOS[date];
    (timetable[dow] || []).forEach((slot) => {
      const planned = slot.end - slot.start;
      entries.push({
        id: `sl${n++}`,
        date,
        subject: slot.subject,
        duration: Math.max(0, Math.round(planned * ratio)),
        topic: slot.topic,
        studyType: slot.type,
      });
    });
  });
  // Today's live morning session logged
  entries.push({
    id: 'sl-today-1',
    date: TODAY_DATE,
    subject: 'Physics',
    duration: 95,
    topic: 'Full Syllabus Revision',
    studyType: 'Test Preparation',
  });
  return entries;
}

export const rewardCatalogSeed = [
  { id: 'r1', name: 'Favourite Meal Night', cost: 500, description: 'Pick dinner for the whole family.' },
  { id: 'r2', name: 'Movie / Entertainment Pass', cost: 1000, description: '2 hours of guilt-free screen time, or a movie outing.' },
  { id: 'r3', name: 'Small Gift', cost: 1500, description: 'Parent’s choice — a small gift under ₹500.' },
  { id: 'r4', name: 'Bigger Reward', cost: 3000, description: 'A bigger reward: gadget accessory, book set, or similar.' },
];

export const xpEventsSeed = [
  { id: 'e1', xp: 100, label: 'Mathematics — rank improved to #9', date: '2026-07-26' },
  { id: 'e2', xp: 150, label: 'Mathematics — PW Weekly Test 20 scored 90%', date: '2026-07-26' },
  { id: 'e3', xp: 75, label: 'Chemistry — PW Weekly Test 20 scored 83%', date: '2026-07-26' },
  { id: 'e4', xp: 50, label: 'Physics — improved +5% over previous test', date: '2026-07-26' },
  { id: 'e5', xp: 150, label: 'Perfect Week — 100% timetable completion', date: '2026-07-19' },
];

export const profileSettingsSeed = {
  studentName: 'Chiranjib Sahoo',
  classGrade: 'Class 11 PCM',
  jeeTargetRank: 100,
  cbseTargetPct: 98,
  parentPin: '', // empty means PIN protection disabled
  baseXP: 7895,
};
