from sqlalchemy.ext.asyncio import AsyncSession
from api.repositories.flowRepository import FlowRepository
from api.schemas.flow import FlowResponse

class FlowService:
    @staticmethod
    async def get_all_processes(db: AsyncSession):
        processes = await FlowRepository.get_all(db)
        return [FlowResponse.model_validate(process) for process in processes]

    @staticmethod
    async def get_process_by_id(db: AsyncSession, process_id: int):
        process = await FlowRepository.get_by_id(db, process_id)
        return FlowResponse.model_validate(process)
