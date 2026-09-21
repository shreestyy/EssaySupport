"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { MOCK_DRAFT_HISTORY } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepTracker } from "@/components/step-tracker";

// Tooltip matching dashboard aesthetic
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-white p-3 shadow-soft text-xs space-y-1">
        <p className="font-semibold text-typography-heading">
          Draft {data.draftNumber}
        </p>
        <p className="text-primary font-bold text-sm">
          Score: {data.scores}/100
        </p>
        <p className="text-typography-muted text-[11px]">{data.timestamp}</p>
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  const router = useRouter();
  const { essayText, issues, draftHistory, startNewEssay, resetToMockData } =
    useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to home if user lands on /progress with no essay/issues in store
  useEffect(() => {
    if (!essayText.trim() && issues.length === 0) {
      router.replace(ROUTES.home);
    }
  }, [essayText, issues, router]);

  const history =
    draftHistory && draftHistory.length > 0
      ? draftHistory
      : MOCK_DRAFT_HISTORY;

  const chartData = history.map((item) => ({
    name: `Draft ${item.draftNumber}`,
    draftNumber: item.draftNumber,
    scores: item.scores,
    timestamp: item.timestamp,
  }));

  const latestScore =
    history.length > 0 ? history[history.length - 1].scores : 92;
  const initialScore = history.length > 0 ? history[0].scores : 68;
  const scoreDelta = Math.max(0, latestScore - initialScore);

  const handleStartNewEssay = () => {
    startNewEssay();
    router.push(ROUTES.home);
  };

  if (!essayText.trim() && issues.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 page-fade-in">
      {/* 1. Dashboard Pathway Step Tracker */}
      <StepTracker currentStep={4} />

      {/* 2. Main Progress Card */}
      <Card
        variant="default"
        className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-soft space-y-6"
      >
        {/* Header: Clean, direct */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-heading">
            Progress
          </h2>
          <p className="text-sm text-typography-muted">
            Score history across revisions.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-surface-panel border border-border text-center">
          <div>
            <p className="text-[11px] font-medium text-typography-muted truncate">
              Initial Draft
            </p>
            <p className="text-base sm:text-lg font-bold text-typography-heading mt-0.5">
              {initialScore}
              <span className="text-[11px] font-normal text-typography-muted">
                /100
              </span>
            </p>
          </div>
          <div className="border-x border-border/80 px-1">
            <p className="text-[11px] font-medium text-typography-muted truncate">
              Latest Score
            </p>
            <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
              {latestScore}
              <span className="text-[11px] font-normal text-typography-muted">
                /100
              </span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-typography-muted truncate">
              Growth
            </p>
            <p className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
              +{scoreDelta} pts
            </p>
          </div>
        </div>

        {/* Recharts Trend Line/Area Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-typography-muted px-1">
            <span className="font-semibold text-typography-heading">
              Score Progression
            </span>
          </div>

          <div className="w-full h-60 sm:h-64 rounded-xl bg-white border border-border/70 p-3 pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="primaryScoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2954D9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2954D9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E4E7EC"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#667085"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E4E7EC" }}
                  />

                  <YAxis
                    domain={[50, 100]}
                    stroke="#667085"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E4E7EC" }}
                    ticks={[50, 60, 70, 80, 90, 100]}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="scores"
                    stroke="#2954D9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#primaryScoreGradient)"
                    dot={{
                      r: 4,
                      fill: "#2954D9",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#2954D9",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-typography-muted">
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href={ROUTES.editor} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to editor
            </Button>
          </Link>

          <Button
            variant="primary"
            size="md"
            onClick={handleStartNewEssay}
            className="w-full sm:w-auto font-semibold"
          >
            Start New essay
          </Button>
        </div>
      </Card>

      {/* Demo reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={resetToMockData}
          className="text-xs text-typography-muted hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset demo history
        </button>
      </div>
    </div>
  );
}
