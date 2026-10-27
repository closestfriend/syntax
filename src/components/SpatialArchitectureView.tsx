import React, { useState } from 'react';
import { Box, Play, RefreshCw, Sparkles } from 'lucide-react';
import { SpatialArchitecture } from '../types/designSystem';

interface SpatialArchitectureViewProps {
  spatial: SpatialArchitecture;
}

export const SpatialArchitectureView: React.FC<SpatialArchitectureViewProps> = ({ spatial }) => {
  const [motionTrigger, setMotionTrigger] = useState(0);

  return (
    <div className="space-y-8">
      {/* Grid & Spacing Scale */}
      <div className="p-6 rounded-2xl bg-[#11131B] border border-[#1E2333]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E2333]">
          <div>
            <h3 className="font-heading text-lg font-bold text-white tracking-tight">
              Spatial Scale & Modular Rhythm
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Base unit: <span className="text-indigo-300 font-semibold">{spatial.gridBase}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {spatial.spacingScale.map((space) => {
            const pxNum = parseInt(space.pixels, 10) || 16;
            const barWidth = Math.min(pxNum * 5, 400);

            return (
              <div
                key={space.token}
                className="flex items-center justify-between p-3 rounded-xl bg-[#090A0F] border border-[#1C2030] hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center gap-4 w-44 shrink-0">
                  <span className="text-xs font-mono font-semibold text-white">
                    {space.token}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {space.pixels} ({space.rem})
                  </span>
                </div>

                {/* Visual Scale Bar */}
                <div className="flex-1 flex items-center px-4">
                  <div
                    style={{ width: `${barWidth}px` }}
                    className="h-3 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Border Radius Tokens & Elevation Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radii */}
        <div className="p-6 rounded-2xl bg-[#11131B] border border-[#1E2333]">
          <h3 className="font-heading text-base font-bold text-white tracking-tight mb-4">
            Corner Curvature Tokens
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {spatial.radii.map((r) => (
              <div
                key={r.token}
                className="p-4 bg-[#090A0F] border border-[#1E2333] flex flex-col items-center text-center group"
                style={{ borderRadius: r.value }}
              >
                <div
                  className="w-12 h-12 bg-indigo-600/30 border-2 border-indigo-500 mb-2 flex items-center justify-center text-indigo-300 text-xs font-mono"
                  style={{ borderRadius: r.value }}
                >
                  {r.value}
                </div>
                <div className="text-xs font-bold text-white font-mono">{r.token}</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">{r.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows & Lighting */}
        <div className="p-6 rounded-2xl bg-[#11131B] border border-[#1E2333]">
          <h3 className="font-heading text-base font-bold text-white tracking-tight mb-4">
            Atmospheric Shadows & Glows
          </h3>
          <div className="space-y-4">
            {spatial.shadows.map((sh) => (
              <div
                key={sh.token}
                className="p-4 rounded-xl bg-[#090A0F] border border-[#1C2030] flex items-center justify-between"
                style={{ boxShadow: sh.value }}
              >
                <div>
                  <div className="text-xs font-bold text-white font-mono">{sh.token}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{sh.style}</div>
                </div>
                <code className="text-[10px] font-mono text-indigo-300 max-w-[180px] truncate">
                  {sh.value}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motion & Easing Curves */}
      <div className="p-6 rounded-2xl bg-[#11131B] border border-[#1E2333]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base font-bold text-white tracking-tight">
              Kinetic Motion & Transition Timing
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Easing: <span className="text-indigo-300">{spatial.motion.easingDefault}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMotionTrigger((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Test Motion Physics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Duration Quick</span>
            <div className="text-sm font-bold text-white font-mono mt-0.5">{spatial.motion.durationQuick}</div>
            <p className="text-[11px] text-slate-400">Micro-toggles & press feedback</p>
          </div>

          <div className="p-3 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Duration Standard</span>
            <div className="text-sm font-bold text-white font-mono mt-0.5">{spatial.motion.durationStandard}</div>
            <p className="text-[11px] text-slate-400">Modals, dropdowns & cards</p>
          </div>

          <div className="p-3 rounded-xl bg-[#090A0F] border border-[#1C2030]">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Duration Deliberate</span>
            <div className="text-sm font-bold text-white font-mono mt-0.5">{spatial.motion.durationDeliberate || '400ms'}</div>
            <p className="text-[11px] text-slate-400">Full layout transitions & drawers</p>
          </div>
        </div>

        {/* Live Motion Physics Track */}
        <div className="p-4 rounded-xl bg-[#07080C] border border-[#1C2030] relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-3">
            <span>0% ORIGIN</span>
            <span>TIMING CURVE: {spatial.motion.easingDefault}</span>
            <span>100% TARGET</span>
          </div>

          <div className="h-10 w-full bg-[#11131B] rounded-lg relative flex items-center px-2">
            <div
              key={motionTrigger}
              className="h-7 w-16 rounded-md bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
              style={{
                transitionProperty: 'transform',
                transitionDuration: spatial.motion.durationStandard,
                transitionTimingFunction: spatial.motion.easingDefault,
                transform: motionTrigger % 2 === 1 ? 'translateX(calc(100% + 280px))' : 'translateX(0)',
              }}
            >
              SPRING
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
