# LOCK-ON — JEE + CBSE Performance Command Center

**Project documentation** · Last updated 10 Aug 2026

A single-file React application that tracks Chiranjib's Class 11 PCM study plan, test results, and rewards, built toward JEE Main/Advanced (target AIR < 100) and CBSE (target 98%+).

**Deliverable file:** `lockon-jee-tracker.jsx`
**Runs as:** a Claude.ai / Claude Code React artifact, or drop into any project with `react`, `recharts`, and `lucide-react` installed.

---

## 1. What it is

LOCK-ON is a front-end prototype — realistic seed data plus fully working state, but **no backend**. Everything lives in React state, so new entries (study sessions, tests, redeemed rewards) persist for the session but reset on a page refresh. It is not connected to Google Sheets or any database (unlike the separate NSFS Academy attendance system).

### Tech stack
| Layer | Choice |
|---|---|
| UI framework | React (hooks: `useState`, `useMemo`) |
| Charts | `recharts` (Line, Bar, ResponsiveContainer) |
| Icons | `lucide-react` |
| Styling | Tailwind utility classes for layout + a custom CSS-variable theme for color/type (arbitrary Tailwind color classes aren't used, since the artifact runtime only ships the precompiled base stylesheet) |
| Fonts | Space Grotesk (headings), Inter (body), IBM Plex Mono (numbers/data) — loaded via Google Fonts `@import` |
| Design language | Dark "mission control" palette, amber accent, a target-lock/reticle motif for rank tracking |

---

## 2. Screens

| Tab | Purpose |
|---|---|
| **Dashboard** | Today's live planned/actual, rank target-lock gauge, subject trend bars, School/Institute/PW averages, today's timetable strip, Reward Report summary, smart insights |
| **Timetable** | This week's day-by-day schedule with fixed blocks (school/coaching/PW) greyed out, live planned-vs-actual per slot, a 7-day chart, and a Weekly Live Comparison chart |
| **Quick Capture** | Two-tab fast entry: STUDY (subject, duration, topic, type) and TEST (category, subject, marks, rank, etc.) — both write straight into shared state |
| **Test & Results** | Filterable, expandable list of every test on record, with auto % and trend-vs-previous |
| **Analytics** | Per-subject trend chart, most-improved/highest/most-consistent stat cards, School vs Institute vs PW comparison, rank tracking, study↔score correlation |
| **Rewards** | Level/XP bar, XP → catalogue mapping, the Reward Report (Weekly/Monthly/Quarterly), badges, XP history, redeemable catalogue |
| **Parent View** | Plan-vs-actual summary, strong/weak subjects, the same Reward Report with the "Mark as Given" action |

---

## 3. Weekly schedule

Fixed (non-editable) blocks:

| Days | Blocks |
|---|---|
| Mon / Wed / Fri | School 7:00 AM–2:00 PM · Rest 2:00–4:00 PM · Coaching 5:30–7:30 PM |
| Tue / Thu | School 7:00 AM–2:00 PM · Rest 2:00–4:00 PM · Coaching 6:30–8:30 PM |
| Saturday | PW Coaching 7:00 AM–6:00 PM · Refresh 6:00–7:00 PM · Coaching 7:00–8:30 PM |
| Sunday | PW Coaching 7:00 AM–6:00 PM · Refresh 6:00–7:00 PM |

> **Note on Saturday evening coaching:** you gave two slightly different times for this (7:00–8:30 PM vs. 6:30–8:30 PM). I used **7:00–8:30 PM** because Refresh runs until 7:00 PM that day, and 6:30 PM would overlap it. Change the `fixedBlocksFor('Saturday')` block in the code if that's wrong.

Self-study slots fill only what's left. Daily core subjects (Physics, Chemistry, Mathematics) appear every day; English, IT, and PE rotate weekly (Tue/Wed/Fri/Sat/Sun). I verified programmatically that no self-study slot overlaps a fixed block.

Weekly planned self-study total: **30 hours** (300 min Mon/Wed/Fri, 240 min Tue/Thu, 210 min Sat/Sun).

---

## 4. Live actual-tracking (no manual ticks)

- Every timetable slot shows **Planned** time next to a live **Actual** time, with a green dot (actual ≥ planned) or red dot (not yet met).
- Actual time is computed automatically: `actualForDateSubject(studyLog, date, subject)` sums every Quick Capture study entry logged for that subject on that date. Logging a session in Quick Capture updates the Timetable and Dashboard instantly — nothing to check off by hand.
- **Weekly Live Comparison** chart aggregates the current week (Sun–Sat) against the prior week. Because the week boundary is Sunday, the current week's actual total effectively "resets" every Sunday, so each week compares cleanly against the last.
- **Streak** and **Extra Study Bank** are computed only from *completed* days (today is excluded while still in progress, so a partial day doesn't wrongly break the streak).

---

## 5. XP & Level system

XP is earned automatically, never entered manually:

| Action | XP |
|---|---|
| Log a study session (Quick Capture) | +10 |
| Full day's planned time met | +50 (once per day) |
| Test score 90%+ | +75 |
| Test score 95%+ | +100 |
| Test score 98%+ | +150 |
| Improve +5% over previous test in that subject | +50 |
| Improve +10% over previous test in that subject | +100 |

Levels use an uneven threshold ladder (20 levels, `Novice` → `Command Master`) so early levels come quickly and later ones take longer — e.g. Level 12 = 8,000–10,000 lifetime XP, titled "Consistent Performer."

---

## 6. Reward system — two separate mechanisms

**A. XP → Catalogue (student-redeemable):**
Available XP (lifetime earned − spent) can be redeemed against a customizable catalogue (seeded: Favourite Meal 500 XP, Movie Pass 1000 XP, Small Gift 1500 XP, Bigger Reward 3000 XP). Every screen showing XP also shows *"this unlocks: [reward]"* so it's clear what the balance actually buys, not just a number.

**B. Period Rewards (parent-facing "what to give"):**
Weekly / Monthly / Quarterly completion % is computed live from the timetable + study log, compared against tiers:

| Period | 90%+ | 95%+ | 100% |
|---|---|---|---|
| Weekly | Weekly Discipline Reward | Gold Study Reward | Perfect Week Reward |
| Monthly | Monthly Consistency Reward | Monthly Excellence Reward | Perfect Month Reward |
| Quarterly | Quarterly Momentum Reward | Quarterly Excellence Reward | Perfect Quarter Reward |

Once a tier is hit, a **"Mark as Given"** button appears. Clicking it (after the reward has actually been handed over) moves it to "Given" and adds to a **lifetime "Rewards Given" counter** shown on the Rewards and Parent View screens — this is the running achievement total, separate from XP.

> **Note on Monthly/Quarterly:** the seed data only covers ~2 weeks (26 Jul–8 Aug 2026), so these are genuinely *month-to-date* / *quarter-to-date* figures, labeled "(so far)" rather than treated as finished periods. They'll firm up as more real days get logged.

---

## 7. Data model (state shape)

| State | Shape |
|---|---|
| `testResults` | `{id, category, date, subject, testName, chapter, maxMarks, marksObtained, rank?, totalStudents?, difficulty, testType, notes}[]` |
| `studyLog` | `{id, date, subject, duration (min), topic, studyType}[]` |
| `xpEvents` | `{id, xp, label, date}[]` — the running XP feed |
| `rewardCatalog` | `{id, name, cost, description}[]` |
| `redeemed` | catalogue items claimed against XP |
| `givenPeriodRewards` | `{id, cycleId, period, rewardName, givenOn}[]` — the parent "given" log |
| `timetableSeed` | static template: per weekday, an array of `{start, end (minutes from midnight), subject, topic, type}` |

---

## 8. Known limitations

- **No persistence** — this is an in-memory prototype. Refreshing the page resets anything added this session (seed history stays).
- **Single-user** — no separate student/parent login; both views share the same state.
- **Saturday coaching timing** is an assumption (see §3) — quick one-line fix if wrong.
- **Sample data is illustrative**, not real test scores or study hours.

## 9. Natural next steps

- Wire this up to Google Sheets + Apps Script (the same pattern used for the NSFS Academy attendance system) for real cross-device persistence.
- Or use Claude artifact `window.storage` for lightweight personal/shared persistence without a full backend.
- Build out Login, Settings, and a standalone Goals screen (currently folded into Dashboard/Rewards).
