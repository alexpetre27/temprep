"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartContainer, ChartConfig, ChartTotal } from "@/components/ui/chart";

interface PieChartDataItem {
  name: string;
  value: number;
}

interface ChartPieLabelProps {
  data: PieChartDataItem[];
}
const BUDGET_CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "BILLS",
  "ENTERTAINMENT",
  "SALARY",
  "OTHER",
];

const chartConfig: ChartConfig = {
  FOOD: { label: "Mâncare", color: "var(--chart-1)" },
  TRANSPORT: { label: "Transport", color: "var(--chart-2)" },
  BILLS: { label: "Facturi", color: "var(--chart-3)" },
  ENTERTAINMENT: { label: "Divertisment", color: "var(--chart-4)" },
  SALARY: { label: "Salariu", color: "var(--chart-5)" },
  OTHER: { label: "Altele", color: "var(--chart-6)" },
};
export function ChartPieLabel({ data }: ChartPieLabelProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const renderActiveShape = (props: any) => {
    const index = props.index as number;
    const outerRadius = props.outerRadius as number;

    const isHover = index === hoverIndex;
    const offset = isHover ? 8 : 0;

    return (
      <Sector
        {...props}
        outerRadius={outerRadius + offset}
        stroke="var(--color-foreground)"
        strokeWidth={isHover ? 3 : 1}
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          transition: "all 0.4s ease-in",
          transform: isHover ? "scale(1.05)" : "scale(1)",
          filter: isHover
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.25))"
            : "drop-shadow(0 0 0 rgba(0,0,0,0))",
        }}
      />
    );
  };

  const activeData = hoverIndex !== null ? data[hoverIndex] : null;
  const activeLabel = activeData
    ? chartConfig[activeData.name as keyof typeof chartConfig]?.label ||
      activeData.name
    : "";

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Cheltuieli pe Categorii</CardTitle>
        <CardDescription>Vizualizare buget curent</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              activeIndex={hoverIndex ?? undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-out"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    chartConfig[entry.name as keyof typeof chartConfig]
                      ?.color || "var(--color-foreground)"
                  }
                  style={{
                    transition: "fill 0.4s ease, transform 0.3s ease",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
          <ChartTotal>
            <div
              className={`flex flex-col items-center justify-center transform transition-all duration-300 ease-out ${
                activeData ? "scale-105 opacity-100" : "scale-100 opacity-90"
              }`}
            >
              {activeData ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {activeLabel}
                  </span>
                  <span className="text-2xl font-bold tabular-nums">
                    {activeData.value.toFixed(2)} RON
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold tabular-nums">
                    {totalValue.toFixed(2)} RON
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Total Cheltuieli
                  </span>
                </>
              )}
            </div>
          </ChartTotal>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          Ai cheltuit{" "}
          <span className="font-bold text-foreground">
            {totalValue.toFixed(2)} RON
          </span>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Afișează cheltuielile totale agregate pe categorie
        </div>
      </CardFooter>
    </Card>
  );
}
