import React, { useState } from 'react';
import { SpatialArchitecture } from '../types/designSystem';

interface SpatialArchitectureViewProps {
  spatial: SpatialArchitecture;
}

export const SpatialArchitectureView: React.FC<SpatialArchitectureViewProps> = ({ spatial }) => {
  const [motionTrigger, setMotionTrigger] = useState(0);

  const maxPx = Math.max(...spatial.spacingScale.map((s) => parseInt(s.pixels, 10) || 1), 1);

  return (
    <div className="space-y-14">
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="eyebrow">spatial rhythm</div>
            <h3 className="serif text-[25px] mt-2">space between things</h3>
          </div>
          <p className="mono text-[11px] text-[var(--ink-faint)]">
            base unit · {spatial.gridBase}
          </p>
        </div>

        <div className="mt-5 border-t border-[var(--rule)]">
          {spatial.spacingScale.map((space) => {
            const pxNum = parseInt(space.pixels, 10) || 1;
            const width = Math.max((pxNum / maxPx) * 100, 2);

            return (
              <div
                key={space.token}
                className="py-3.5 border-b border-[var(--rule)] flex items-center gap-4 sm:gap-8"
              >
                <div className="w-32 sm:w-40 shrink-0">
                  <div className="mono text-[11px] text-[var(--ink)]">{space.token}</div>
                  <div className="mono text-[10px] text-[var(--ink-faint)] mt-0.5">
                    {space.pixels} · {space.rem}
                  </div>
                </div>

                <div className="flex-1 h-px bg-[var(--rule)] relative">
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[7px] rounded-sm"
                    style={{ width: `${width}%`, backgroundColor: 'var(--rule-strong)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section>
          <div className="eyebrow">corners</div>
          <h4 className="serif text-[21px] mt-2">soft corners, one pill for tags</h4>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {spatial.radii.map((r) => (
              <div key={r.token} className="card p-4">
                <div
                  className="w-10 h-10 border border-[var(--rule-strong)] bg-[var(--ground)]"
                  style={{ borderRadius: r.value }}
                />
                <div className="mono text-[11px] text-[var(--ink)] mt-3">{r.token}</div>
                <div className="mono text-[10px] text-[var(--ink-faint)] mt-0.5">{r.value}</div>
                <div className="text-[11.5px] text-[var(--ink-soft)] mt-1.5">{r.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="eyebrow">depth</div>
          <h4 className="serif text-[21px] mt-2">tonal, not theatrical</h4>

          <div className="mt-5 space-y-3">
            {spatial.shadows.map((sh) => (
              <div
                key={sh.token}
                className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)]"
                style={{ boxShadow: sh.value }}
              >
                <div className="mono text-[11px] text-[var(--ink)]">{sh.token}</div>
                <div className="text-[11.5px] text-[var(--ink-soft)] mt-1">
                  {sh.style || 'resting elevation'}
                </div>
                <div className="mono text-[9.5px] text-[var(--ink-faint)] mt-2 truncate">
                  {sh.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="eyebrow">motion</div>
            <h4 className="serif text-[21px] mt-2">slow ease out, no bounce</h4>
            <p className="mono text-[10.5px] text-[var(--ink-faint)] mt-1">
              {spatial.motion.easingDefault}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMotionTrigger((prev) => prev + 1)}
            className="btn-secondary text-[12px]"
          >
            test the drift
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 border-t border-[var(--rule)]">
          {[
            { label: 'quick', value: spatial.motion.durationQuick, note: 'press feedback' },
            { label: 'standard', value: spatial.motion.durationStandard, note: 'cards and panels' },
            { label: 'deliberate', value: spatial.motion.durationDeliberate || '400ms', note: 'drawers and layout' },
          ].map((d) => (
            <div key={d.label} className="py-4 sm:pr-6 border-b sm:border-b-0 border-[var(--rule)]">
              <div className="eyebrow">{d.label}</div>
              <div className="mono text-[13px] text-[var(--ink)] mt-1">{d.value}</div>
              <div className="text-[11.5px] text-[var(--ink-faint)] mt-0.5">{d.note}</div>
            </div>
          ))}
        </div>

        <div className="sunken mt-4 p-4">
          <div className="flex items-center justify-between mono text-[9.5px] text-[var(--ink-faint)]">
            <span>origin</span>
            <span>{spatial.motion.easingDefault}</span>
            <span>target</span>
          </div>

          <div className="mt-3 h-9 relative">
            <div
              className="absolute left-2 top-1/2 px-3 py-1 rounded-md bg-[var(--paper)] border border-[var(--rule-strong)] mono text-[10px] text-[var(--ink-soft)]"
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: spatial.motion.durationStandard,
                transitionTimingFunction: spatial.motion.easingDefault,
                transform: `translateY(-50%) translateX(${motionTrigger % 2 === 1 ? 12 : 0}px)`,
                opacity: motionTrigger % 2 === 1 ? 0.65 : 1,
              }}
            >
              drift
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
