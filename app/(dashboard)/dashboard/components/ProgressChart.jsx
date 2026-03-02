"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const PROGRESS_COLOR = {
  improving:  { stroke: "#10b981", fill: "#d1fae5", label: "Improving",  icon: TrendingUp,   text: "text-emerald-600" },
  stagnant:   { stroke: "#f59e0b", fill: "#fef3c7", label: "Stagnant",   icon: Minus,        text: "text-amber-600"   },
  regressing: { stroke: "#f43f5e", fill: "#ffe4e6", label: "Regressing", icon: TrendingDown, text: "text-rose-600"    },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score  = payload[0]?.value;
  const status = payload[0]?.payload?.status;
  const cfg    = PROGRESS_COLOR[status] ?? PROGRESS_COLOR.stagnant;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-bold text-gray-900">Score: {score?.toFixed(1)}/10</p>
      <p className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</p>
    </div>
  );
}

export default function ProgressChart({ progress }) {
  if (!progress || progress.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <TrendingUp className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium">Not enough data yet</p>
        <p className="text-gray-400 text-xs mt-1">Log at least 2 sessions to see the progress chart</p>
      </div>
    );
  }

  const chartData = progress.map((p, i) => ({
    name:   `Session ${i + 1}`,
    score:  p.score,
    status: p.status,
    date:   new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
  }));

  // Determine overall trend
  const first = chartData[0].score;
  const last  = chartData[chartData.length - 1].score;
  const diff  = last - first;
  const overallStatus = diff >= 1 ? "improving" : diff <= -1 ? "regressing" : "stagnant";
  const cfg = PROGRESS_COLOR[overallStatus];
  const TrendIcon = cfg.icon;

  return (
    <div className="space-y-4">
      {/* Trend summary */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${
        overallStatus === "improving"  ? "bg-emerald-50 border-emerald-200" :
        overallStatus === "regressing" ? "bg-rose-50 border-rose-200"      :
                                         "bg-amber-50 border-amber-200"
      }`}>
        <TrendIcon className={`h-5 w-5 ${cfg.text} flex-shrink-0`} />
        <div>
          <p className={`text-sm font-bold ${cfg.text}`}>Overall Trend: {cfg.label}</p>
          <p className="text-xs text-gray-500">
            From {first.toFixed(1)} → {last.toFixed(1)} over {progress.length} snapshots
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={cfg.stroke} stopOpacity={0.3} />
              <stop offset="95%" stopColor={cfg.stroke} stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={7} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Good", fontSize: 10, fill: "#10b981" }} />
          <ReferenceLine y={4} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Watch", fontSize: 10, fill: "#f59e0b" }} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={cfg.stroke}
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
            dot={{ r: 4, fill: cfg.stroke, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: cfg.stroke }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />≥7 Good</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block rounded" />4–6 Watch</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400 inline-block rounded" />&lt;4 Concern</span>
      </div>
    </div>
  );
}