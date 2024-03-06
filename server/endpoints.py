from app import app, cogauth, db
from flask_cognito import cognito_auth_required, current_cognito_jwt, current_user
from flask import request, jsonify
from sqlalchemy import and_, or_
from sqlalchemy.sql import func
from util import create_presigned_url
import dateutil.parser

@cogauth.identity_handler
def lookup_cognito_user(payload):
    from models import Users
    username = payload.get('cognito:username') if payload.get(
        'cognito:username') else payload['username']
    """Look up user in our database from Cognito JWT payload."""
    return Users.query.filter(Users.username == username).one_or_none()


@app.route("/login", methods=["GET", "POST"])
@cognito_auth_required
def verify_login():
    from models import Users
    app.logger.info("Lookup")
    app.logger.warning('testing warning log')
    app.logger.error('testing error log')
    app.logger.info('testing info log')
    try:
        if not current_user:
            new_user = Users(current_cognito_jwt['cognito:username'],
                             request.values['isCaregiver'] == 'true',
                             current_cognito_jwt['email'],
                             request.values['isParent'] == 'true')
            db.session.add(new_user)
            db.session.commit()
    except Exception as ex:
        print("Error adding new user")
        app.logger.error(ex)
        print(ex)
        print(list(request.values))
        return jsonify({
            'completionStatus': 'Incomplete'
        })
    return jsonify({
        'completionStatus': 'Complete'
    })


@app.route("/getuserinfo", methods=["GET"])
@cognito_auth_required
def get_user_info():
    # Prerequsite is a valid JWT id. So user is authenticated already.
    if (current_user):
        info = current_user.serialize()
        return_json = {
            "username": info['username'], "caregiver": info['caregiver'], "parent": info['parent']}
        return jsonify(return_json)
    else:
        return jsonify({"error": "No user info available for user"})


@app.route("/sendcaregiverrequest", methods=["GET", "POST"])
@cognito_auth_required
def send_caregiver_request():
    from models import Users, CaregiverRequests
    email = request.get_json()['requestToEmail']
    target_user = Users.query.filter(Users.email == email).one_or_none()
    if not target_user:
        return jsonify({'success': False, 'error': 'No user with the specified email exists.'})
    result = CaregiverRequests.query.filter(
        CaregiverRequests.uid_from == current_user.id
        and CaregiverRequests.uid_to == target_user.id).all()
    if not result:
        new_request = CaregiverRequests(current_user.id, target_user.id)
        db.session.add(new_request)
        db.session.commit()
        return jsonify(success=True)
    else:
        return jsonify({"success": False, "error": "Request already exists between the two users specified."})


@app.route("/sendcaregiveerequest", methods=["GET", "POST"])
@cognito_auth_required
def send_caregivee_request():
    from models import Users, CaregiveeRequests
    email = request.get_json()['requestToEmail']
    target_user = Users.query.filter(
        and_(Users.email == email, Users.caregiver == False)).one_or_none()
    if not target_user:
        return jsonify({'success': False, 'error': 'No caregivee with the specified email exists.'})
    result = CaregiveeRequests.query.filter(
        CaregiveeRequests.uid_from == current_user.id
        and CaregiveeRequests.uid_to == target_user.id).all()
    print("RESULT", result)
    if not result:
        new_request = CaregiveeRequests(current_user.id, target_user.id)
        db.session.add(new_request)
        db.session.commit()
        return jsonify(success=True)
    else:
        return jsonify({"success": False, "error": "Request already exists between the two users specified."})


