import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor()

async def run_in_thread(func, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, lambda: func(*args))
