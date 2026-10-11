from app import db
from datetime import datetime

class Games_Users(db.Model):
    __tablename__ = 'games_users'
    creation_date = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(db.Text, default='Na Fila')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id', ondelete='CASCADE'), primary_key=True)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'game_id': self.game_id,
            'creation_date': self.creation_date,
            'status': self.status,
        }