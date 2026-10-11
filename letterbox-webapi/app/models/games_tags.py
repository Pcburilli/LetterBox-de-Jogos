from app import db

class Games_Tags(db.Model):
    __tablename__ = 'games_tags'

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.Text, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'tag':self.tag,
            'game_id': self.game_id,
        }