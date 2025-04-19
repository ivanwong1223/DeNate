"use client";

import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  CartesianGrid as RechartsCartesianGrid,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  ReferenceLine as RechartsReferenceLine,
  Label as RechartsLabel,
  TooltipProps as RechartsTooltipProps,
} from "recharts";

// Re-export types from recharts
export type TooltipProps = RechartsTooltipProps<any, any>;

// LineChart component
export function LineChart({
  children,
  ...props
}: React.ComponentProps<typeof RechartsLineChart>) {
  return (
    <RechartsLineChart
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      {...props}
    >
      {children}
    </RechartsLineChart>
  );
}

// Line component
export function Line({
  className,
  ...props
}: React.ComponentProps<typeof RechartsLine>) {
  return <RechartsLine {...props} />;
}

// CartesianGrid component
export function CartesianGrid({
  strokeDasharray = "3 3",
  stroke = "hsl(var(--border))",
  ...props
}: React.ComponentProps<typeof RechartsCartesianGrid>) {
  return <RechartsCartesianGrid strokeDasharray={strokeDasharray} stroke={stroke} {...props} />;
}

// XAxis component
export function XAxis({
  stroke = "hsl(var(--muted-foreground))",
  fontSize = 12,
  tickLine = false,
  axisLine = true,
  dy = 10,
  ...props
}: React.ComponentProps<typeof RechartsXAxis>) {
  return (
    <RechartsXAxis
      stroke={stroke}
      fontSize={fontSize}
      tickLine={tickLine}
      axisLine={axisLine}
      dy={dy}
      {...props}
    />
  );
}

// YAxis component
export function YAxis({
  stroke = "hsl(var(--muted-foreground))",
  fontSize = 12,
  tickLine = false,
  axisLine = true,
  dx = -10,
  ...props
}: React.ComponentProps<typeof RechartsYAxis>) {
  return (
    <RechartsYAxis
      stroke={stroke}
      fontSize={fontSize}
      tickLine={tickLine}
      axisLine={axisLine}
      dx={dx}
      {...props}
    />
  );
}

// Tooltip component
export function Tooltip(props: React.ComponentProps<typeof RechartsTooltip>) {
  return <RechartsTooltip {...props} />;
}

// Legend component
export function Legend({
  verticalAlign = "bottom",
  height = 36,
  fontSize = 12,
  ...props
}: React.ComponentProps<typeof RechartsLegend>) {
  return (
    <RechartsLegend
      verticalAlign={verticalAlign}
      height={height}
      fontSize={fontSize}
      {...props}
    />
  );
}

// ResponsiveContainer component
export function ResponsiveContainer({
  width = "100%",
  height = 400,
  ...props
}: React.ComponentProps<typeof RechartsResponsiveContainer>) {
  return (
    <RechartsResponsiveContainer width={width} height={height} {...props} />
  );
}

// ReferenceLine component
export function ReferenceLine(props: React.ComponentProps<typeof RechartsReferenceLine>) {
  return <RechartsReferenceLine {...props} />;
}

// Label component
export function Label(props: React.ComponentProps<typeof RechartsLabel>) {
  return <RechartsLabel {...props} />;
} 