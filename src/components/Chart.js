import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
const Chart = (props) => {
    const convertString = (d) => {
        return new Date(d * 1000).getHours();
    };
      // Chart tooltip handleing onHover
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
        return (
            <div className="chart-desc">
            <div>
                <p>
                {convertString(label) === 0
                    ? `${12} am`
                    : convertString(label) === 12
                    ? `${12} pm`
                    : convertString(label) > 0 && convertString(label) < 12
                    ? `${convertString(label) % 12} am`
                    : `${convertString(label) % 12} pm`}
                </p>
            </div>
            <div>
                <p>
                Temperature: <strong>{Math.round(payload[0].value)}°C</strong>
                </p>
            </div>
            </div>
        );
        }
        return null;
    };
    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={props.cordData?.hourly.slice(0, 12)}>
                <Area
                  activeDot={{ strokeWidth: 2, r: 7 }}
                  type="monotone"
                  dataKey="temp"
                  stroke="#008ffb"
                  strokeWidth="5"
                  fill="#bbe1fe"
                />

                <XAxis
                  interval="preserveStartEnd"
                  axisLine={false}
                  tickLine={false}
                  dataKey="dt"
                  tickFormatter={(dt) => {
                    if (convertString(dt) === 12 || convertString(dt) === 0) {
                      return 12;
                    }
                    return convertString(dt) % 12;
                  }}
                />

                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid opacity={0.8} vertical={false} />
              </AreaChart>
            </ResponsiveContainer>
        </>
    );
}
export default Chart;