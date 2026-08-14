import React from 'react';
import { Target } from 'lucide-react';
import { C } from '../data/subjects';

export function TargetLockGauge({ current, target, cohort, label }) {
  const size = 152;
  const r = 62;
  const cx = size / 2;
  const cy = size / 2;
  const progress = Math.max(0.06, Math.min(1, target / Math.max(current, target)));
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="reticle-glow flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="1" strokeDasharray="2 5" />
        <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke={C.panel2} strokeWidth="9" />
        <circle
          cx={cx}
          cy={cy}
          r={r - 12}
          fill="none"
          stroke={C.amber}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.86 * progress} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
        <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke={C.amber} strokeWidth="1.5" />
        <line x1={cx} y1={cy - 7} x2={cx} y2={cy + 7} stroke={C.amber} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={3} fill={C.amber} />
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill={C.text}
          fontFamily="'IBM Plex Mono', monospace"
        >
          #{current}
        </text>
        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fontSize="8.5"
          letterSpacing="1"
          fill={C.textFaint}
          fontFamily="'IBM Plex Mono', monospace"
        >
          CURRENT RANK
        </text>
      </svg>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="lk-eyebrow">{label}</div>
        <div className="flex items-baseline gap-2">
          <Target size={16} style={{ color: C.amber }} />
          <span className="lk-mono" style={{ fontSize: 20, color: C.amber, fontWeight: 700 }}>
            AIR &lt; {target}
          </span>
        </div>
        <div className="text-sm mt-0.5" style={{ color: C.textMute }}>
          Best rank <span className="lk-mono font-bold" style={{ color: C.positive }}>#{current}</span> of {cohort} in JEE-pattern mocks
        </div>
        <div className="text-xs mt-1" style={{ color: C.textFaint }}>
          Target-rank framing is a milestone within this test cohort, not a guaranteed AIR.
        </div>
      </div>
    </div>
  );
}
