"""empty message

Revision ID: 93e0ca62d252
Revises: 757a2e0e420b
Create Date: 2022-01-13 15:11:41.846888

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '93e0ca62d252'
down_revision = '757a2e0e420b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Users', sa.Column('caretaker', sa.Boolean(), nullable=True))
    op.drop_column('Users', 'parent')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Users', sa.Column('parent', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.drop_column('Users', 'caretaker')
    # ### end Alembic commands ###
