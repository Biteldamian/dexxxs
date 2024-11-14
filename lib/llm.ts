import { Settings, LLMProvider } from "@/app/settings/page";

export class LLMService {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  private getProvider(providerId?: string): LLMProvider {
    const provider = this.settings.providers.find(
      (p) => p.id === (providerId || this.settings.defaultProvider)
    );
    if (!provider || !provider.enabled) {
      throw new Error("Provider not found or not enabled");
    }
    return provider;
  }

  async chat(message: string, providerId?: string) {
    const provider = this.getProvider(providerId);
    
    switch (provider.id) {
      case "ollama":
        return this.ollamaChat(message, provider);
      case "openai":
        return this.openAIChat(message, provider);
      case "anthropic":
        return this.anthropicChat(message, provider);
      case "xai":
        return this.xAIChat(message, provider);
      default:
        throw new Error("Unsupported provider");
    }
  }

  private async ollamaChat(message: string, provider: LLMProvider) {
    const response = await fetch(`${provider.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: "user", content: message }],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama chat request failed");
    }

    return response.json();
  }

  private async openAIChat(message: string, provider: LLMProvider) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: "user", content: message }],
        temperature: provider.temperature,
        max_tokens: provider.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI chat request failed");
    }

    return response.json();
  }

  private async anthropicChat(message: string, provider: LLMProvider) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": provider.apiKey!,
        "anthropic-version": "2024-01-01",
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: "user", content: message }],
        max_tokens: provider.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error("Anthropic chat request failed");
    }

    return response.json();
  }

  private async xAIChat(message: string, provider: LLMProvider) {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model || "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy.",
          },
          { role: "user", content: message }
        ],
        temperature: provider.temperature || 0,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("xAI chat request failed");
    }

    const data = await response.json();
    return data.choices[0].message;
  }
}