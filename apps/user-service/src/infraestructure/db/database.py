from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Aquí usamos las credenciales que pusimos en el docker-compose.yml
# Estructura: postgresql://USUARIO:PASSWORD@HOST:PUERTO/DB_NAME
DATABASE_URL = "postgresql://user_admin:secret_password@localhost:5432/prestamos_db"

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