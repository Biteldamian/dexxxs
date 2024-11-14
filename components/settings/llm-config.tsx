"use client";

import { Settings, LLMProvider } from "@/app/settings/page";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface LLMConfigProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function LLMConfig({ settings: initialSettings, onSave }: LLMConfigProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleProviderChange = (providerId: string, updates: Partial<LLMProvider>) => {
    setSettings((prev) => ({
      ...prev,
      providers: prev.providers.map((provider) =>
        provider.id === providerId ? { ...provider, ...updates } : provider
      ),
    }));
  };

  const handleDefaultProviderChange = (providerId: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultProvider: providerId,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Providers</CardTitle>
        <CardDescription>
          Configure your language model providers and their settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Default Provider</Label>
          <Select
            value={settings.defaultProvider}
            onValueChange={handleDefaultProviderChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settings.providers
                .filter((provider) => provider.enabled)
                .map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {settings.providers.map((provider) => (
            <div key={provider.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">{provider.name}</Label>
                <Switch
                  checked={provider.enabled}
                  onCheckedChange={(enabled) =>
                    handleProviderChange(provider.id, { enabled })
                  }
                />
              </div>

              {provider.enabled && (
                <div className="grid gap-4 pl-6">
                  {provider.id !== "ollama" && (
                    <div className="grid gap-2">
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        value={provider.apiKey || ""}
                        onChange={(e) =>
                          handleProviderChange(provider.id, {
                            apiKey: e.target.value,
                          })
                        }
                        placeholder={`Enter your ${provider.name} API key`}
                      />
                    </div>
                  )}

                  {provider.id === "ollama" && (
                    <div className="grid gap-2">
                      <Label>Base URL</Label>
                      <Input
                        value={provider.baseUrl || ""}
                        onChange={(e) =>
                          handleProviderChange(provider.id, {
                            baseUrl: e.target.value,
                          })
                        }
                        placeholder="http://localhost:11434"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Model</Label>
                    <Input
                      value={provider.model || ""}
                      onChange={(e) =>
                        handleProviderChange(provider.id, {
                          model: e.target.value,
                        })
                      }
                      placeholder={
                        provider.id === "ollama"
                          ? "llama2"
                          : provider.id === "openai"
                          ? "gpt-4"
                          : provider.id === "anthropic"
                          ? "claude-3-opus"
                          : "grok-beta"
                      }
                    />
                  </div>

                  {provider.id !== "ollama" && (
                    <>
                      <div className="grid gap-2">
                        <Label>Temperature (0-2)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={provider.temperature || 0}
                          onChange={(e) =>
                            handleProviderChange(provider.id, {
                              temperature: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Max Tokens</Label>
                        <Input
                          type="number"
                          min="1"
                          value={provider.maxTokens || 2048}
                          onChange={(e) =>
                            handleProviderChange(provider.id, {
                              maxTokens: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button onClick={() => onSave(settings)} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}