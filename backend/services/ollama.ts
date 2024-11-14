import { spawn } from 'child_process';
import fetch from 'node-fetch';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'llama2';

export async function setupOllama() {
  try {
    // Check if Ollama is running
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!response.ok) {
      throw new Error('Ollama is not running');
    }

    // Check if model is available
    const tags = await response.json();
    const modelExists = tags.models?.some((model: any) => model.name === MODEL_NAME);

    if (!modelExists) {
      console.log(`Pulling ${MODEL_NAME} model...`);
      await pullModel();
    }

    console.log('Ollama setup completed');
  } catch (error) {
    console.error('Ollama setup failed:', error);
    throw error;
  }
}

async function pullModel() {
  const response = await fetch(`${OLLAMA_HOST}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: MODEL_NAME }),
  });

  if (!response.ok) {
    throw new Error('Failed to pull model');
  }
}

export async function generateResponse(prompt: string, context?: string) {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt,
      context,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate response');
  }

  const data = await response.json();
  return data.response;
}

export async function trainModel(trainingData: any[]) {
  // Implementation depends on Ollama's training capabilities
  throw new Error('Training not implemented');
}