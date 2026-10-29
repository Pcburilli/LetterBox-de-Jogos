from app import db, login_manager
from flask_login import UserMixin

class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    icon_url = db.Column(db.String(255), nullable=True, default='/icons_user/icon1.png')
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    reviews = db.relationship('Reviews', backref='users', cascade="all, delete-orphan")
    library = db.relationship('Games_Users', backref='users', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'icon_url': self.icon_url
        }

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Users, int(user_id))