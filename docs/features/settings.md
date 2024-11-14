# Settings Feature

## Overview
The settings system allows users to configure multiple LLM providers and their parameters for use throughout the application.

## Implementation Requirements

### Frontend Components
1. `components/settings/settings-header.tsx` (✓ Implemented)
   - Header with title and theme toggle

2. `components/settings/llm-config.tsx` (✓ Implemented)
   - LLM provider configuration form

### Backend Components
1. `backend/routes/settings.ts` (Needs Implementation)
   ```typescript
   import { Router } from 'express';
   import { SettingsController } from '../controllers/settings';

   const router = Router();
   router.get('/', SettingsController.get);
   router.post('/', SettingsController.update);
   router.post('/test-connection', SettingsController.testConnection);

   export { router };
   ```

2. `backend/services/settings.ts` (Needs Implementation)
   ```typescript
   export class SettingsService {
     async getSettings() {
       // Implementation
     }

     async updateSettings(settings: Settings) {
       // Implementation
     }

     async validateSettings(settings: Settings) {
       // Implementation
     }
   }
   ```

3. `backend/services/provider-validator.ts` (Needs Implementation)
   ```typescript
   export class ProviderValidator {
     async testConnection(provider: LLMProvider) {
       // Implementation for each provider type
     }
   }
   ```

### Database Tables
1. Settings Table (Needs Implementation)
   ```sql
   CREATE TABLE settings (
     id TEXT PRIMARY KEY,
     key TEXT NOT NULL UNIQUE,
     value JSON NOT NULL,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. Provider Configurations Table (Needs Implementation)
   ```sql
   CREATE TABLE provider_configs (
     id TEXT PRIMARY KEY,
     provider_id TEXT NOT NULL UNIQUE,
     enabled BOOLEAN DEFAULT false,
     config JSON NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Configuration Management
1. Settings Manager (Needs Implementation)
   ```typescript
   // backend/services/settings-manager.ts
   export class SettingsManager {
     private static instance: SettingsManager;
     private settings: Map<string, any>;

     static getInstance() {
       if (!SettingsManager.instance) {
         SettingsManager.instance = new SettingsManager();
       }
       return SettingsManager.instance;
     }

     async load() {
       // Implementation
     }

     async save() {
       // Implementation
     }
   }
   ```

2. Provider Factory (Needs Implementation)
   ```typescript
   // backend/services/provider-factory.ts
   export class ProviderFactory {
     static createProvider(config: ProviderConfig): LLMProvider {
       // Implementation
     }
   }
   ```