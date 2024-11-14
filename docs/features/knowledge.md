# Knowledge Base Feature

## Overview
The knowledge base allows users to upload, process, and manage documents that the AI can reference during conversations.

## Implementation Requirements

### Frontend Components
1. `components/knowledge/knowledge-header.tsx` (✓ Implemented)
   - Header with title and theme toggle

2. `components/knowledge/knowledge-list.tsx` (✓ Implemented)
   - Document list with status and actions

3. `components/knowledge/upload-button.tsx` (✓ Implemented)
   - File upload dialog and handler

### Backend Components
1. `backend/routes/documents.ts` (Needs Implementation)
   ```typescript
   import { Router } from 'express';
   import { DocumentController } from '../controllers/document';
   import { upload } from '../middleware/upload';

   const router = Router();
   router.post('/upload', upload.single('file'), DocumentController.upload);
   router.get('/', DocumentController.list);
   router.delete('/:id', DocumentController.delete);

   export { router };
   ```

2. `backend/services/document-processor.ts` (Needs Implementation)
   ```typescript
   import { ChromaService } from './chroma';
   import { DocumentRepository } from '../repositories/document';

   export class DocumentProcessor {
     constructor(
       private chroma: ChromaService,
       private docs: DocumentRepository
     ) {}

     async process(file: Express.Multer.File) {
       // 1. Extract text based on file type
       // 2. Generate embeddings
       // 3. Store in ChromaDB
       // 4. Update document status
     }

     async extractText(file: Express.Multer.File) {
       // Implementation for different file types
     }
   }
   ```

3. `backend/services/embedding.ts` (Needs Implementation)
   ```typescript
   export class EmbeddingService {
     async generateEmbeddings(text: string) {
       // Implementation using chosen embedding model
     }
   }
   ```

### Database Tables
1. Documents Table (Needs Implementation)
   ```sql
   CREATE TABLE documents (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     size INTEGER NOT NULL,
     status TEXT NOT NULL,
     embedding_id TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     processed_at DATETIME,
     error TEXT
   );
   ```

### File Storage
1. Document Storage Structure (Needs Implementation)
   ```
   storage/
   ├── documents/
   │   ├── original/    # Original uploaded files
   │   └── processed/   # Extracted text and metadata
   ```

### Vector Storage (ChromaDB)
1. Collection Setup (Needs Implementation)
   ```typescript
   // backend/services/chroma.ts
   export class ChromaService {
     async setupCollections() {
       await this.client.createCollection({
         name: 'documents',
         metadata: { description: 'Document embeddings' }
       });
     }
   }
   ```