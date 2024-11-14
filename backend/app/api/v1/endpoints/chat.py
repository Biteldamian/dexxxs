from typing import List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.schemas.chat import Message, ChatResponse, ChatContext
from app.services.chat import ChatService

router = APIRouter()

@router.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    db: Session = Depends(get_db),
):
    chat_service = ChatService(db)
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            message = Message(**data)
            response = await chat_service.process_message(message)
            await websocket.send_json(response.dict())
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})

@router.post("/messages", response_model=ChatResponse)
async def send_message(
    message: Message,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> ChatResponse:
    chat_service = ChatService(db)
    return await chat_service.process_message(message)

@router.get("/contexts", response_model=List[ChatContext])
async def list_contexts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> List[ChatContext]:
    chat_service = ChatService(db)
    return await chat_service.list_contexts(skip=skip, limit=limit)

@router.post("/contexts", response_model=ChatContext)
async def create_context(
    title: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> ChatContext:
    chat_service = ChatService(db)
    return await chat_service.create_context(title)