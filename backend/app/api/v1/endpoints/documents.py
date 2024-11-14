from typing import List
from fastapi import APIRouter, Depends, File, UploadFile, BackgroundTasks, Form
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.schemas.document import DocumentCreate, DocumentResponse, FolderCreate, FolderResponse
from app.services.document_processor import DocumentProcessor
from app.models.document import Document

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    folder_id: str = Form(None),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    processor = DocumentProcessor(db)
    document = await processor.create_document(file, folder_id)
    
    # Process document in background
    background_tasks.add_task(
        processor.process_document,
        document.id,
        file
    )
    
    return document

@router.post("/folders", response_model=FolderResponse)
async def create_folder(
    folder: FolderCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    processor = DocumentProcessor(db)
    return await processor.create_folder(folder)

@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    folder_id: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    query = db.query(Document)
    if folder_id:
        query = query.filter(Document.folder_id == folder_id)
    documents = query.offset(skip).limit(limit).all()
    return documents

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    return document

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document:
        db.delete(document)
        db.commit()
    return {"status": "success"}