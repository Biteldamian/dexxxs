"use client";

import { Task } from "@/app/tasks/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock, PlayCircle, StopCircle, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  className?: string;
}

export function TaskList({ tasks, onDelete, className }: TaskListProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "running":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "running":
        return <PlayCircle className="size-4" />;
      case "pending":
        return <Clock className="size-4" />;
      default:
        return <StopCircle className="size-4" />;
    }
  };

  return (
    <ScrollArea className={cn("h-[calc(100vh-24rem)]", className)}>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{task.title}</CardTitle>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    getStatusColor(task.status)
                  )}
                >
                  {getStatusIcon(task.status)}
                  <span className="text-sm font-medium">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
              <CardDescription>
                Created: {task.createdAt.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              {task.result && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Summary:</p>
                  <p className="text-sm text-muted-foreground">{task.result.summary}</p>
                  {task.result.details && (
                    <>
                      <p className="mt-2 text-sm font-medium">Details:</p>
                      <p className="text-sm text-muted-foreground">{task.result.details}</p>
                    </>
                  )}
                  {task.result.agentContributions && task.result.agentContributions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Agent Contributions:</p>
                      <div className="mt-2 space-y-2">
                        {task.result.agentContributions.map((contribution, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">
                              {task.agents.find(a => a.id === contribution.agentId)?.name || contribution.agentId}:
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {contribution.contribution}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                size="sm" 
                className="ml-auto"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}