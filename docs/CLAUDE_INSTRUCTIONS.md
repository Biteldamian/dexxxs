# Implementation Guide for Claude

Hi Claude! I'm Bolt, the coding assistant from StackBlitz. I've implemented the frontend components of a Personal AI Assistant, but due to WebContainer limitations, I couldn't implement the backend. Here's what you need to know and do:

## Current Implementation Status

I've created:
- Complete frontend UI with Next.js and shadcn/ui
- All React components for chat, knowledge base, tasks, training, and settings
- Type definitions and interfaces
- Frontend routing and state management

## What Needs Implementation

### 1. Backend Core

Reference repositories for implementation:
- [chroma-core](https://github.com/chroma-core/chroma) - For vector database
- [fastapi-async-sqlalchemy](https://github.com/jonra1993/fastapi-async-sqlalchemy) - For API structure
- [papercliff-api](https://github.com/papercliff/api) - For background tasks
- [django-ollama](https://github.com/jakubkastner/django-ollama) - For Ollama integration

Tasks:
1. Set up FastAPI backend with SQLAlchemy
2. Implement ChromaDB integration
3. Create Ollama service wrapper
4. Implement background task system
5. Set up WebSocket for real-time updates

### 2. Document Processing

Reference repositories:
- [unstructured](https://github.com/Unstructured-IO/unstructured) - For document parsing
- [langchain-text-splitters](https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/text_splitter) - For text chunking
- [txtai](https://github.com/neuml/txtai) - For embeddings pipeline

Tasks:
1. Implement document upload and processing
2. Create text extraction pipeline
3. Set up embedding generation
4. Implement vector storage
5. Create knowledge graph generation

### 3. Task Management

Reference repositories:
- [autonomous-agents](https://github.com/Significant-Gravitas/AutoGPT) - For agent implementation
- [celery](https://github.com/celery/celery) - For task queue
- [fastapi-celery](https://github.com/GregaVrbancic/fastapi-celery) - For integration

Tasks:
1. Implement task queue system
2. Create agent orchestration
3. Set up task scheduling
4. Implement multi-agent collaboration
5. Create result processing pipeline

### 4. Training System

Reference repositories:
- [ollama-trainer](https://github.com/ollama/ollama/tree/main/examples) - For Ollama training
- [transformers](https://github.com/huggingface/transformers) - For model management
- [ray](https://github.com/ray-project/ray) - For distributed training

Tasks:
1. Set up training pipeline
2. Implement data preparation
3. Create model management
4. Set up metrics collection
5. Implement model evaluation

## Implementation Steps

1. Start with this prompt:
```
I need help implementing a FastAPI backend for a Personal AI Assistant. The frontend is already built with Next.js. The system needs to handle:
- Document processing with ChromaDB
- LLM integration with Ollama
- Task management with Celery
- Real-time updates with WebSocket
- Training pipeline for local models

Please help me implement this step by step, starting with the core FastAPI setup and database models.
```

2. For document processing:
```
I need to implement a document processing pipeline that:
- Handles multiple file formats (PDF, DOCX, TXT)
- Extracts text and generates embeddings
- Stores vectors in ChromaDB
- Creates knowledge graph relationships
- Supports real-time progress updates

Please help me implement this using unstructured and langchain libraries.
```

3. For task management:
```
I need to implement a task management system that:
- Uses Celery for background processing
- Supports multiple AI agents working together
- Handles task scheduling and prioritization
- Manages agent communication and coordination
- Processes and stores task results

Please help me implement this using Celery and FastAPI.
```

4. For training system:
```
I need to implement a model training system that:
- Prepares training data from the knowledge base
- Manages training process with Ollama
- Tracks metrics and progress
- Handles model versioning
- Supports distributed training

Please help me implement this using Ray and the Ollama API.
```

## Important Notes

1. The frontend expects these API endpoints:
- `/api/documents/*` for knowledge base
- `/api/tasks/*` for task management
- `/api/training/*` for model training
- `/api/chat/*` for chat functionality

2. WebSocket events are used for:
- Real-time chat updates
- Document processing progress
- Task status updates
- Training progress

3. Authentication is required for all endpoints

4. The system should support:
- Multiple LLM providers
- Different vector stores
- Various search engines
- Multiple agent types

## Database Schema

The frontend expects these models (implement with SQLAlchemy):
```python
# Core models needed:
- Document (id, name, type, size, status, embedding_id)
- Task (id, title, description, status, priority, mode)
- TrainingSession (id, status, progress, metrics)
- Message (id, content, role, context_id)
- Agent (id, name, role, model, provider)
```

Please implement the backend following these guidelines and let me know if you need any clarification!