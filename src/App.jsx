import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, CheckCircle2, TrendingUp, Trophy, Award, ShieldCheck, Sparkles, Target 
} from 'lucide-react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TimetableView } from './components/TimetableView';
import { QuickCaptureView } from './components/QuickCaptureView';
import { TestResultsView } from './components/TestResultsView';
import { AnalyticsView } from './components/AnalyticsView';
import { RewardsView } from './components/RewardsView';
import { ParentView } from './components/ParentView';
import { SettingsModal } from './components/SettingsModal';
import { EditTestModal } from './components/EditTestModal';

import { SUBJECTS } from './data/subjects';
import { TODAY_DATE } from './utils/timeHelpers';
import { 
  loadStoredData, saveStoredData, exportBackupJSON, clearLocalStorage 
} from './utils/storage';
import { 
  fetchFromGoogleSheet, saveToGoogleSheet 
} from './utils/googleSync';
import { 
  levelInfo, plannedForDate, actualForDate, dailyRows, computeStreak, 
  computePeriodRewards, subjectStats, categoryStats, testXP, subjectHistory, pct 
} from './utils/analyticsHelpers';

export default function App() {
  const [storedData] = useState(() => loadStoredData());

  const [tab, setTab] = useState('dashboard');
  const [testResults, setTestResults] = useState(storedData.testResults);
  const [timetable, setTimetable] = useState(storedData.timetable);
  const [studyLog, setStudyLog] = useState(storedData.studyLog);
  const [xpEvents, setXpEvents] = useState(storedData.xpEvents);
  const [xpSpent, setXpSpent] = useState(storedData.xpSpent);
  const [redeemed, setRedeemed] = useState(storedData.redeemed);
  const [rewardCatalog, setRewardCatalog] = useState(storedData.rewardCatalog);
  const [givenPeriodRewards, setGivenPeriodRewards] = useState(storedData.givenPeriodRewards);
  const [profileSettings, setProfileSettings] = useState(storedData.profileSettings);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(storedData.googleSheetUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const [captureSubTab, setCaptureSubTab] = useState('study');
  const [testFilter, setTestFilter] = useState({ category: 'All', subject: 'All' });
  const [expandedTest, setExpandedTest] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);
  const [analyticsSubject, setAnalyticsSubject] = useState('Physics');
  const [dayBonusAwarded, setDayBonusAwarded] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Initial cloud fetch if Google Sheet URL exists
  useEffect(() => {
    if (googleSheetUrl) {
      handleSyncGoogleSheets(googleSheetUrl, true);
    }
  }, []);

  // Sync to LocalStorage + Cloud on every state update
  useEffect(() => {
    const currentState = {
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

    saveStoredData(currentState);

    if (googleSheetUrl) {
      saveToGoogleSheet(googleSheetUrl, currentState);
    }
  }, [testResults, timetable, studyLog, xpEvents, xpSpent, redeemed, rewardCatalog, givenPeriodRewards, profileSettings, googleSheetUrl]);

  async function handleSyncGoogleSheets(urlToSync, silent = false) {
    const targetUrl = urlToSync || googleSheetUrl;
    if (!targetUrl) return;
    setIsSyncing(true);
    const remoteData = await fetchFromGoogleSheet(targetUrl);
    setIsSyncing(false);
    if (remoteData) {
      if (remoteData.testResults) setTestResults(remoteData.testResults);
      if (remoteData.timetable) setTimetable(remoteData.timetable);
      if (remoteData.studyLog) setStudyLog(remoteData.studyLog);
      if (remoteData.xpEvents) setXpEvents(remoteData.xpEvents);
      if (remoteData.xpSpent !== undefined) setXpSpent(remoteData.xpSpent);
      if (remoteData.redeemed) setRedeemed(remoteData.redeemed);
      if (remoteData.rewardCatalog) setRewardCatalog(remoteData.rewardCatalog);
      if (remoteData.givenPeriodRewards) setGivenPeriodRewards(remoteData.givenPeriodRewards);
      if (remoteData.profileSettings) setProfileSettings(remoteData.profileSettings);
      if (!silent) alert('Successfully synced latest data from Google Sheets!');
    } else if (!silent) {
      alert('Could not fetch data from Google Sheet. Please check the Web App URL and permissions.');
    }
  }

  const baseXP = profileSettings.baseXP ?? 0;
  const totalEarned = baseXP + xpEvents.reduce((a, e) => a + e.xp, 0);
  const lvl = levelInfo(totalEarned);
  const availableXP = totalEarned - xpSpent;

  const dailyHistory = useMemo(() => dailyRows(timetable, studyLog), [timetable, studyLog]);
  const streak = useMemo(() => computeStreak(dailyHistory), [dailyHistory]);
  const todayPlanned = plannedForDate(timetable, TODAY_DATE);
  const todayActual = actualForDate(studyLog, TODAY_DATE);
  const todayCompletion = todayPlanned > 0 ? Math.round((todayActual / todayPlanned) * 100) : 0;

  const periodRewards = useMemo(() => computePeriodRewards(timetable, studyLog), [timetable, studyLog]);
  const isPeriodGiven = (pr) => givenPeriodRewards.some((g) => g.cycleId === pr.cycleId && g.rewardName === (pr.tier && pr.tier.name));
  const totalRewardsGiven = givenPeriodRewards.length + redeemed.length;

  const allSubjectStats = useMemo(() => SUBJECTS.map((s) => subjectStats(testResults, s.key)).filter(Boolean), [testResults]);
  const catStats = useMemo(() => ({
    School: categoryStats(testResults, 'School Test'),
    Institute: categoryStats(testResults, 'Institute Test'),
    PW: categoryStats(testResults, 'PW Test'),
  }), [testResults]);

  const bestRankTest = useMemo(() => {
    const withRank = testResults.filter((t) => t.rank);
    if (!withRank.length) return null;
    return withRank.reduce((best, t) => (t.rank < best.rank ? t : best));
  }, [testResults]);

  function addXpEvent(label, xp, date) {
    if (xp <= 0) return;
    setXpEvents((prev) => [{ id: `e${Date.now()}`, xp, label, date }, ...prev]);
  }

  function handleAddStudy(entry) {
    const newEntry = { id: `s${Date.now()}`, ...entry };
    const updatedLog = [newEntry, ...studyLog];
    setStudyLog(updatedLog);
    addXpEvent(`Logged ${entry.duration} min of ${entry.subject} (${entry.studyType})`, 10, entry.date);

    let extraMsg = '';
    if (entry.date === TODAY_DATE && !dayBonusAwarded) {
      const newTodayActual = actualForDate(updatedLog, TODAY_DATE);
      if (newTodayActual >= todayPlanned) {
        addXpEvent('Full day study target met', 50, entry.date);
        setDayBonusAwarded(true);
        extraMsg = ' Day target hit — +50 bonus XP!';
      }
    }
    setSaveMsg({ type: 'study', text: `Saved — +10 XP logged for ${entry.subject}.${extraMsg}` });
  }

  function handleDeleteStudy(id) {
    setStudyLog((prev) => prev.filter((e) => e.id !== id));
  }

  function handleAddTest(entry) {
    const prevTest = subjectHistory(testResults, entry.subject).slice(-1)[0];
    const newTest = { id: `t${Date.now()}`, ...entry };
    setTestResults((prev) => [...prev, newTest]);
    const xp = testXP(newTest, prevTest);
    const p = pct(newTest.marksObtained, newTest.maxMarks);
    if (xp > 0) addXpEvent(`${entry.subject} — ${entry.testName} scored ${p}%`, xp, entry.date);
    setSaveMsg({ type: 'test', text: `Saved — ${p}% recorded${xp ? `, +${xp} XP earned.` : '.'}` });
  }

  function handleUpdateTest(updatedTest) {
    setTestResults((prev) => prev.map((t) => (t.id === updatedTest.id ? updatedTest : t)));
  }

  function handleDeleteTest(id) {
    setTestResults((prev) => prev.filter((t) => t.id !== id));
  }

  function handleAddTimetableSlot(dow, slot) {
    setTimetable((prev) => ({
      ...prev,
      [dow]: [...(prev[dow] || []), slot].sort((a, b) => a.start - b.start),
    }));
  }

  function handleDeleteTimetableSlot(dow, slotId) {
    setTimetable((prev) => ({
      ...prev,
      [dow]: (prev[dow] || []).filter((s, idx) => (s.id ? s.id !== slotId : idx !== slotId)),
    }));
  }

  function handleRedeem(item) {
    if (availableXP < item.cost) return;
    setXpSpent((prev) => prev + item.cost);
    setRedeemed((prev) => [{ ...item, redeemedOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }, ...prev]);
  }

  function handleAddReward(name, cost) {
    if (!name || !cost) return;
    setRewardCatalog((prev) => [
      ...prev,
      { id: `r-custom-${Date.now()}`, name, cost: Number(cost), description: 'Custom reward added by student/parent.' },
    ]);
  }

  function handleDeleteReward(id) {
    setRewardCatalog((prev) => prev.filter((r) => r.id !== id));
  }

  function handleMarkPeriodGiven(pr) {
    if (!pr.tier || isPeriodGiven(pr)) return;
    setGivenPeriodRewards((prev) => [
      { id: `g${Date.now()}`, cycleId: pr.cycleId, period: pr.period, rewardName: pr.tier.name, givenOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) },
      ...prev,
    ]);
  }

  function handleSaveProfile(updatedProfile) {
    setProfileSettings(updatedProfile);
  }

  function handleExport() {
    exportBackupJSON({
      testResults,
      timetable,
      studyLog,
      xpEvents,
      xpSpent,
      redeemed,
      rewardCatalog,
      givenPeriodRewards,
      profileSettings,
    });
  }

  function handleImport(data) {
    if (data.testResults) setTestResults(data.testResults);
    if (data.timetable) setTimetable(data.timetable);
    if (data.studyLog) setStudyLog(data.studyLog);
    if (data.xpEvents) setXpEvents(data.xpEvents);
    if (data.xpSpent !== undefined) setXpSpent(data.xpSpent);
    if (data.redeemed) setRedeemed(data.redeemed);
    if (data.rewardCatalog) setRewardCatalog(data.rewardCatalog);
    if (data.givenPeriodRewards) setGivenPeriodRewards(data.givenPeriodRewards);
    if (data.profileSettings) setProfileSettings(data.profileSettings);
  }

  function handleResetDefaults() {
    clearLocalStorage();
    window.location.reload();
  }

  const BADGES = useMemo(() => {
    const physics = allSubjectStats.find((s) => s.subject === 'Physics');
    const extraBank = dailyHistory.reduce((a, d) => a + (d.actual - d.planned), 0);
    const bestDailyPct = Math.max(
      ...dailyHistory.map((d) => (d.planned > 0 ? (d.actual / d.planned) * 100 : 0)),
      todayPlanned > 0 ? (todayActual / todayPlanned) * 100 : 0
    );
    return [
      { id: 'b1', label: '7 Day Streak', icon: Flame, earned: streak >= 7, note: `${streak} days` },
      { id: 'b2', label: '30 Day Streak', icon: Flame, earned: streak >= 30, note: `${streak}/30 days` },
      { id: 'b3', label: '95%+ Timetable Day', icon: CheckCircle2, earned: bestDailyPct >= 95, note: `Best day ${Math.round(bestDailyPct)}%` },
      { id: 'b4', label: 'Major Improvement', icon: TrendingUp, earned: physics && physics.latest.pct - physics.history[0].pct >= 15, note: physics ? `Physics +${Math.round(physics.latest.pct - physics.history[0].pct)}%` : '' },
      { id: 'b5', label: 'PW Top-25 Rank', icon: Trophy, earned: testResults.some((t) => t.category === 'PW Test' && t.rank && t.rank <= 25), note: 'Mathematics #9' },
      { id: 'b6', label: 'School Excellence 90%+', icon: Award, earned: testResults.some((t) => t.category === 'School Test' && pct(t.marksObtained, t.maxMarks) >= 90), note: 'Mathematics 94%' },
      { id: 'b7', label: 'Rank Climb +15', icon: ShieldCheck, earned: true, note: 'Physics rank 38 → 21' },
      { id: 'b8', label: 'Extra Study Bank', icon: Sparkles, earned: extraBank >= 600, note: `${extraBank >= 0 ? '+' : ''}${Math.round(extraBank / 60)}h logged extra` },
    ];
  }, [streak, allSubjectStats, testResults, dailyHistory, todayActual, todayPlanned]);

  return (
    <div className="min-h-screen bg-[#0A1119] text-[#EDF1F7]">
      <Header
        profileSettings={profileSettings}
        streak={streak}
        googleSheetUrl={googleSheetUrl}
        onOpenSettings={() => setShowSettings(true)}
      />

      <Navigation tab={tab} setTab={setTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'dashboard' && (
          <DashboardView
            studentName={profileSettings.studentName}
            classGrade={profileSettings.classGrade}
            streak={streak}
            todayPlanned={todayPlanned}
            todayActual={todayActual}
            todayCompletion={todayCompletion}
            allSubjectStats={allSubjectStats}
            catStats={catStats}
            bestRankTest={bestRankTest}
            lvl={lvl}
            totalEarned={totalEarned}
            availableXP={availableXP}
            xpEvents={xpEvents}
            setTab={setTab}
            timetable={timetable}
            studyLog={studyLog}
            periodRewards={periodRewards}
            isPeriodGiven={isPeriodGiven}
            catalog={rewardCatalog}
            totalRewardsGiven={totalRewardsGiven}
          />
        )}

        {tab === 'timetable' && (
          <TimetableView
            timetable={timetable}
            studyLog={studyLog}
            onAddSlot={handleAddTimetableSlot}
            onDeleteSlot={handleDeleteTimetableSlot}
          />
        )}

        {tab === 'capture' && (
          <QuickCaptureView
            subTab={captureSubTab}
            setSubTab={setCaptureSubTab}
            onAddStudy={handleAddStudy}
            onDeleteStudy={handleDeleteStudy}
            onAddTest={handleAddTest}
            studyLog={studyLog}
            testResults={testResults}
            saveMsg={saveMsg}
            setSaveMsg={setSaveMsg}
          />
        )}

        {tab === 'tests' && (
          <TestResultsView
            testResults={testResults}
            filter={testFilter}
            setFilter={setTestFilter}
            expanded={expandedTest}
            setExpanded={setExpandedTest}
            setTab={setTab}
            onEditTest={(test) => setEditingTest(test)}
            onDeleteTest={handleDeleteTest}
          />
        )}

        {tab === 'analytics' && (
          <AnalyticsView
            testResults={testResults}
            allSubjectStats={allSubjectStats}
            catStats={catStats}
            bestRankTest={bestRankTest}
            subject={analyticsSubject}
            setSubject={setAnalyticsSubject}
          />
        )}

        {tab === 'rewards' && (
          <RewardsView
            lvl={lvl}
            totalEarned={totalEarned}
            availableXP={availableXP}
            streak={streak}
            xpEvents={xpEvents}
            badges={BADGES}
            catalog={rewardCatalog}
            redeemed={redeemed}
            onRedeem={handleRedeem}
            onAddReward={handleAddReward}
            onDeleteReward={handleDeleteReward}
            periodRewards={periodRewards}
            isPeriodGiven={isPeriodGiven}
            onMarkPeriodGiven={handleMarkPeriodGiven}
            totalRewardsGiven={totalRewardsGiven}
          />
        )}

        {tab === 'parent' && (
          <ParentView
            studentName={profileSettings.studentName}
            profileSettings={profileSettings}
            todayPlanned={todayPlanned}
            todayActual={todayActual}
            todayCompletion={todayCompletion}
            streak={streak}
            allSubjectStats={allSubjectStats}
            testResults={testResults}
            lvl={lvl}
            totalEarned={totalEarned}
            xpEvents={xpEvents}
            periodRewards={periodRewards}
            isPeriodGiven={isPeriodGiven}
            onMarkPeriodGiven={handleMarkPeriodGiven}
            totalRewardsGiven={totalRewardsGiven}
            availableXP={availableXP}
            catalog={rewardCatalog}
          />
        )}
      </main>

      {showSettings && (
        <SettingsModal
          profileSettings={profileSettings}
          googleSheetUrl={googleSheetUrl}
          onSaveProfile={handleSaveProfile}
          onSaveSheetUrl={(url) => setGoogleSheetUrl(url)}
          onExport={handleExport}
          onImport={handleImport}
          onResetDefaults={handleResetDefaults}
          onSyncGoogleSheets={(url) => handleSyncGoogleSheets(url, false)}
          isSyncing={isSyncing}
          onClose={() => setShowSettings(false)}
        />
      )}

      {editingTest && (
        <EditTestModal
          test={editingTest}
          onSave={handleUpdateTest}
          onClose={() => setEditingTest(null)}
        />
      )}
    </div>
  );
}
