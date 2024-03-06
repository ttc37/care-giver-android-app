from email.mime import image
from app import db
import enum
from sqlalchemy.inspection import inspect
from sqlalchemy.sql import func
from sqlalchemy import Enum

group_membership = db.Table('membership', db.metadata,
                            db.Column('group_id', db.Integer,
                                      db.ForeignKey('groups.id')),
                            db.Column('uid', db.Integer,
                                      db.ForeignKey('users.id')),
                            )


class NotificationStatus(enum.Enum):
    NOT_STARTED = 1
    STARTED = 2
    COMPLETED = 3
    LATE = 4


class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


class Users(db.Model, Serializer):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    caregiver = db.Column(db.Boolean, default=True)
    email = db.Column(db.String)
    parent = db.Column(db.Boolean, default=False)
    task_id = db.relationship('Tasks', lazy=True)
    member_of = db.relationship(
        'Groups', secondary=group_membership, back_populates='members')

    def __init__(self, username, caregiver, email, isParent):
        self.caregiver = caregiver
        self.username = username
        self.email = email
        self.parent = isParent

    def __repr__(self):
        return f'id {self.id}'


class Groups(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    members = db.relationship(
        "Users", secondary=group_membership, back_populates="member_of")


class CaregiverRequests(db.Model, Serializer):
    __tablename__ = 'caregiverrequests'
    id = db.Column(db.Integer, primary_key=True)
    uid_from = db.Column(db.Integer, db.ForeignKey('users.id'))
    uid_to = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, uid_from, uid_to):
        self.uid_from = uid_from
        self.uid_to = uid_to


class CaregiveeRequests(db.Model, Serializer):
    __tablename__ = 'caregiveerequests'
    id = db.Column(db.Integer, primary_key=True)
    uid_from = db.Column(db.Integer, db.ForeignKey('users.id'))
    uid_to = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, uid_from, uid_to):
        self.uid_from = uid_from
        self.uid_to = uid_to


class Locations(db.Model, Serializer):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, default="Default")

    def __init__(self, created_by, name):
        self.created_by = created_by
        self.name = name


class Tasks(db.Model, Serializer):
    __tablename__ = 'tasks'  # Lower case table names for postgres
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    description = db.Column(db.String)
    caregiver_notes = db.Column(db.String)
    image_url = db.Column(db.String)
    sound_url = db.Column(db.String)
    video_url = db.Column(db.String)
    image_url_reward = db.Column(db.String)
    sound_url_reward = db.Column(db.String)
    video_url_reward = db.Column(db.String)
    notifications = db.relationship("Notifications", cascade="all, delete", passive_deletes=True)
    def __init__(self, created_by, name, location_id, description, caregiver_notes, image_url, sound_url, video_url, image_url_reward, sound_url_reward, video_url_reward):
        self.created_by = created_by
        self.name = name
        self.location_id = location_id
        self.description = description
        self.caregiver_notes = caregiver_notes
        self.image_url = image_url
        self.sound_url = sound_url
        self.video_url = video_url
        self.image_url_reward = image_url_reward
        self.sound_url_reward = sound_url_reward
        self.video_url_reward = video_url_reward

    def __repr__(self):
        return f'id {self.id}'


class Notifications(db.Model, Serializer):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id', ondelete="CASCADE"))
    time = db.Column(db.DateTime)
    created_time = db.Column(db.DateTime, server_default=func.now())
    start_time = db.Column(db.DateTime)
    completion_time = db.Column(db.DateTime)
    repeated_time = db.Column(db.String)
    status = db.Column(db.Enum(NotificationStatus))
    sent_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    sent_to = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, task_id, time, start_time, completion_time, repeated_time, status, sent_by, sent_to):
        self.task_id = task_id
        self.time = time
        self.start_time = start_time
        self.completion_time = completion_time
        self.repeated_time = repeated_time
        self.sent_by = sent_by
        self.sent_to = sent_to
        self.status = status