@app.route("/createcaregiver", methods=["GET", "POST"])
@cognito_auth_required
def create_caregiver():
    from models import Users, Groups
    email = request.get_json()['parentCaregiver']
    target_user = Users.query.filter(Users.email == email).one_or_none()
    if not target_user:
        return jsonify({'success': False, 'error': 'No user with the specified email exists.'})
    # Assumption is that parents don't have multiple caregivees
    # Parent is the link between caregivers and caregivees. Caregivee cannot exist without a parent.
    # The association in a group is indiscriminant of the type of user they are.
    groupExists = Groups.query.filter(
        Groups.members.contains(target_user)).all()
    #groupExists = Groups.query.join(Users).filter(Users.id == current_user.id)
    print(list(groupExists))
    if not groupExists:
        group = Groups()
        group.members.append(current_user)
        group.members.append(target_user)
        db.session.add(group)
    else:
        groupExists[0].members.append(target_user)
    db.session.commit()
    return jsonify(success=True)


@app.route("/createcaregivee", methods=["GET", "POST"])
@cognito_auth_required
def create_caregivee():
    """Coming from caregivee so current_user is caregivee"""
    from models import Users, Groups
    email = request.get_json()['caregiver']
    app.logger.debug("create_caregivee email " + email)
    # TODO change AWS so only one email can be used per account
    target_user = Users.query.filter(Users.email == email).one_or_none()
    if not target_user:
        app.logger.error()
        return jsonify({'success': False, 'error': 'No user with the specified email exists.'})
    # Assumption is that parents don't have multiple caregivees
    # Parent is the link between caregivers and caregivees. Caregivee cannot exist without a parent.
    # The association in a group is indiscriminant of the type of user they are.
    groupExists = Groups.query.filter(
        Groups.members.contains(target_user)).all()
    #groupExists = Groups.query.join(Users).filter(Users.id == current_user.id)
    print(list(groupExists))
    if not groupExists:
        group = Groups()
        group.members.append(current_user)
        group.members.append(target_user)
        db.session.add(group)
    else:
        groupExists[0].members.append(target_user)
    db.session.commit()
    return jsonify(success=True)


@app.route("/getcaregivers", methods=["GET"])
@cognito_auth_required
def get_caregivers():
    return getUsers(True, current_user)


@app.route("/notificationcreation", methods=["GET", "POST"])
@cognito_auth_required
def create_notification():
    try:
        from models import Notifications, Users, NotificationStatus
        from sqlalchemy.sql import func
        data = request.get_json()
        caregivee = data['sentTo']
        task = data['task']
        email = caregivee['description']
        caregivee_user = Users.query.filter(Users.email == email).one_or_none()
        if not caregivee_user:
            print("No caregivee user exists with given email")
            return jsonify(success=False)
        queued_notification = Notifications(
            task['id'], func.now(), None, None, None, NotificationStatus.NOT_STARTED, current_user.id, caregivee_user.id)
        db.session.add(queued_notification)
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        print(e)
        return jsonify(success=False)


