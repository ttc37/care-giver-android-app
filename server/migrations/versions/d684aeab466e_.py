"""empty message

Revision ID: d684aeab466e
Revises: 58507c09640b
Create Date: 2022-03-03 15:12:10.465638

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd684aeab466e'
down_revision = '58507c09640b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notifications', sa.Column('sent_by', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'notifications', 'users', ['sent_by'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'notifications', type_='foreignkey')
    op.drop_column('notifications', 'sent_by')
    # ### end Alembic commands ###
