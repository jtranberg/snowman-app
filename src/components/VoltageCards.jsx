import React from "react";

function Val({ v }) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  // keep it tight like your temp cards (no 'V' suffix if it overflows)
  return Number(v).toFixed(2);
}

export default function VoltageCards({ voltA, voltB, voltC }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
      <div className="rounded-2xl p-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] shadow">
        <div className="text-sm opacity-80">Stage A Voltage</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          <Val v={voltA} />
        </div>
        <div className="text-xs opacity-60 mt-1">LV rail monitor</div>
      </div>

      <div className="rounded-2xl p-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] shadow">
        <div className="text-sm opacity-80">Stage B Voltage</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          <Val v={voltB} />
        </div>
        <div className="text-xs opacity-60 mt-1">LV rail monitor</div>
      </div>

      <div className="rounded-2xl p-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] shadow">
        <div className="text-sm opacity-80">Stage C Voltage</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          <Val v={voltC} />
        </div>
        <div className="text-xs opacity-60 mt-1">LV rail monitor</div>
      </div>
    </div>
  );
}