@app.route("/getnotificationscaregivee", methods=["GET"])
@cognito_auth_required
def get_notifications_caregivee():
    from models import Notifications, NotificationStatus, Tasks
    past = Notifications.query.filter(
        and_(
            Notifications.time <= func.now(),
            and_(
                Notifications.sent_to == current_user.id,
                Notifications.status == NotificationStatus.NOT_STARTED
            )
        )) \
        .order_by(Notifications.time.desc()).limit(5)
    future = Notifications.query.filter(
        and_(
            Notifications.time > func.now(),
            and_(
                Notifications.sent_to == current_user.id,
                Notifications.status == NotificationStatus.NOT_STARTED
            )
        )) \
        .order_by(Notifications.time.desc()).limit(5)
    result_notifications_raw = db.session.query(
        Notifications).from_statement(past.union(future))
    result_notifications = list(
        map(lambda x: x.serialize(), result_notifications_raw))
    print("NOTIFICATIONS CAREGIVEE", result_notifications)
    output_elements = []
    notification_ux_elements = {}
    for notification in result_notifications:
        notification_ux_elements['id'] = notification['id']
        task_information = Tasks.query.filter(
            Tasks.id == notification['task_id']).one_or_none()
        if not task_information:
            print("Error finding task")
            return jsonify(success=False)

        notification_ux_elements['name'] = task_information.name
        if (task_information.image_url):
            notification_ux_elements['icon'] = create_presigned_url(
                "public/"+task_information.image_url)
            print("url", notification_ux_elements['icon'])
        else:
            notification_ux_elements['icon'] = "image"

        if (task_information.video_url):
            notification_ux_elements['video'] = create_presigned_url(
                "public/"+task_information.video_url)
            print("url", notification_ux_elements['video'])
        else:
            notification_ux_elements['video'] = None

        if (task_information.sound_url):
            notification_ux_elements['sound'] = create_presigned_url(
                "public/"+task_information.sound_url)
            print("url", notification_ux_elements['video'])
        else:
            notification_ux_elements['sound'] = None
        

        if (task_information.image_url_reward):
            notification_ux_elements['image_reward'] = create_presigned_url(
                "public/"+task_information.image_url_reward)
        else:
            notification_ux_elements['image_reward'] = "image" 

        if (task_information.video_url_reward):
            notification_ux_elements['video_reward'] = create_presigned_url(
                "public/"+task_information.video_url_reward)
        else:
            notification_ux_elements['video_reward'] = None

        if (task_information.sound_url_reward):
            notification_ux_elements['sound_reward'] = create_presigned_url(
                "public/"+task_information.sound_url_reward)
        else:
            notification_ux_elements['sound_reward'] = None
        
        # Information we have because of previous SQL statements.
        notification_ux_elements['sentTo'] = current_user.username

        # Set up dates into ISO Strings
        dates = create_iso_string(notification)
        dates.update(notification_ux_elements)
        output_elements.append(dates)
        notification_ux_elements = {}
        dates = {}
    return jsonify(output_elements)


@app.route("/getnotifications", methods=["GET"])
@cognito_auth_required
def get_notifications():
    from models import Notifications, Users, Tasks, group_membership
    group_relations = current_user.member_of
    group_relations = list(map(lambda x: x.id, group_relations))
    memberships = db.session.query(group_membership).filter(and_(
        group_membership.c.group_id.in_(group_relations),
        group_membership.c.uid != current_user.id)).all()
    group_members = list(map(lambda x: x.uid, memberships))
    past = Notifications.query.filter(and_(
            Notifications.time <= func.now(), 
            Notifications.sent_by.in_(group_members)\
        )
    ) .order_by(Notifications.time.desc()).limit(5)

    future = Notifications.query.filter(and_(
            Notifications.time > func.now(), 
            Notifications.sent_by.in_(group_members)\
        )
    ) .order_by(Notifications.time.desc()).limit(10)

    result_notifications = db.session.query(
        Notifications).from_statement(past.union(future))
    result_notifications = list(
        map(lambda x: x.serialize(), result_notifications))
    print("NOTIFICATIONS", result_notifications)
    output_elements = []
    notification_ux_elements = {}
    #id_count = 1
    for notification in result_notifications:
        notification_ux_elements['id'] = notification['id']
        task_information = Tasks.query.filter(
            Tasks.id == notification['task_id']).one_or_none()
        if not task_information:
            print("Error finding task")
            return jsonify(success=False)

        notification_ux_elements['name'] = task_information.name
        if (task_information.image_url):
            notification_ux_elements['icon'] = create_presigned_url(
                "public/"+task_information.image_url)
            print("url", notification_ux_elements['icon'])
        else:
            notification_ux_elements['icon'] = "image"

        if (task_information.video_url):
            notification_ux_elements['video'] = create_presigned_url(
                "public/"+task_information.image_url)
            print("url", notification_ux_elements['video'])
        else:
            notification_ux_elements['video'] = None

        userInfo = Users.query.filter(
            Users.id == notification['sent_to']).one_or_none()
        if not userInfo:
            print("Error finding sentTo information")
            return jsonify(success=False)
        notification_ux_elements['sentTo'] = userInfo.username
        # Set up dates into UTC Strings
        dates = create_iso_string(notification)
        dates.update(notification_ux_elements)
        output_elements.append(dates)
        notification_ux_elements = {}
        dates = {}
        #id_count += 1
    return jsonify(output_elements)


