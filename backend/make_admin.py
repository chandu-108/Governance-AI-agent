from app.db.database import SessionLocal
from app.models.user import User

def make_all_users_admin():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for u in users:
            u.role = "admin"
        db.commit()
        print(f"Successfully updated {len(users)} users to 'admin' role.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    make_all_users_admin()
