"""empty message

Revision ID: 73a4685201c5
Revises: 25e9be4d3ba6
Create Date: 2022-01-30 23:07:57.262507

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73a4685201c5'
down_revision = '25e9be4d3ba6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tasks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('sound_url', sa.String(), nullable=True),
    sa.Column('video_url', sa.String(), nullable=True),
    sa.Column('image_url_reward', sa.String(), nullable=True),
    sa.Column('sound_url_reward', sa.String(), nullable=True),
    sa.Column('video_url_reward', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('Tasks')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Tasks',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Tasks_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('created_by', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('location', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('image_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('sound_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('video_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('image_url_reward', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('sound_url_reward', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('video_url_reward', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='Tasks_pkey')
    )
    op.drop_table('tasks')
    # ### end Alembic commands ###
