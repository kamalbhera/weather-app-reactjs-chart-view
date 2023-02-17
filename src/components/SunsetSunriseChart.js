import React from 'react'
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
  } from "recharts";
const SunsetSunriseChart = (props) => {
    const SunTooltip = ({ active, label }) => {
        if (active) {
          return (
            <div>
              {label.slice(-2) === "am" ? (
                <div className="sun-graph">
                  <strong>Sunrise</strong>
                  <p>{label}</p>
                </div>
              ) : label.slice(-2) === "pm" ? (
                <div className="sun-graph">
                  <strong>Sunset</strong>
                  <p>{label}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        }
        return null;
    };
    return (
        <>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={props.sunData}>
                <defs>
                  <linearGradient id="sun-color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="20%" stopColor="#f5e3be" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#f5e3be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="sun"
                  padding={{ left: 30, right: 30 }}
                  tickLine={false}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#eccb87"
                  fillOpacity={1}
                  fill="url(#sun-color)"
                />
                <Tooltip content={<SunTooltip />} />
              </AreaChart>
            </ResponsiveContainer>  
        </>
    )
}
export default SunsetSunriseChart