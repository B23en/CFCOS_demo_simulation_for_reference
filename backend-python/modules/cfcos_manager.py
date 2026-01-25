import uuid

from .cfcos import CFCOS
from .user_identity import UserIdentity

class CFCOS_MANAGER:
    def __init__(self):
        self.sessions = {}
        print("✅ Session Manager started...")

    def add_session(self, cfcos: CFCOS, user_identity: UserIdentity):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "cfcos": cfcos,
            "user_identity": user_identity
        }
        print(f"✅ New session [{session_id}] is registered.")
        return session_id

    def remove_session(self, session_id):
        session = self.sessions.pop(session_id, None)
        if session is not None:
            print(f"✅ Session [{session_id}] is unregistered.")
        else:
            print(f"⚠️ Session [{session_id}] does not exist.")