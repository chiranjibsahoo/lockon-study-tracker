import { testResultsSeed, timetableSeed, genInitialStudyLog, rewardCatalogSeed, xpEventsSeed, profileSettingsSeed } from '../data/initialData';

const KEYS = {
  TEST_RESULTS: 'lockon_test_results_v1',
  STUDY_LOG: 'lockon_study_log_v1',
  TIMETABLE: 'lockon_timetable_v1',
  XP_EVENTS: 'lockon_xp_events_v1',
  XP_SPENT: 'lockon_xp_spent_v1',
  REDEEMED: 'lockon_redeemed_v1',
  CATALOG: 'lockon_catalog_v1',
  GIVEN_PERIOD_REWARDS: 'lockon_given_rewards_v1',
  PROFILE_SETTINGS: 'lockon_profile_settings_v1',
  GOOGLE_SHEET_URL: 'lockon_google_sheet_url_v1',
};

export function loadStoredData() {
  try {
    const testResults = localStorage.getItem(KEYS.TEST_RESULTS)
      ? JSON.parse(localStorage.getItem(KEYS.TEST_RESULTS))
      : testResultsSeed;

    const timetable = localStorage.getItem(KEYS.TIMETABLE)
      ? JSON.parse(localStorage.getItem(KEYS.TIMETABLE))
      : timetableSeed;

    const studyLog = localStorage.getItem(KEYS.STUDY_LOG)
      ? JSON.parse(localStorage.getItem(KEYS.STUDY_LOG))
      : genInitialStudyLog(timetable);

    const xpEvents = localStorage.getItem(KEYS.XP_EVENTS)
      ? JSON.parse(localStorage.getItem(KEYS.XP_EVENTS))
      : xpEventsSeed;

    const xpSpent = localStorage.getItem(KEYS.XP_SPENT)
      ? JSON.parse(localStorage.getItem(KEYS.XP_SPENT))
      : 0;

    const redeemed = localStorage.getItem(KEYS.REDEEMED)
      ? JSON.parse(localStorage.getItem(KEYS.REDEEMED))
      : [];

    const rewardCatalog = localStorage.getItem(KEYS.CATALOG)
      ? JSON.parse(localStorage.getItem(KEYS.CATALOG))
      : rewardCatalogSeed;

    const givenPeriodRewards = localStorage.getItem(KEYS.GIVEN_PERIOD_REWARDS)
      ? JSON.parse(localStorage.getItem(KEYS.GIVEN_PERIOD_REWARDS))
      : [];

    const profileSettings = localStorage.getItem(KEYS.PROFILE_SETTINGS)
      ? JSON.parse(localStorage.getItem(KEYS.PROFILE_SETTINGS))
      : profileSettingsSeed;

    let googleSheetUrl = localStorage.getItem(KEYS.GOOGLE_SHEET_URL) || '';

    // Check URL parameters for syncUrl or sheetUrl
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const paramUrl = urlParams.get('syncUrl') || urlParams.get('sheetUrl');
      if (paramUrl && paramUrl.trim()) {
        googleSheetUrl = paramUrl.trim();
        try {
          localStorage.setItem(KEYS.GOOGLE_SHEET_URL, googleSheetUrl);
        } catch (e) {}
      }
    }

    return {
      testResults,
      timetable,
      studyLog,
      xpEvents,
      xpSpent,
      redeemed,
      rewardCatalog,
      givenPeriodRewards,
      profileSettings,
      googleSheetUrl,
    };
  } catch (err) {
    console.error('Failed to load stored data, falling back to defaults:', err);
    return {
      testResults: testResultsSeed,
      timetable: timetableSeed,
      studyLog: genInitialStudyLog(timetableSeed),
      xpEvents: xpEventsSeed,
      xpSpent: 0,
      redeemed: [],
      rewardCatalog: rewardCatalogSeed,
      givenPeriodRewards: [],
      profileSettings: profileSettingsSeed,
    };
  }
}

export function saveStoredData(data) {
  try {
    if (data.testResults) localStorage.setItem(KEYS.TEST_RESULTS, JSON.stringify(data.testResults));
    if (data.timetable) localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(data.timetable));
    if (data.studyLog) localStorage.setItem(KEYS.STUDY_LOG, JSON.stringify(data.studyLog));
    if (data.xpEvents) localStorage.setItem(KEYS.XP_EVENTS, JSON.stringify(data.xpEvents));
    if (data.xpSpent !== undefined) localStorage.setItem(KEYS.XP_SPENT, JSON.stringify(data.xpSpent));
    if (data.redeemed) localStorage.setItem(KEYS.REDEEMED, JSON.stringify(data.redeemed));
    if (data.rewardCatalog) localStorage.setItem(KEYS.CATALOG, JSON.stringify(data.rewardCatalog));
    if (data.givenPeriodRewards) localStorage.setItem(KEYS.GIVEN_PERIOD_REWARDS, JSON.stringify(data.givenPeriodRewards));
    if (data.profileSettings) localStorage.setItem(KEYS.PROFILE_SETTINGS, JSON.stringify(data.profileSettings));
    if (data.googleSheetUrl !== undefined) localStorage.setItem(KEYS.GOOGLE_SHEET_URL, data.googleSheetUrl);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function exportBackupJSON(allState) {
  const payload = {
    app: 'LOCK-ON Command Center',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: allState,
  };
  const str = JSON.stringify(payload, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lockon-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function clearLocalStorage() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
