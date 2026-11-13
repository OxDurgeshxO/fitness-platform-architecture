"""initial_schema_users_workouts_exercises

Revision ID: 3089fd8d3a8e
Revises: 
Create Date: 2026-11-13 21:37:02.149557

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3089fd8d3a8e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('role', sa.String(50), nullable=False, server_default='athlete'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. workout_sessions table
    op.create_table(
        'workout_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='in_progress'),
        sa.Column('total_reps', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('calories_burned', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('duration_seconds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f('ix_workout_sessions_id'), 'workout_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_workout_sessions_user_id'), 'workout_sessions', ['user_id'], unique=False)

    # 3. exercise_logs table
    op.create_table(
        'exercise_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workout_sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('exercise_type', sa.String(100), nullable=False),
        sa.Column('reps', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('form_accuracy', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('feedback_notes', sa.String(500), nullable=True),
        sa.Column('raw_landmarks', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_exercise_logs_id'), 'exercise_logs', ['id'], unique=False)
    op.create_index(op.f('ix_exercise_logs_session_id'), 'exercise_logs', ['session_id'], unique=False)


def downgrade() -> None:
    op.drop_table('exercise_logs')
    op.drop_table('workout_sessions')
    op.drop_table('users')
