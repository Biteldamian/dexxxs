"use client";

import { TrainingForm } from "@/components/training/training-form";
import { TrainingHeader } from "@/components/training/training-header";
import { TrainingStatus } from "@/components/training/training-status";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface TrainingSession {
  id: string;
  status: "idle" | "training" | "completed" | "error";
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  metrics?: {
    loss: number;
    accuracy: number;
    epochsCompleted: number;
  };
}

export default function TrainingPage() {
  const [session, setSession] = useState<TrainingSession>({
    id: "1",
    status: "idle",
    progress: 0,
  });
  const { toast } = useToast();

  const handleStartTraining = async (epochs: number) => {
    try {
      const response = await fetch("/api/training/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ epochs }),
      });

      if (!response.ok) {
        throw new Error("Failed to start training");
      }

      const newSession = await response.json();
      setSession(newSession);

      toast({
        title: "Training started",
        description: "The model will be trained on your knowledge base.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start training",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TrainingHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Model Training</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <TrainingForm onSubmit={handleStartTraining} className="lg:col-span-4" />
          <TrainingStatus session={session} className="lg:col-span-3" />
        </div>
      </div>
    </div>
  );
}