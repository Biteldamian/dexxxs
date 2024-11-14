from typing import Dict, Set
from fastapi.websockets import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str = "default"):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = set()
        self.active_connections[room].add(websocket)

    async def disconnect(self, websocket: WebSocket, room: str = "default"):
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)
            if not self.active_connections[room]:
                del self.active_connections[room]

    async def broadcast(self, message: dict, room: str = "default"):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_json(message)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)