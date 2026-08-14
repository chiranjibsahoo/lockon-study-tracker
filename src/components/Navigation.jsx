import React from 'react';
import { BarChart3, Calendar, Zap, ClipboardList, TrendingUp, Trophy, Users } from 'lucide-react';
import { C } from '../data/subjects';

export const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'timetable', label: 'Timetable', icon: Calendar },
  { key: 'capture', label: 'Quick Capture', icon: Zap },
  { key: 'tests', label: 'Test & Results', icon: ClipboardList },
  { key: 'analytics', label: 'Analytics', icon: TrendingUp },
  { key: 'rewards', label: 'Rewards', icon: Trophy },
  { key: 'parent', label: 'Parent View', icon: Users },
];

export function Navigation({ tab, setTab }) {
  return (
    <div
      className="lk-scroll"
      style={{ borderBottom: `1px solid ${C.border}`, overflowX: 'auto', overflowY: 'hidden' }}
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center gap-1 py-1.5" style={{ minWidth: 'max-content' }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.key;
          return (
            <div
              key={t.key}
              className={`lk-tab ${isActive ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

