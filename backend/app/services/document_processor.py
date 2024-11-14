import aiofiles
from fastapi import UploadFile
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.models.document import Document, Folder
from app.services.vector_store import VectorStoreService
from app.core.config import settings
from app.schemas.document import FolderCreate

class DocumentProcessor:
    def __init__(self, db: Session):
        self.db = db
        self.vector_store = VectorStoreService()

    async def create_document(self, file: UploadFile, folder_id: str = None) -> Document:
        document = Document(
            id=str(uuid.uuid4()),
            name=file.filename,
            type=file.content_type,
            size=0,  # Will be updated after processing
            status="processing",
            folder_id=folder_id
        )
        self.db.add(document)
        self.db.commit()
        return document

    async def create_folder(self, folder: FolderCreate) -> Folder:
        new_folder = Folder(
            id=str(uuid.uuid4()),
            name=folder.name,
            parent_id=folder.parent_id
        )
        self.db.add(new_folder)
        self.db.commit()
        return new_folder

    async def process_document(self, document_id: str, file: UploadFile):
        try:
            # Save file
            file_path = f"{settings.UPLOAD_DIR}/{document_id}"
            content = await file.read()
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)

            # Extract text based on file type
            text = await self.extract_text(file_path, file.content_type)

            # Generate embedding and store in vector database
            embedding_id = await self.vector_store.add_document(
                document_id=document_id,
                content=text,
                metadata={
                    "name": file.filename,
                    "type": file.content_type
                }
            )

            # Update document status
            document = self.db.query(Document).filter(Document.id == document_id).first()
            document.status = "ready"
            document.processed_at = datetime.now()
            document.size = len(content)
            document.content = text
            document.embedding_id = embedding_id
            
            # Generate summary and tags (implement your own logic)
            document.summary = await self.generate_summary(text)
            document.tags = await self.extract_tags(text)
            
            self.db.commit()

        except Exception as e:
            document = self.db.query(Document).filter(Document.id == document_id).first()
            document.status = "error"
            document.error = str(e)
            self.db.commit()
            raise

    async def extract_text(self, file_path: str, content_type: str) -> str:
        # Implement text extraction based on content type
        # This is a placeholder - implement actual extraction logic
        async with aiofiles.open(file_path, 'r') as f:
            return await f.read()

    async def generate_summary(self, text: str) -> str:
        # Implement summary generation
        # This is a placeholder - implement actual summarization logic
        return text[:200] + "..."

    async def extract_tags(self, text: str) -> List[str]:
        # Implement tag extraction
        # This is a placeholder - implement actual tag extraction logic
        return ["document", "text"]