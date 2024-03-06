"""empty message

Revision ID: 5791cc1a3701
Revises: 6b77bb995940
Create Date: 2022-01-15 19:42:10.396868

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5791cc1a3701'
down_revision = '6b77bb995940'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('caregiver', sa.Boolean(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('group', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###