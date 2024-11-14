# Model Training Feature

## Overview
The training feature allows users to fine-tune the local LLM model using their knowledge base and specific requirements.

## Implementation Requirements

### Frontend Components
1. `components/training/training-header.tsx` (✓ Implemented)
   - Header with title and theme toggle

2. `components/training/training-form.tsx` (✓ Implemented)
   - Training configuration form

3. `components/training/training-status.tsx` (✓ Implemented)
   - Training progress and metrics display

### Backend Components
1. `backend/routes/training.ts` (Needs Implementation)
   ```typescript
   import { Router } from 'express';
   import { TrainingController } from '../controllers/training';

   const router = Router();
   router.post('/start', TrainingController.start);
   router.get('/status', TrainingController.getStatus);
   router.post('/stop', TrainingController.stop);

   export { router };
   ```

2. `backend/services/training.ts` (Needs Implementation)
   ```typescript
   import { ChromaService } from './chroma';
   import { DocumentRepository } from '../repositories/document';

   export class TrainingService {
     constructor(
       private chroma: ChromaService,
       private docs: DocumentRepository
     ) {}

     async prepareTrainingData() {
       // Implementation
     }

     async trainModel(config: TrainingConfig) {
       // Implementation
     }

     async evaluateModel() {
       // Implementation
     }
   }
   ```

3. `backend/services/model-manager.ts` (Needs Implementation)
   ```typescript
   export class ModelManager {
     async saveModel(version: string) {
       // Implementation
     }

     async loadModel(version: string) {
       // Implementation
     }

     async getModelVersions() {
       // Implementation
     }
   }
   ```

### Database Tables
1. Training Sessions Table (Needs Implementation)
   ```sql
   CREATE TABLE training_sessions (
     id TEXT PRIMARY KEY,
     status TEXT NOT NULL,
     config JSON NOT NULL,
     metrics JSON,
     started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     completed_at DATETIME,
     error TEXT
   );
   ```

2. Model Versions Table (Needs Implementation)
   ```sql
   CREATE TABLE model_versions (
     id TEXT PRIMARY KEY,
     version TEXT NOT NULL,
     training_session_id TEXT NOT NULL,
     metrics JSON,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (training_session_id) REFERENCES training_sessions(id)
   );
   ```

### Training Pipeline
1. Data Preparation (Needs Implementation)
   ```typescript
   // backend/services/training/data-preparation.ts
   export class DataPreparation {
     async prepareDataset() {
       // 1. Collect documents from knowledge base
       // 2. Process and format for training
       // 3. Split into train/validation sets
     }
   }
   ```

2. Training Loop (Needs Implementation)
   ```typescript
   // backend/services/training/training-loop.ts
   export class TrainingLoop {
     async train(config: TrainingConfig) {
       // 1. Initialize model
       // 2. Train for specified epochs
       // 3. Collect metrics
       // 4. Save checkpoints
     }
   }
   ```

3. Model Evaluation (Needs Implementation)
   ```typescript
   // backend/services/training/evaluation.ts
   export class ModelEvaluation {
     async evaluate(modelVersion: string) {
       // 1. Load test dataset
       // 2. Run inference
       // 3. Calculate metrics
     }
   }
   ```