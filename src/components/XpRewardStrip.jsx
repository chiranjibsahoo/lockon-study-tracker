import React from 'react';
import { Wallet } from 'lucide-react';
import { C } from '../data/subjects';

export function XpRewardStrip({ availableXP, catalog }) {
  const sorted = [...catalog].sort((a, b) => a.cost - b.cost);
  const affordable = sorted.filter((r) => r.cost <= availableXP);
  const best = affordable[affordable.length - 1] || null;
  const next = sorted.find((r) => r.cost > availableXP) || null;

  return (
    <div
      className="flex items-center gap-2 flex-wrap text-xs mt-2 px-3 py-2 rounded-lg"
      style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
    >
      <Wallet size={13} style={{ color: C.amber, flexShrink: 0 }} />
      {best ? (
        <span style={{ color: C.textMute }}>
          Right now this unlocks <b style={{ color: C.positive }}>{best.name}</b> ({best.cost} XP)
        </span>
      ) : (
        <span style={{ color: C.textMute }}>Not enough XP for a catalogue reward yet</span>
      )}
      {next && (
        <span style={{ color: C.textFaint }}>
          &middot; next: <b style={{ color: C.amber }}>{next.name}</b> in {next.cost - availableXP} XP
        </span>
      )}
    </div>
  );
}
