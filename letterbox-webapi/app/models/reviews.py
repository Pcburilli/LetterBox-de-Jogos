from app import db

class Reviews(db.Model):
    __tablename__ = 'reviews'

    __table_args__ = (
        db.UniqueConstraint('user_id', 'game_id', name='uq_user_game_review'),
    )

    id = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer, nullable=True)
    review = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'user_id': self.user_id,
            'rate': self.rate,
            'review': self.review,
        }