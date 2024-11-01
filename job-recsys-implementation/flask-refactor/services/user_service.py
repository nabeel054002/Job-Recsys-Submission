from models.user_model import UserModel

class UserService:
    def __init__(self):
        self.user_model = UserModel()

    def get_skills(self, username, skill_type):
        return self.user_model.get_skills(username, skill_type)

    def add_skills(self, data):
        return self.user_model.add_skills(data)

    def get_usertype(self, data):
        return self.user_model.get_usertype(data)