@app.route("/notificationupdate", methods=["GET", "POST"])
@cognito_auth_required
def notification_update():
    from models import Notifications, NotificationStatus
    data = request.get_json()
    print("JSON", data)
    date_started = date_completed = None
    if data['dateStarted']:
        date_started = dateutil.parser.isoparse(data['dateStarted'])
    if data['dateCompleted']:
        date_completed = dateutil.parser.isoparse(data['dateCompleted'])
    notification = Notifications.query.filter(Notifications.id == data['id']).first()   
    print("DATE_STARTED", date_started)
    print("DATE_COMPLETED", date_completed)
    notification.start_time = date_started if date_started else notification.start_time
    notification.completion_time = date_completed if date_completed else notification.completion_time
    notification.status =NotificationStatus.COMPLETED;
    db.session.commit()
    notification = Notifications.query.filter(Notifications.id == data['id']).first()   
    print("UPDATE", notification.start_time, notification.completion_time)

    return jsonify(success=True)


@app.route("/taskcreation", methods=["GET", "POST"])
@cognito_auth_required
def create_task():
    from models import Tasks, Users, Locations
    try:
        def conv(i): return i or None
        task_data = request.get_json()
        # TODO should sent JWT token from AWS
        name = task_data["name"]
        location = task_data["location"]
        location_id = None
        if (location):
            existing_location = Locations.query.filter(
                Locations.name == location).one_or_none()
            if not existing_location:
                existing_location = Locations(current_user.id, location)
                db.session.add(existing_location)
                db.session.commit()
            location_id = existing_location.id
        description = task_data["description"]
        caregiver_notes = task_data["caregiverNotes"]
        image_url = conv(task_data["image_url"])
        sound_url = conv(task_data["sound_url"])
        video_url = conv(task_data["video_url"])
        image_url_reward = conv(task_data["image_url_reward"])
        sound_url_reward = conv(task_data["sound_url_reward"])
        video_url_reward = conv(task_data["video_url_reward"])

        print("image_url", image_url)
        task = Tasks(current_user.id, name, location_id, description, caregiver_notes,
                     image_url, sound_url, video_url, image_url_reward, sound_url_reward, video_url_reward)
        db.session.add(task)
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        print(e)
        print("Error creating task.")
        return jsonify(success=False)


@app.route("/edittask", methods=["GET", "PUT"])
@cognito_auth_required
def edit_task():
    try:
        from models import Tasks, Locations
        task_data = request.get_json()
        keys = list(task_data.keys())
        for key in keys:
            if(not task_data[key]):
                task_data.pop(key)
        id = task_data['id'] 
        task = Tasks.query.filter(Tasks.id == id).one_or_none()
        if not task:
            print("Error no task found matching id in edittask")
            return jsonify(error=True)
        updated_location = None
        print(task_data)
        
        if task_data.get('location'):
            loc = Locations.query.filter(Locations.id == task.location_id).one_or_none()
            if loc and not task_data.get('location') == loc.name:
                updated_location = Locations(current_user.id, task_data['location'])
                print("Created New location")
        task.name = task_data.get('name', task.name)
        if (updated_location):
            task.location_id = updated_location.id
        task.description = task_data.get('description', task.description)
        task.caregiver_notes = task_data.get('caregiver_notes', task.caregiver_notes)
        task.image_url = task_data.get('image_url', task.image_url)
        task.sound_url = task_data.get('sound_url', task.sound_url)
        task.video_url = task_data.get('video_url', task.video_url),
        task.image_url_reward = task_data.get('image_url_reward', task.image_url_reward),
        task.sound_url_reward = task_data.get('sound_url_reward', task.sound_url_reward),
        task.video_url_reward = task_data.get('video_url_reward', task.video_url_reward),
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        print(e)
        return jsonify(error=True)

@app.route("/deletetask", methods=["GET", "DELETE"])
@cognito_auth_required
def delete_task():
    try:
        from models import Tasks
        task_data = request.args
        id = task_data['id']
        Tasks.query.filter(Tasks.id == id).delete()
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        print(e)
        return jsonify(error=True)

