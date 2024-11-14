from typing import Optional
import httpx
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.base_url = settings.OLLAMA_HOST
        self.default_model = settings.DEFAULT_MODEL

    async def generate_response(
        self,
        prompt: str,
        context: Optional[str] = None,
        model: Optional[str] = None,
    ) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": model or self.default_model,
                    "prompt": prompt,
                    "context": context,
                    "stream": False,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["response"]

    async def generate_embedding(self, text: str) -> list[float]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/embeddings",
                json={
                    "model": self.default_model,
                    "prompt": text,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["embedding"]