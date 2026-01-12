from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from infrastructure.db.database import get_db
from infrastructure.db.models import UserTable
from infrastructure.auth.hash_handler import hash_password
import schemas

app = FastAPI()

# Configuración de CORS: Necesaria para permitir peticiones desde el origen del Frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo cliente en el sistema.
    
    1. Valida unicidad de RUT y Email.
    2. Aplica hashing a la contraseña para almacenamiento seguro.
    3. Persiste los datos en la base de datos relacional.
    """
    db_user = db.query(UserTable).filter(
        (UserTable.rut == user_data.rut) | (UserTable.email == user_data.email)
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="El RUT o Email ya está registrado")

    new_user = UserTable(
        rut=user_data.rut,
        nombre=user_data.nombre,
        apellido=user_data.apellido,
        email=user_data.email,
        password=hash_password(user_data.password),
        telefono=user_data.telefono
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Usuario registrado exitosamente", "user_id": str(new_user.id)}