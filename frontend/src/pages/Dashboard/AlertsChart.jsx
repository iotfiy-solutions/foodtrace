// src/components/AlertsChart.jsx

import { useMemo, useState } from "react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CustomTooltip } from "./CustomToolTip";


/**
 * Props:
 *  - venues: normalized venues array from alerts slice
 *    each item shape: { venueId, venueName, odourAlertCount, humidityAlertCount, temperatureAlertCount, ... }
 *  - defaultMode: "odour" | "humidity" | "temperature"
//  */
// export default function AlertsChart({ venues = [], defaultMode = "odour" }) {
//   const [mode, setMode] = useState(defaultMode ?? "odour");

export default function AlertsChart({ venues = [], defaultMode = "battery" }) {
  const [mode, setMode] = useState(defaultMode ?? "battery");
const [open, setOpen] = useState(false);


  // const data = useMemo(() => {
  //   return (venues || []).map((v) => ({
  //     // keep name for internal use but we won't show it on X axis
  //     name: v.venueName || v.venueId || "Unknown",
  //     value:
  //       mode === "odour"
  //         ? Number(v.odourAlertCount || 0)
  //         : mode === "humidity"
  //         ? Number(v.humidityAlertCount || 0)
  //         : Number(v.temperatureAlertCount || 0),
  //     venueId: v.venueId,
  //   }));
  // }, [venues, mode]);

    // compute chart data from venues + current mode
  const data = useMemo(() => {
    return (venues || []).map((v) => ({
      name: v.venueName || v.venueId || "Unknown",
      value:
        mode === "battery"
          ? Number(v.batteryAlertCount || 0)
          : Number(v.refrigeratorAlertCount || 0),
      venueId: v.venueId,
    }));
  }, [venues, mode]);

  return (
    // <div className="w-full bg-white rounded-xl p-4 shadow-sm">
 <div className="relative">
  <ResponsiveContainer width="100%" >
    <div className="w-full">
      <div className="flex items-center justify-between px-3">

  <p className="text-gray-500 text-sm font-semibold ">Organization Alerts</p>
      
      {/* Header */}
      {/* <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select alert type"
          >
            <option value="battery">Battery</option>
            <option value="refrigerator">Refrigerator</option>
          </select>
        </div>
      </div> */}

<div className="flex items-center justify-end  relative">
  {/* Trigger */}
  <button
    onClick={() => setOpen((prev) => !prev)}
    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm shadow-sm hover:bg-gray-200 transition"
  >
    {mode === "battery" ? "Battery Low" : "Need Maintenance"}

    {/* Arrow */}
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown */}
  {open && (
    <div className="absolute right-0 mt-10 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
      <button
        onClick={() => {
          setMode("battery");
          setOpen(false);
        }}
        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
          mode === "battery" ? "bg-gray-100 font-medium" : ""
        }`}
      >
        Battery Low
      </button>

      <button
        onClick={() => {
          setMode("refrigerator");
          setOpen(false);
        }}
        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
          mode === "refrigerator" ? "bg-gray-100 font-medium" : ""
        }`}
      >
        Need Maintenance
      </button>
    </div>
  )}
</div>

</div>

      {/* E. Analytics Chart (new design) */}
      <div className="relative mt-3 min-h-[120px] max-h-[130px] xl:h-[135px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            // tiny remount trick so Recharts updates reliably when mode changes
            key={`alerts-chart-${mode}`}
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              // bottom: 5,
            }}
          >
            <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />


            {/* hide X axis labels (no venue name/number under bars) */}
         {/* <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            /> */}
            {/* <YAxis hide /> */}
            {/* <Tooltip
              cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
              contentStyle={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            /> */}
            <Tooltip
          cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
          content={<CustomTooltip />}
        />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="value"
              radius={[32, 32, 32, 32]}
              barSize={26}
              fill="url(#barGradient)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
        </ResponsiveContainer>
</div>
  );
}
