from typing import List, Optional
from chromadb import Client, Collection
from chromadb.config import Settings
from app.core.config import settings

class VectorStoreService:
    def __init__(self):
        self.client: Optional[Client] = None
        self.collection: Optional[Collection] = None

    async def initialize(self):
        self.client = Client(Settings(
            chroma_api_impl="rest",
            chroma_server_host=settings.CHROMADB_HOST,
            chroma_server_http_port=settings.CHROMADB_PORT
        ))
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"description": "Document embeddings"}
        )

    async def cleanup(self):
        # Add any cleanup logic here
        pass

    async def add_document(
        self,
        document_id: str,
        content: str,
        metadata: dict,
        embedding: List[float]
    ):
        await self.collection.add(
            ids=[document_id],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[content]
        )

    async def search_similar(
        self,
        query: str,
        limit: int = 5
    ) -> List[dict]:
        results = await self.collection.query(
            query_texts=[query],
            n_results=limit
        )
        return results

    async def delete_document(self, document_id: str):
        await self.collection.delete(ids=[document_id])

    async def get_document(self, document_id: str) -> Optional[dict]:
        results = await self.collection.get(ids=[document_id])
        if results and results['documents']:
            return {
                'content': results['documents'][0],
                'metadata': results['metadatas'][0]
            }
        return None