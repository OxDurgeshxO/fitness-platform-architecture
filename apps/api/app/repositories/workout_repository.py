import uuid
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.workout import ExerciseLog, WorkoutSession
from app.repositories.base import BaseRepository


class WorkoutRepository(BaseRepository[WorkoutSession]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(WorkoutSession, session)

    async def get_with_logs(self, id: uuid.UUID) -> Optional[WorkoutSession]:
        stmt = (
            select(WorkoutSession)
            .options(selectinload(WorkoutSession.exercise_logs))
            .where(WorkoutSession.id == id, WorkoutSession.deleted_at.is_(None))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> List[WorkoutSession]:
        stmt = (
            select(WorkoutSession)
            .options(selectinload(WorkoutSession.exercise_logs))
            .where(WorkoutSession.user_id == user_id, WorkoutSession.deleted_at.is_(None))
            .order_by(WorkoutSession.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add_exercise_log(self, log: ExerciseLog) -> ExerciseLog:
        self.session.add(log)
        await self.session.flush()
        await self.session.refresh(log)
        return log
