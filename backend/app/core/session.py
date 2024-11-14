from redis import Redis
from typing import Dict, Optional
import json

class SessionManager:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def set_session(self, key: str, value: Dict, expire: int = 3600):
        serialized = {k: json.dumps(v) for k, v in value.items()}
        await self.redis.hset(f"session:{key}", mapping=serialized)
        await self.redis.expire(f"session:{key}", expire)

    async def get_session(self, key: str) -> Optional[Dict]:
        data = await self.redis.hgetall(f"session:{key}")
        if not data:
            return None
        return {k: json.loads(v) for k, v in data.items()}

    async def delete_session(self, key: str):
        await self.redis.delete(f"session:{key}")

    async def update_session(self, key: str, value: Dict):
        current = await self.get_session(key) or {}
        current.update(value)
        await self.set_session(key, current)