@app.route("/gettasks", methods=["GET"])
@cognito_auth_required
def get_tasks():
    from models import Tasks, Locations, group_membership
    user_groups = current_user.member_of
    user_group_ids = list(map(lambda x: x.id, user_groups))

    # Accepted that this will return current_user as one of the entries.
    # Necessary so that all tasks are received. 
    users_in_shared_group = db.session.query(group_membership).filter(
        group_membership.c.group_id.in_(user_group_ids)
    ).all()
    users_in_shared_group = set(map(lambda x: x.uid, users_in_shared_group))
    print("USERS IN GROUP", users_in_shared_group)
    tasks_to_return = Tasks.query.filter(
        Tasks.created_by.in_(users_in_shared_group)).all()
    tasks_to_return = list(tasks_to_return)
    tasks_to_return = list(map(lambda x: x.serialize(), tasks_to_return))
    for x in tasks_to_return:
        print(x['location_id'])
        location = Locations.query.filter(
            Locations.id == x['location_id']).one_or_none()
        x.pop('notifications')
        if location:
            x['location'] = location.name
        else:
            x['location'] = "" 
    
    return jsonify(tasks_to_return)


@app.route("/getcaregiverrequests", methods=["GET"])
@cognito_auth_required
def get_caregiver_requests():
    from models import CaregiverRequests, Users
    results = CaregiverRequests.query.filter(
        CaregiverRequests.uid_to == current_user.id).all()
    results = list(map(lambda x: x.serialize(), results))
    ids = []
    for map_element in results:
        ids.append(map_element['uid_from'])
    print("RESULTS", ids)
    users = Users.query.filter(Users.id.in_(ids)).all()
    results = list(map(lambda x: x.serialize(), users))
    print(results)
    return_map = []
    for user in results:
        print("KEYS", user.keys())
        temp_data = {}
        temp_data['sentFromCaregiver'] = user['email']
        return_map.append(temp_data)
    return jsonify(return_map)

@app.route("/getcaregiveerequestssent", methods=["GET"])
@cognito_auth_required
def get_caregivee_requests_sent():
    from models import CaregiveeRequests, Users
    results = CaregiveeRequests.query.filter(
        CaregiveeRequests.uid_from == current_user.id).all()
    results = list(map(lambda x: x.serialize(), results))
    ids = []
    for map_element in results:
        ids.append(map_element['uid_to'])
    users = Users.query.filter(Users.id.in_(ids)).all()
    results = list(map(lambda x: x.serialize(), users))
    return_map = []
    for user in results:
        temp_data = {}
        temp_data['sentToCaregivee'] = user['email']
        return_map.append(temp_data)
    return jsonify(return_map)

@app.route("/getcaregiverrequestssent", methods=["GET"])
@cognito_auth_required
def get_caregiver_requests_sent():
    from models import CaregiverRequests, Users
    results = CaregiverRequests.query.filter(
        CaregiverRequests.uid_from == current_user.id).all()
    results = list(map(lambda x: x.serialize(), results))
    ids = []
    for map_element in results:
        ids.append(map_element['uid_to'])
    users = Users.query.filter(Users.id.in_(ids)).all()
    results = list(map(lambda x: x.serialize(), users))
    return_map = []
    for user in results:
        temp_data = {}
        temp_data['sentToCaregiver'] = user['email']
        return_map.append(temp_data)
    return jsonify(return_map)



@app.route("/getcaregiveerequestsbycaregivee", methods=["GET"])
@cognito_auth_required
def get_caregivee_requests():
    from models import CaregiveeRequests, Users
    results = CaregiveeRequests.query.filter(
        CaregiveeRequests.uid_to == current_user.id).all()
    results = list(map(lambda x: x.serialize(), results))
    ids = []
    for map_element in results:
        ids.append(map_element['uid_from'])
    print("RESULTS", ids)
    users = Users.query.filter(Users.id.in_(ids)).all()
    results = list(map(lambda x: x.serialize(), users))
    print(results)
    return_map = []
    for user in results:
        print("KEYS", user.keys())
        temp_data = {}
        temp_data['sentFromCaregiver'] = user['email']
        return_map.append(temp_data)
    return jsonify(return_map)


