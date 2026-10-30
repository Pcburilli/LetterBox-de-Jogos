from app import db

class Games(db.Model):
    __tablename__='games'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    name_slug = db.Column(db.String(90), nullable=False, unique=True)
    year = db.Column(db.String(15), nullable=True)
    cover_url = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)

    users_game = db.relationship('Games_Users', backref='games', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Reviews', backref='games', lazy=True, cascade="all, delete-orphan")
    
    developers = db.relationship('Developers', secondary='games_developers', lazy='subquery', backref=db.backref('games', lazy=True))
    tags = db.relationship('Tags', secondary='games_tags', lazy='subquery', backref=db.backref('games', lazy=True))
    genres = db.relationship('Genres', secondary='games_genres', lazy='subquery', backref=db.backref('games', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'name_slug': self.name_slug,
            'year': self.year,
            'cover_url': self.cover_url,
            'description': self.description,
            'tags': [t.name for t in self.tags],
            'genres': [g.name for g in self.genres],
            'developers': [d.name for d in self.developers]
        }