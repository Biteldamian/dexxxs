# Vector Storage Implementation Guide

## Overview
This guide covers the implementation of vector storage using ChromaDB for the knowledge base feature.

## Setup ChromaDB

### 1. Installation
```bash
pip install chromadb
```

### 2. Service Configuration
```typescript
// backend/services/chroma.ts
import { ChromaClient, Collection } from 'chromadb';

export class ChromaService {
  private client: ChromaClient;
  private collection: Collection;

  async initialize() {
    this.client = new ChromaClient({
      host: process.env.CHROMADB_HOST || 'localhost',
      port: parseInt(process.env.CHROMADB_PORT || '8000'),
    });

    this.collection = await this.client.createCollection({
      name: 'documents',
      metadata: { description: 'Document embeddings' },
    });
  }

  async addDocument(id: string, content: string, metadata: any) {
    const embedding = await this.generateEmbedding(content);
    await this.collection.add({
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata],
      documents: [content],
    });
  }

  async searchSimilar(query: string, limit: number = 5) {
    const queryEmbedding = await this.generateEmbedding(query);
    return await this.collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
    });
  }
}
```

## Embedding Generation

### 1. Using Ollama
```typescript
// backend/services/embedding.ts
export class EmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${process.env.OLLAMA_HOST}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.embedding;
  }
}
```

## Document Processing Pipeline

### 1. Text Extraction
```typescript
// backend/services/document-processor.ts
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';

export class DocumentProcessor {
  async extractText(file: Express.Multer.File): Promise<string> {
    switch (file.mimetype) {
      case 'application/pdf':
        return this.extractFromPDF(file);
      case 'image/png':
      case 'image/jpeg':
        return this.extractFromImage(file);
      case 'text/plain':
        return this.extractFromText(file);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private async extractFromPDF(file: Express.Multer.File): Promise<string> {
    const dataBuffer = file.buffer;
    const data = await pdf(dataBuffer);
    return data.text;
  }

  private async extractFromImage(file: Express.Multer.File): Promise<string> {
    const worker = await createWorker();
    const { data: { text } } = await worker.recognize(file.buffer);
    await worker.terminate();
    return text;
  }

  private async extractFromText(file: Express.Multer.File): Promise<string> {
    return file.buffer.toString('utf-8');
  }
}
```

## Knowledge Graph Generation

### 1. Graph Construction
```typescript
// backend/services/knowledge-graph.ts
interface Node {
  id: string;
  label: string;
  type: 'document' | 'concept' | 'entity';
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

export class KnowledgeGraphService {
  async generateGraph(documents: Document[]): Promise<{ nodes: Node[]; edges: Edge[] }> {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Extract entities and concepts
    for (const doc of documents) {
      const entities = await this.extractEntities(doc.content);
      const concepts = await this.extractConcepts(doc.content);
      
      // Add nodes and edges
      nodes.push(...entities.map(e => ({ id: e.id, label: e.name, type: 'entity' })));
      nodes.push(...concepts.map(c => ({ id: c.id, label: c.name, type: 'concept' })));
      
      // Create relationships
      edges.push(...this.createRelationships(doc.id, entities, concepts));
    }

    return { nodes, edges };
  }
}
```

## Best Practices

1. **Embedding Management**
   - Cache embeddings for frequently accessed documents
   - Implement batch processing for large documents
   - Use dimensionality reduction for visualization

2. **Performance Optimization**
   - Implement pagination for large result sets
   - Use background jobs for document processing
   - Cache search results

3. **Error Handling**
   - Implement retry mechanisms for failed operations
   - Log processing errors with context
   - Provide user feedback for processing status

4. **Security**
   - Validate file types and sizes
   - Sanitize text content
   - Implement access control for documents