"use client";

import { TrainingSession } from "@/app/training/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, XCircle } from "lucide-react";

interface TrainingStatusProps {
  session: TrainingSession;
  className?: string;
}

export function TrainingStatus({ session, className }: TrainingStatusProps) {
  const getStatusIcon = () => {
    switch (session.status) {
      case "completed":
        return <CheckCircle className="size-8 text-green-500" />;
      case "error":
        return <XCircle className="size-8 text-red-500" />;
      case "training":
        return <Brain className="size-8 text-blue-500 animate-pulse" />;
      default:
        return <Brain className="size-8 text-muted-foreground" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Training Status</CardTitle>
        <CardDescription>
          Monitor the progress of your model training session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          {getStatusIcon()}
          <div className="space-y-1">
            <p className="font-medium">
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </p>
            {session.startedAt && (
              <p className="text-sm text-muted-foreground">
                Started: {session.startedAt.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{session.progress}%</span>
          </div>
          <Progress value={session.progress} />
        </div>

        {session.metrics && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Loss</p>
                <p className="text-2xl">{session.metrics.loss.toFixed(4)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Accuracy</p>
                <p className="text-2xl">
                  {(session.metrics.accuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Epochs Completed</p>
              <p className="text-2xl">{session.metrics.epochsCompleted}</p>
            </div>
          </div>
        )}

        {session.error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {session.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}