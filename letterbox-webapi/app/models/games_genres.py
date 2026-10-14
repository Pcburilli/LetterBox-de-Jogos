from app import db

class Games_Genres(db.Model):
    __tablename__ = 'games_genres'

    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.Text, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'genre':self.genre,
            'game_id': self.game_id,
        }