@app.route("/getlocations", methods=["GET"])
@cognito_auth_required
def get_locations():
    from models import Locations, Tasks
    user_owned_tasks = Tasks.query.filter(
        Tasks.created_by == current_user.id).all()
    location_list = list(map(lambda x: x.location_id, user_owned_tasks))
    locations = Locations.query.filter(
        or_(
            Locations.created_by == current_user.id,
            Locations.id.in_(location_list))
    ).all()
    locations = list(map(lambda x: x.serialize(), locations))
    print("Location ", locations)
    output_locations = []
    temp_map = {}
    for loc in locations:
        temp_map['id'] = loc['id']
        temp_map['name'] = loc['name']
        output_locations.append(temp_map)
        temp_map = {}
    return jsonify(output_locations)


@app.route("/getcaregivees", methods=["GET"])
@cognito_auth_required
def get_caregivees():
    return getUsers(False, current_user)


@app.route("/getparentcaregivers", methods=["GET"])
@cognito_auth_required
def get_parent_caregivers():
    if current_user.parent:
        return jsonify({"success": False, "error": "User is a parent themselves"})
    from models import Users, group_membership
    group_relations = current_user.member_of
    # Filter for all members of the group that are not current user
    memberships = db.session.query(group_membership).filter(and_(
        group_membership.c.group_id.in_(group_relations),
        group_membership.c.uid != current_user.id)).all()
    # parents = Users.query.filter(
    return jsonify(success=True)


def create_iso_string(notification):
    notification_ux_elements = {}
    notification_ux_elements['dateSent'] = None
    if (notification['created_time']):
        notification_ux_elements['dateSent'] = \
            notification['created_time'] \
            .isoformat()

    notification_ux_elements['dateStarted'] = None
    if (notification['start_time']):
        notification_ux_elements['dateStarted'] = \
            notification['start_time'] \
            .isoformat()

    notification_ux_elements['dateCompleted'] = None
    if(notification['completion_time']):
        notification_ux_elements['dateCompleted'] = \
            notification['completion_time'] \
            .isoformat()
    return notification_ux_elements


def getUsers(lookForCaregivers, user):
    """Determines other members of a users group 
    filters for type of users based on input flag"""
    current_user = user
    from models import Users, group_membership
    group_relations = list(current_user.member_of)
    group_ids = []
    # Get all group ids that the user is a part of
    for group in group_relations:
        group_ids.append(group.id)
    print("LIST", group_ids)
    # Filter for all members of the group that are not current user
    memberships = db.session.query(group_membership).filter(and_(
        group_membership.c.group_id.in_(group_ids),
        group_membership.c.uid != current_user.id)).all()
    print(list(memberships))
    member_ids = list(map(lambda x: x.uid, memberships))
    members_of_group = None
    if (lookForCaregivers):
        members_of_group = Users.query.filter(
            and_(
                Users.id.in_(member_ids),
                Users.parent == False
            )).all()
    else:
        members_of_group = Users.query.filter(
            and_(
                Users.caregiver == False,
                and_(
                    Users.id.in_(member_ids),
                    Users.parent == False
                ))).all()

    serialized_members = list(map(lambda x: x.serialize(), members_of_group))
    output_list = []
    print("MEMBERS", serialized_members)
    member_map = {}
    id = 1
    for user in serialized_members:
        member_map['id'] = id
        member_map['name'] = user['username']
        # Frontend mapping
        member_map['icon'] = 'account-circle'
        member_map['description'] = user['email']
        # Needs discussion
        member_map['canEdit'] = False
        id += 1
        output_list.append(member_map)
        member_map = {}
    return jsonify(output_list)
