import React from 'react';
import { Target, Flame, Settings } from 'lucide-react';
import { C } from '../data/subjects';

export function Header({ profileSettings, streak, onOpenSettings }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bgAlt }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.amberSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid #4A3A20`,
              boxShadow: '0 0 10px rgba(232, 163, 61, 0.2)',
              flexShrink: 0,
            }}
          >
            <Target size={18} style={{ color: C.amber }} />
          </div>
          <div className="min-w-0">
            <div className="lk-display flex items-center gap-2" style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.3 }}>
              LOCK&#8209;ON
            </div>
            <div className="lk-eyebrow hidden sm:block" style={{ marginBottom: 0 }}>
              JEE + CBSE Performance Command Center
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className="lk-chip hidden md:inline-flex" style={{ color: C.teal, background: C.tealSoft, borderColor: '#1E4A44' }}>
            CBSE {profileSettings.cbseTargetPct}%+
          </span>
          <span className="lk-chip hidden md:inline-flex" style={{ color: C.amber, background: C.amberSoft, borderColor: '#4A3A20' }}>
            JEE &lt;{profileSettings.jeeTargetRank}
          </span>
          <div className="flex items-center gap-1.5 lk-mono text-xs" style={{ color: C.textMute }}>
            <Flame size={14} style={{ color: streak >= 7 ? '#F0894A' : C.textFaint }} />
            <span className="font-bold" style={{ color: streak >= 7 ? '#F0894A' : C.textMute }}>{streak}d</span>
            <span className="hidden sm:inline">streak</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="lk-btn-ghost ml-1"
            style={{ padding: '7px 11px' }}
            title="Command Center Settings"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

