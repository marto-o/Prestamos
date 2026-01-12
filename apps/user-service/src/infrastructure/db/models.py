import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class UserTable(Base):
    """
    Representación de la tabla 'users' en PostgreSQL.
    Define la estructura de identidad del cliente siguiendo el modelo de dominio.
    """
    __tablename__ = "users"

    # Usamos UUID para evitar IDs secuenciales predecibles y mejorar la seguridad
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # RUT como índice único para búsquedas rápidas durante el login/registro
    rut = Column(String(12), unique=True, nullable=False, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    # Almacenará el hash resultante de Bcrypt, nunca la clave real
    password = Column(String(255), nullable=False) 
    email = Column(String(150), unique=True, nullable=False)
    telefono = Column(String(20), nullable=True)