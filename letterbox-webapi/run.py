from app import create_app, db
from app.models import Users

app = create_app()

with app.app_context():
    db.create_all()

    admin = Users.query.filter_by(username='admin').first()
    if admin and not getattr(admin, 'is_admin', False):
        admin.is_admin = True
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')