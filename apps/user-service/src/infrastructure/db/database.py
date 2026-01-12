from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user_admin:PCt7wo4!@localhost:5432/users_db"

# El 'engine' es el encargado de la conexión física
engine = create_engine(DATABASE_URL)

# 'SessionLocal' es lo que usaremos para hacer consultas (SELECT, INSERT, etc)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Función para obtener una sesión de base de datos de forma limpia"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()