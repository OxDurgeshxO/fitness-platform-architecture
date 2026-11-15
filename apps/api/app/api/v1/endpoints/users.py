from typing import Annotated, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies import get_current_active_user, get_current_admin
from app.core.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
async def read_user_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserRead:
    repo = UserRepository(db)
    update_dict = user_update.model_dump(exclude_unset=True)
    updated = await repo.update(current_user, update_dict)
    return UserRead.model_validate(updated)


@router.get("/", response_model=List[UserRead], dependencies=[Depends(get_current_admin)])
async def list_users(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> List[UserRead]:
    repo = UserRepository(db)
    users = await repo.list(skip=skip, limit=limit)
    return [UserRead.model_validate(u) for u in users]
