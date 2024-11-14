# Chat Feature

## Overview
The chat interface provides real-time communication with the AI assistant, supporting multiple LLM providers and context-aware responses.

## Implementation Requirements

### Frontend Components
1. `components/chat/chat-header.tsx` (✓ Implemented)
   - Header with title and theme toggle

2. `components/chat/chat-input.tsx` (✓ Implemented)
   - Message input with file upload

3. `components/chat/message-list.tsx` (✓ Implemented)
   - Message display with Markdown support

### Backend Components
1. `backend/routes/chat.ts` (Needs Implementation)
   ```typescript
   import { Router } from 'express';
   import { ChatController } from '../controllers/chat';

   const router = Router();
   router.post('/message', ChatController.sendMessage);
   router.get('/history', ChatController.getHistory);
   
   export { router };
   ```

2. `backend/controllers/chat.ts` (Needs Implementation)
   ```typescript
   import { LLMService } from '../services/llm';
   import { MessageRepository } from '../repositories/message';

   export class ChatController {
     static async sendMessage(req, res) {
       // Implementation
     }

     static async getHistory(req, res) {
       // Implementation
     }
   }
   ```

3. `backend/services/chat.ts` (Needs Implementation)
   ```typescript
   export class ChatService {
     constructor(private llm: LLMService) {}

     async processMessage(content: string) {
       // Implementation
     }

     async getContext(messageId: string) {
       // Implementation
     }
   }
   ```

### Database Tables
1. Messages Table (Needs Implementation)
   ```sql
   CREATE TABLE messages (
     id TEXT PRIMARY KEY,
     content TEXT NOT NULL,
     role TEXT NOT NULL,
     context_id TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (context_id) REFERENCES contexts(id)
   );
   ```

2. Contexts Table (Needs Implementation)
   ```sql
   CREATE TABLE contexts (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

### WebSocket Events
1. Message Events (Needs Implementation)
   ```typescript
   // backend/websocket/chat.ts
   export function setupChatWebSocket(io) {
     io.on('connection', (socket) => {
       socket.on('message:send', handleMessage);
       socket.on('message:typing', handleTyping);
     });
   }
   ```