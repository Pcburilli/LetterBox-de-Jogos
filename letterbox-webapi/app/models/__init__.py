from app.models.users import Users
from app.models.games import Games
from app.models.games_users import Games_Users
from app.models.tags import Tags
from app.models.genres import Genres
from app.models.developers import Developers
from app.models.reviews import Reviews
from app.models.associations import games_tags, games_genres, games_developers

__all__ = ['Users', 'Games', 'Reviews', 'Games_Users', 'Games_Tags', 'Genres', 'games_genres', 'Tags', 'games_tags' , 'Developers', 'games_developers']