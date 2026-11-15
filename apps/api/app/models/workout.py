import uuid
from typing import List, Optional

from sqlalchemy import JSON, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import SoftDeleteMixin, TimeStampedMixin, UUIDMixin


class WorkoutSession(Base, UUIDMixin, TimeStampedMixin, SoftDeleteMixin):
    __tablename__ = "workout_sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="in_progress"
    )  # in_progress, completed, paused
    total_reps: Mapped[int] = mapped_column(Integer, default=0)
    calories_burned: Mapped[float] = mapped_column(Float, default=0.0)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship("User", back_populates="workouts")
    exercise_logs: Mapped[List["ExerciseLog"]] = relationship(
        "ExerciseLog", back_populates="session", cascade="all, delete-orphan"
    )


class ExerciseLog(Base, UUIDMixin, TimeStampedMixin):
    __tablename__ = "exercise_logs"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workout_sessions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    exercise_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # squat, pushup, curl, etc.
    reps: Mapped[int] = mapped_column(Integer, default=0)
    form_accuracy: Mapped[float] = mapped_column(
        Float, default=1.0
    )  # 0.0 to 1.0 confidence/accuracy score
    feedback_notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    raw_landmarks: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    session: Mapped["WorkoutSession"] = relationship(
        "WorkoutSession", back_populates="exercise_logs"
    )
