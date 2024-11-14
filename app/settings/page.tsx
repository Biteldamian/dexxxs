"use client";

import { SettingsHeader } from "@/components/settings/settings-header";
import { LLMConfig } from "@/components/settings/llm-config";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface LLMProvider {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Settings {
  defaultProvider: string;
  providers: LLMProvider[];
}

const defaultSettings: Settings = {
  defaultProvider: "ollama",
  providers: [
    {
      id: "ollama",
      name: "Ollama",
      enabled: true,
      baseUrl: "http://localhost:11434",
      model: "llama2",
    },
    {
      id: "openai",
      name: "OpenAI",
      enabled: false,
      model: "gpt-4",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      enabled: false,
      model: "claude-3-opus",
    },
    {
      id: "xai",
      name: "xAI",
      enabled: false,
      model: "grok-beta",
    },
  ],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { toast } = useToast();

  const handleSaveSettings = async (updatedSettings: Settings) => {
    try {
      // TODO: Implement API call to save settings
      setSettings(updatedSettings);
      toast({
        title: "Settings saved",
        description: "Your LLM provider configuration has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <SettingsHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <LLMConfig settings={settings} onSave={handleSaveSettings} />
        </div>
      </div>
    </div>
  );
}