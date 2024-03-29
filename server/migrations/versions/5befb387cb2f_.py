"""empty message

Revision ID: 5befb387cb2f
Revises: 3acadeccccf6
Create Date: 2022-02-09 23:33:21.161974

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5befb387cb2f'
down_revision = '3acadeccccf6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('membership',
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.Column('uid', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
    sa.ForeignKeyConstraint(['uid'], ['users.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('membership')
    # ### end Alembic commands ###
