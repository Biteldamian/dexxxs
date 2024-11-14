import asyncio
from typing import TypeVar, Callable, Any
from functools import wraps
import logging

T = TypeVar("T")

logger = logging.getLogger(__name__)

def with_retry(
    retries: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple = (Exception,)
) -> Callable:
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exception = None
            current_delay = delay

            for attempt in range(retries):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    logger.warning(
                        f"Attempt {attempt + 1}/{retries} failed: {str(e)}"
                    )
                    if attempt < retries - 1:
                        await asyncio.sleep(current_delay)
                        current_delay *= backoff
                    continue

            raise last_exception

        return wrapper

    return decorator