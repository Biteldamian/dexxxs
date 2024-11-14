"use client";

import { Agent, AgentMode, AgentRole, TaskPriority, TaskSchedule } from "@/app/tasks/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button as ButtonUI } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";

const agentRoles: { value: AgentRole; label: string }[] = [
  { value: "coordinator", label: "Coordinator" },
  { value: "researcher", label: "Researcher" },
  { value: "analyst", label: "Analyst" },
  { value: "writer", label: "Writer" },
  { value: "reviewer", label: "Reviewer" },
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  mode: z.enum(["single", "collaborative"]),
  isScheduled: z.boolean(),
  scheduleDate: z.date().optional(),
  schedulePattern: z.enum(["daily", "weekly", "monthly"]).optional(),
});

interface TaskFormProps {
  onSubmit: (
    title: string,
    description: string,
    priority: TaskPriority,
    mode: AgentMode,
    agents: Agent[],
    schedule?: TaskSchedule
  ) => void;
  className?: string;
}

export function TaskForm({ onSubmit, className }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "single",
      priority: "medium",
      isScheduled: false,
    },
  });

  const [agents, setAgents] = useState<Agent[]>([]);

  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      role: "analyst",
      model: "gpt-4",
      provider: "openai",
    };
    setAgents([...agents, newAgent]);
  };

  const handleRemoveAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId));
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const schedule = values.isScheduled
      ? {
          startAt: values.scheduleDate,
          recurringPattern: values.schedulePattern,
          nextRun: values.scheduleDate,
        }
      : undefined;

    onSubmit(
      values.title,
      values.description,
      values.priority,
      values.mode,
      agents,
      schedule
    );
    form.reset();
    setAgents([]);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>
          Configure your task and assign AI agents to handle it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter task title" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the task in detail"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Agent</SelectItem>
                        <SelectItem value="collaborative">
                          Multi-Agent Collaboration
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("mode") === "collaborative" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Agents</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAgent}
                  >
                    <Plus className="size-4 mr-2" />
                    Add Agent
                  </Button>
                </div>

                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <Select
                        value={agent.role}
                        onValueChange={(value: AgentRole) => {
                          const updatedAgents = agents.map((a) =>
                            a.id === agent.id ? { ...a, role: value } : a
                          );
                          setAgents(updatedAgents);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {agentRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={agent.provider}
                        onValueChange={(value) => {
                          const updatedAgents = agents.map((a) =>
                            a.id === agent.id ? { ...a, provider: value } : a
                          );
                          setAgents(updatedAgents);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="ollama">Ollama</SelectItem>
                          <SelectItem value="xai">xAI</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Model name"
                        value={agent.model}
                        onChange={(e) => {
                          const updatedAgents = agents.map((a) =>
                            a.id === agent.id
                              ? { ...a, model: e.target.value }
                              : a
                          );
                          setAgents(updatedAgents);
                        }}
                        className="flex-1"
                      />

                      <ButtonUI
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAgent(agent.id)}
                      >
                        <X className="size-4" />
                      </ButtonUI>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="isScheduled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Schedule Task</FormLabel>
                    <FormDescription>
                      Set a specific time for this task to start
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isScheduled") && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedulePattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurring Pattern</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}