"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TrainingFormProps {
  onSubmit: (epochs: number) => void;
  className?: string;
}

export function TrainingForm({ onSubmit, className }: TrainingFormProps) {
  const [epochs, setEpochs] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(epochs);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Training Configuration</CardTitle>
        <CardDescription>
          Configure and start the model training process on your knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Epochs</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[epochs]}
                  onValueChange={(value) => setEpochs(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-20"
                  min={1}
                  max={50}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                More epochs may improve model performance but take longer to train.
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Start Training
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}