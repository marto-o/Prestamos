from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    rut: str
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    telefono: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str