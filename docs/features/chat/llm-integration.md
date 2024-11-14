# LLM Integration Guide

## Overview
This guide covers the integration of multiple Language Model providers into the chat interface.

## Provider Integration

### 1. Ollama Integration
```typescript
// backend/services/providers/ollama.ts
export class OllamaProvider implements LLMProvider {
  async generateResponse(prompt: string, context?: string): Promise<string> {
    const response = await fetch(`${process.env.OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt,
        context,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response;
  }
}
```

### 2. OpenAI Integration
```typescript
// backend/services/providers/openai.ts
import OpenAI from 'openai';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content || '';
  }
}
```

### 3. Anthropic Integration
```typescript
// backend/services/providers/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-3-opus',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content;
  }
}
```

## Context Management

### 1. Message History
```typescript
// backend/services/chat/history.ts
export class ChatHistory {
  async addMessage(message: ChatMessage): Promise<void> {
    await db.messages.create({
      data: {
        content: message.content,
        role: message.role,
        contextId: message.contextId,
      },
    });
  }

  async getContext(messageId: string, limit: number = 10): Promise<ChatMessage[]> {
    return await db.messages.findMany({
      where: { contextId: messageId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
```

### 2. Context Enhancement
```typescript
// backend/services/chat/context-enhancer.ts
export class ContextEnhancer {
  async enhancePrompt(prompt: string, contextDocs: string[]): Promise<string> {
    const relevantContext = await this.searchRelevantContext(prompt, contextDocs);
    return `Context:\n${relevantContext}\n\nQuestion: ${prompt}`;
  }

  private async searchRelevantContext(query: string, docs: string[]): Promise<string> {
    const chromaService = new ChromaService();
    const results = await chromaService.searchSimilar(query);
    return results.map(r => r.document).join('\n\n');
  }
}
```

## Streaming Implementation

### 1. Server-Sent Events
```typescript
// backend/routes/chat.ts
router.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const llm = new LLMService();
  const stream = await llm.generateStream(req.query.prompt as string);

  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  res.end();
});
```

### 2. Client Implementation
```typescript
// frontend/services/chat.ts
export class ChatClient {
  async streamResponse(prompt: string): Promise<ReadableStream> {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    return response.body!;
  }
}
```

## Best Practices

1. **Provider Management**
   - Implement fallback mechanisms
   - Monitor rate limits
   - Cache responses when appropriate

2. **Context Handling**
   - Limit context window size
   - Implement context pruning
   - Use semantic chunking

3. **Error Handling**
   - Implement retry logic
   - Handle timeout scenarios
   - Provide graceful degradation

4. **Security**
   - Sanitize user inputs
   - Implement content filtering
   - Monitor for abuse