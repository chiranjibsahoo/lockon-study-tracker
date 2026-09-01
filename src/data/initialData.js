import { T, dowOf, TODAY_DATE } from '../utils/timeHelpers';

export const testResultsSeed = [];

const monFriSlots = [
  { id: 'tt-def-1', start: 390, end: 420, subject: 'English', topic: 'English / IT / PE Study', type: 'NCERT / School' },
  { id: 'tt-def-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Core Study', type: 'Concept Learning' },
  { id: 'tt-def-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Core Study', type: 'NCERT / Practice' },
  { id: 'tt-def-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Maths Problem Solving', type: 'JEE Questions' },
];

const satSunSlots = [
  { id: 'tt-sat-1', start: 480, end: 540, subject: 'Physics', topic: 'Physics Weekend Revision', type: 'Revision / JEE' },
  { id: 'tt-sat-2', start: 540, end: 600, subject: 'Chemistry', topic: 'Chemistry Weekend Practice', type: 'Revision / JEE' },
  { id: 'tt-sat-3', start: 600, end: 660, subject: 'Mathematics', topic: 'Maths Weekend Practice', type: 'JEE Questions' },
];

export const defaultWeeklyTimetable = {
  Monday: monFriSlots.map(s => ({ ...s, id: `mon-${s.id}` })),
  Tuesday: monFriSlots.map(s => ({ ...s, id: `tue-${s.id}` })),
  Wednesday: monFriSlots.map(s => ({ ...s, id: `wed-${s.id}` })),
  Thursday: monFriSlots.map(s => ({ ...s, id: `thu-${s.id}` })),
  Friday: monFriSlots.map(s => ({ ...s, id: `fri-${s.id}` })),
  Saturday: satSunSlots.map(s => ({ ...s, id: `sat-${s.id}` })),
  Sunday: satSunSlots.map(s => ({ ...s, id: `sun-${s.id}` })),
};

export const timetableSeed = defaultWeeklyTimetable;

export const HISTORICAL_RATIOS = {};
export const historyDates = [];

export function genInitialStudyLog() {
  return [];
}

export const rewardCatalogSeed = [
  { id: 'r1', name: 'Favourite Meal Night', cost: 500, description: 'Pick dinner for the whole family.' },
  { id: 'r2', name: 'Movie / Entertainment Pass', cost: 1000, description: '2 hours of guilt-free screen time, or a movie outing.' },
  { id: 'r3', name: 'Small Gift', cost: 1500, description: 'Parent’s choice — a small gift under ₹500.' },
  { id: 'r4', name: 'Bigger Reward', cost: 3000, description: 'A bigger reward: gadget accessory, book set, or similar.' },
];

export const xpEventsSeed = [];

export const profileSettingsSeed = {
  studentName: 'Chiranjib Sahoo',
  classGrade: 'Class 11 PCM',
  jeeTargetRank: 100,
  cbseTargetPct: 98,
  parentPin: '', // empty means PIN protection disabled
  baseXP: 0,
};

// Set your Google Apps Script Web App URL here to enable zero-config auto-sync on all devices!
export const DEFAULT_GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwlt1atz8EsrFn9HEfxlZyxkQ5l0cQNbKmfNxSZQ2H2cOlrPjBvClfACy4jsZ_Ud-pI/exec';



