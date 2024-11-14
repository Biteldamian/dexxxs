from redis import Redis
from typing import Dict, Optional
import json

class SessionService:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def save_session(self, user_id: str, data: Dict) -> None:
        serialized_data = {k: json.dumps(v) for k, v in data.items()}
        await self.redis.hset(f"session:{user_id}", mapping=serialized_data)
        await self.redis.expire(f"session:{user_id}", 24 * 60 * 60)  # 24 hours

    async def get_session(self, user_id: str) -> Optional[Dict]:
        data = await self.redis.hgetall(f"session:{user_id}")
        if not data:
            return None
        return {k: json.loads(v) for k, v in data.items()}

    async def delete_session(self, user_id: str) -> None:
        await self.redis.delete(f"session:{user_id}")

    async def update_session(self, user_id: str, data: Dict) -> None:
        current_data = await self.get_session(user_id) or {}
        current_data.update(data)
        await self.save_session(user_id, current_data)