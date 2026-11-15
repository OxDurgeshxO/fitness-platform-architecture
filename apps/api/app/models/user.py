from typing import List

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import SoftDeleteMixin, TimeStampedMixin, UUIDMixin


class User(Base, UUIDMixin, TimeStampedMixin, SoftDeleteMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role: Mapped[str] = mapped_column(
        String(50), default="athlete", nullable=False
    )  # athlete, trainer, admin

    workouts: Mapped[List["WorkoutSession"]] = relationship(
        "WorkoutSession", back_populates="user", cascade="all, delete-orphan"
    )
