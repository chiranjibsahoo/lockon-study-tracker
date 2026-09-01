import { T, dowOf, TODAY_DATE } from '../utils/timeHelpers';

export const testResultsSeed = [];

export const defaultWeeklyTimetable = {
  Monday: [
    { id: 'mon-1', start: 390, end: 420, subject: 'English', topic: 'English Study', type: 'NCERT / School' },
    { id: 'mon-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Study', type: 'Concept Learning' },
    { id: 'mon-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Study', type: 'NCERT / Practice' },
    { id: 'mon-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Tuesday: [
    { id: 'tue-1', start: 390, end: 420, subject: 'IT', topic: 'IT Study', type: 'NCERT / School' },
    { id: 'tue-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Study', type: 'Concept Learning' },
    { id: 'tue-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Study', type: 'NCERT / Practice' },
    { id: 'tue-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Wednesday: [
    { id: 'wed-1', start: 390, end: 420, subject: 'PE', topic: 'PE Study', type: 'NCERT / School' },
    { id: 'wed-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Study', type: 'Concept Learning' },
    { id: 'wed-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Study', type: 'NCERT / Practice' },
    { id: 'wed-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Thursday: [
    { id: 'thu-1', start: 390, end: 420, subject: 'English', topic: 'English Study', type: 'NCERT / School' },
    { id: 'thu-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Study', type: 'Concept Learning' },
    { id: 'thu-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Study', type: 'NCERT / Practice' },
    { id: 'thu-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Friday: [
    { id: 'fri-1', start: 390, end: 420, subject: 'IT', topic: 'IT Study', type: 'NCERT / School' },
    { id: 'fri-2', start: 990, end: 1080, subject: 'Physics', topic: 'Physics Study', type: 'Concept Learning' },
    { id: 'fri-3', start: 1200, end: 1290, subject: 'Chemistry', topic: 'Chemistry Study', type: 'NCERT / Practice' },
    { id: 'fri-4', start: 1320, end: 1410, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Saturday: [
    { id: 'sat-1', start: 480, end: 540, subject: 'Physics', topic: 'Physics Study', type: 'Revision / JEE' },
    { id: 'sat-2', start: 540, end: 600, subject: 'Chemistry', topic: 'Chemistry Study', type: 'Revision / JEE' },
    { id: 'sat-3', start: 600, end: 660, subject: 'Mathematics', topic: 'Mathematics Study', type: 'JEE Questions' },
  ],
  Sunday: [
    { id: 'sun-1', start: 480, end: 540, subject: 'Physics', topic: 'Physics Study', type: 'Test Preparation' },
    { id: 'sun-2', start: 540, end: 600, subject: 'Chemistry', topic: 'Chemistry Study', type: 'Test Preparation' },
    { id: 'sun-3', start: 600, end: 660, subject: 'Mathematics', topic: 'Mathematics Study', type: 'Test Preparation' },
  ],
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



