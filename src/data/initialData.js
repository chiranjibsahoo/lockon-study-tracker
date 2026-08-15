import { T, dowOf, TODAY_DATE } from '../utils/timeHelpers';

export const testResultsSeed = [];

export const timetableSeed = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

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

