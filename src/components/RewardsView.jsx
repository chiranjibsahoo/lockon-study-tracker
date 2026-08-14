import React, { useState } from 'react';
import { 
  Trophy, FileText, Award, Gift, Plus, Clock, Lock, CheckCircle2, 
  Circle, Trash2 
} from 'lucide-react';
import { C } from '../data/subjects';
import { fmtDate } from '../utils/timeHelpers';
import { XpRewardStrip } from './XpRewardStrip';

export function RewardsView({
  lvl,
  totalEarned,
  availableXP,
  streak,
  xpEvents,
  badges,
  catalog,
  redeemed,
  onRedeem,
  onAddReward,
  onDeleteReward,
  periodRewards,
  isPeriodGiven,
  onMarkPeriodGiven,
  totalRewardsGiven,
}) {
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const progress = ((totalEarned - lvl.floor) / (lvl.next - lvl.floor)) * 100;

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle eyebrow="Automatic achievements" title="Rewards & Achievements" icon={Trophy} />

      <Panel>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="lk-eyebrow">Current Level</div>
            <div className="lk-display" style={{ fontSize: 26, fontWeight: 700 }}>
              LEVEL {lvl.level} <span style={{ fontSize: 15, color: C.amber, fontWeight: 600 }}>&middot; {lvl.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="lk-mono lk-display" style={{ fontSize: 20, fontWeight: 700, color: C.amber }}>
                {availableXP.toLocaleString()}
              </div>
              <div className="lk-eyebrow" style={{ marginBottom: 0 }}>Available XP</div>
            </div>
            <div className="text-center">
              <div className="lk-mono lk-display" style={{ fontSize: 20, fontWeight: 700, color: C.teal }}>
                {totalRewardsGiven}
              </div>
              <div className="lk-eyebrow" style={{ marginBottom: 0 }}>Rewards Given</div>
            </div>
            <div className="text-center">
              <div className="lk-mono lk-display" style={{ fontSize: 20, fontWeight: 700, color: '#F0894A' }}>
                {streak}d
              </div>
              <div className="lk-eyebrow" style={{ marginBottom: 0 }}>Streak</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={progress} height={10} />
          <div className="lk-mono text-xs mt-1.5" style={{ color: C.textFaint }}>
            {totalEarned.toLocaleString()} / {lvl.next.toLocaleString()} XP to Level {lvl.level + 1}
          </div>
        </div>

        <XpRewardStrip availableXP={availableXP} catalog={catalog} />
      </Panel>

      <Panel>
        <SectionTitle eyebrow="What to actually give, and when" title="Reward Report" icon={FileText} />
        <div className="flex flex-col gap-2.5">
          {periodRewards.map((pr) => (
            <PeriodRewardRow
              key={pr.period}
              pr={pr}
              given={isPeriodGiven(pr)}
              onMarkGiven={onMarkPeriodGiven}
            />
          ))}
        </div>
        <div className="text-xs mt-3" style={{ color: C.textFaint }}>
          Weekly/Monthly/Quarterly % recalculates live from Quick Capture entries. Once a tier is hit, mark it Given after handing over the reward.
        </div>
      </Panel>

      <Panel>
        <SectionTitle title="Badges" icon={Award} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className="flex flex-col items-center text-center p-3 rounded-xl transition-all"
                style={{
                  background: b.earned ? C.amberSoft : C.bgAlt,
                  border: `1px solid ${b.earned ? '#4A3A20' : C.border}`,
                  opacity: b.earned ? 1 : 0.55,
                }}
              >
                {b.earned ? (
                  <Icon size={22} style={{ color: C.amber }} />
                ) : (
                  <Lock size={20} style={{ color: C.textFaint }} />
                )}
                <div className="text-xs font-semibold mt-2">{b.label}</div>
                <div className="lk-mono text-[10px] mt-0.5" style={{ color: C.textFaint }}>
                  {b.note}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <SectionTitle title="Recent XP History" icon={Clock} />
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto lk-scroll pr-1">
            {xpEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between text-sm p-2.5 rounded-lg"
                style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
              >
                <div>
                  <div style={{ color: C.text }}>{e.label}</div>
                  <div className="text-xs" style={{ color: C.textFaint }}>
                    {fmtDate(e.date)}
                  </div>
                </div>
                <span className="lk-mono font-semibold" style={{ color: C.amber }}>
                  +{e.xp} XP
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="Reward Catalogue" icon={Gift} />
          <div className="flex flex-col gap-2 mb-3">
            {catalog.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 rounded-lg flex-wrap gap-2"
                style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
              >
                <div className="flex-1 min-w-[140px]">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs" style={{ color: C.textFaint }}>{r.description}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="lk-mono text-xs" style={{ color: C.teal }}>{r.cost} XP</span>
                  <button
                    className="lk-btn"
                    style={{ padding: '6px 11px', fontSize: 11.5 }}
                    disabled={availableXP < r.cost}
                    onClick={() => onRedeem(r)}
                  >
                    Redeem
                  </button>
                  {onDeleteReward && r.id.startsWith('r-custom') && (
                    <button
                      onClick={() => onDeleteReward(r.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Remove reward"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 flex-wrap" style={{ borderTop: `1px solid ${C.border}` }}>
            <input
              className="lk-input"
              style={{ flex: 1, minWidth: 120 }}
              placeholder="New reward name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="lk-input"
              style={{ width: 90 }}
              type="number"
              placeholder="XP"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
            />
            <button
              className="lk-btn-ghost"
              onClick={() => {
                if (newName && newCost) {
                  onAddReward(newName, newCost);
                  setNewName('');
                  setNewCost('');
                }
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {redeemed.length > 0 && (
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="lk-eyebrow">Redeemed Catalogue Items</div>
              <div className="flex flex-col gap-1 mt-1">
                {redeemed.map((r, i) => (
                  <div key={i} className="text-xs flex items-center justify-between" style={{ color: C.textMute }}>
                    <span>{r.name}</span>
                    <span className="lk-mono" style={{ color: C.textFaint }}>{r.redeemedOn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
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

function ProgressBar({ value, color = C.amber, track = C.panel2, height = 8 }) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width .4s ease',
        }}
      />
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

function PeriodRewardRow({ pr, given, onMarkGiven }) {
  const earned = !!pr.tier;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg flex-wrap"
      style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
    >
      <div style={{ minWidth: 80, flexShrink: 0 }}>
        <div className="lk-eyebrow" style={{ marginBottom: 1 }}>{pr.period}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>{pr.cycleLabel}</div>
      </div>

      <div style={{ minWidth: 80, flex: '1 1 80px', maxWidth: 160 }}>
        <ProgressBar value={pr.pctVal} color={earned ? C.positive : C.amber} height={7} />
      </div>

      <div className="lk-mono text-xs flex-shrink-0" style={{ width: 40, color: earned ? C.positive : C.textMute }}>
        {pr.pctVal}%
      </div>

      <div className="flex-1 min-w-[100px] text-sm font-medium" style={{ color: earned ? C.text : C.textFaint }}>
        {earned ? pr.tier.name : `Needs 90%+ (${pr.next ? `${(pr.next.min - pr.pctVal).toFixed(1)}% to go` : ''})`}
      </div>

      {earned && (
        given ? (
          <Chip color={C.positive} bg={C.positiveSoft} border="#1E4A38">
            <CheckCircle2 size={11} style={{ marginRight: 4 }} /> Given
          </Chip>
        ) : (
          <button
            className="lk-btn"
            style={{ padding: '6px 12px', fontSize: 11.5 }}
            onClick={() => onMarkGiven(pr)}
          >
            <Circle size={12} /> Mark as Given
          </button>
        )
      )}
    </div>
  );
}

