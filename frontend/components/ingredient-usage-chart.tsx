"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Mock data for the chart
const data = [
  { date: "May 1", usage: 2.5 },
  { date: "May 5", usage: 3.2 },
  { date: "May 10", usage: 1.8 },
  { date: "May 15", usage: 4.0 },
  { date: "May 20", usage: 2.7 },
  { date: "May 25", usage: 3.5 },
  { date: "June 1", usage: 2.3 },
]

export function IngredientUsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis label={{ value: "Usage (kg)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Usage</span>
                        <span className="font-bold">{payload[0].value} kg</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="usage"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--theme-primary)", opacity: 0.8 },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

