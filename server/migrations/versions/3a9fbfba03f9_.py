"""empty message

Revision ID: 3a9fbfba03f9
Revises: 405c2a715b96
Create Date: 2022-02-09 22:51:02.772339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3a9fbfba03f9'
down_revision = '405c2a715b96'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('parent_caregiver_groups_parent_id_fkey', 'parent_caregiver_groups', type_='foreignkey')
    op.drop_constraint('parent_caregiver_groups_caregiver_id_fkey', 'parent_caregiver_groups', type_='foreignkey')
    op.drop_column('parent_caregiver_groups', 'caregiver_id')
    op.drop_column('parent_caregiver_groups', 'parent_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('parent_caregiver_groups', sa.Column('parent_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('parent_caregiver_groups', sa.Column('caregiver_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('parent_caregiver_groups_caregiver_id_fkey', 'parent_caregiver_groups', 'users', ['caregiver_id'], ['id'])
    op.create_foreign_key('parent_caregiver_groups_parent_id_fkey', 'parent_caregiver_groups', 'users', ['parent_id'], ['id'])
    # ### end Alembic commands ###
