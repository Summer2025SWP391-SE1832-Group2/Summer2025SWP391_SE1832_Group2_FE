import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useState } from "react";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "#2563eb", 
  },
} satisfies ChartConfig;

export default function ChartSection() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  const dataMap = {
    week: [
      { date: "20/07", value: 1000000 },
      { date: "21/07", value: 1200000 },
      { date: "22/07", value: 1800000 },
      { date: "23/07", value: 1400000 },
      { date: "24/07", value: 2000000 },
    ],
    month: [
      { date: "Tháng 3", value: 45000000 },
      { date: "Tháng 4", value: 52000000 },
      { date: "Tháng 5", value: 48000000 },
      { date: "Tháng 6", value: 56000000 },
    ],
    year: [
      { date: "2022", value: 600000000 },
      { date: "2023", value: 720000000 },
      { date: "2024", value: 680000000 },
    ],
  };

  const data = dataMap[period];

  const yTickFormatter = (value: number): string => `${value / 1000000}tr`;


  return (
    <div className="border rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h3>

      <div className="mb-4 flex gap-2">
        {["week", "month", "year"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as "week" | "month" | "year")}
            className={`px-3 py-1 rounded ${
              period === p
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
          </button>
        ))}
      </div>

      <ChartContainer config={chartConfig}>
        <BarChart data={data} width={600} height={300}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={yTickFormatter} />
          <Bar dataKey="value" fill="var(--color-revenue)" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}