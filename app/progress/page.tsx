"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  ArrowLeft,
  Sparkles,
  PlusCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

// Custom Tooltip styled according to MyThorneAI tokens
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-white p-3 shadow-soft text-xs space-y-1">
        <p className="font-semibold text-typography-heading">
          Draft {data.draftNumber}
        </p>
        <p className="text-primary font-bold text-sm">
          Diagnostic Score: {data.scores}/100
        </p>
        <p className="text-typography-muted text-[11px]">{data.timestamp}</p>
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  const router = useRouter();
  const { essayText, issues, draftHistory, startNewEssay, resetToMockData } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch with Recharts responsive container
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to / if user lands on /progress with no essay/issues in store
  useEffect(() => {
    if (!essayText.trim() && issues.length === 0) {
      router.replace("/");
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
    // Reset active essay text, issues, and assignment for a clean submission slate.
    // Intentionally keeping draftHistory so the student's cumulative improvement and
    // historical revision milestones persist across multiple essay work sessions.
    startNewEssay();
    router.push("/");
  };

  if (!essayText.trim() && issues.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Redirecting to upload...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-[700px] w-full mx-auto space-y-6">
        {/* Main Progress Card */}
        <Card
          variant="default"
          className="rounded-2xl border border-border p-6 sm:p-8 shadow-soft space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Performance Trajectory
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-typography-heading">
              Check out your progress!
            </h1>

            <p className="text-sm text-typography-body max-w-md mx-auto leading-relaxed">
              Track how your essay quality and diagnostic scores have evolved
              across draft revisions.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-surface-panel border border-border text-center">
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-typography-muted truncate">
                Initial Draft
              </p>
              <p className="text-base sm:text-lg font-bold text-typography-heading mt-0.5">
                {initialScore}
                <span className="text-[10px] sm:text-xs font-normal text-typography-muted">/100</span>
              </p>
            </div>
            <div className="border-x border-border/80 px-1">
              <p className="text-[10px] sm:text-xs font-medium text-typography-muted truncate">
                Latest Score
              </p>
              <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
                {latestScore}
                <span className="text-[10px] sm:text-xs font-normal text-typography-muted">/100</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-typography-muted truncate">
                Net Growth
              </p>
              <p className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
                +{scoreDelta} pts
              </p>
            </div>
          </div>

          {/* Recharts Upward Trend Line/Area Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-typography-muted px-1">
              <span className="font-semibold text-typography-heading flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                Score Progression
              </span>
              <span>Target: 90+ Range</span>
            </div>

            <div className="w-full h-64 sm:h-72 rounded-xl bg-white border border-border/70 p-3 pt-4">
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
                        <stop
                          offset="5%"
                          stopColor="#2954D9"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2954D9"
                          stopOpacity={0.0}
                        />
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
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: "#E4E7EC" }}
                    />

                    <YAxis
                      domain={[50, 100]}
                      stroke="#667085"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: "#E4E7EC" }}
                      ticks={[50, 60, 70, 80, 90, 100]}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                      type="monotone"
                      dataKey="scores"
                      stroke="#2954D9"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#primaryScoreGradient)"
                      dot={{
                        r: 5,
                        fill: "#2954D9",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 7,
                        fill: "#2954D9",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-typography-muted">
                  Loading progress visualization...
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Secondary "Start New essay" + "Back to editor" */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto sm:min-w-[160px]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to editor
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="md"
              onClick={handleStartNewEssay}
              className="w-full sm:w-auto sm:min-w-[180px] font-semibold text-primary border-primary/30 hover:bg-primary-light"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Start New essay
            </Button>
          </div>
        </Card>

        {/* Footer Reset Demo helper */}
        <div className="text-center">
          <button
            type="button"
            onClick={resetToMockData}
            className="text-xs text-typography-muted hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all mock history & issues
          </button>
        </div>
      </div>
    </div>
  );
}
