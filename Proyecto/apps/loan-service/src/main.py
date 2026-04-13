from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from logic.calculator import calcular_prestamo
import schemas

app = FastAPI(title="Loan Service", description="Servicio de simulaciones financieras")

# Configuración de CORS para permitir la conexión con el Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/simular", response_model=schemas.SimulacionResponse)
def simular_credito(request: schemas.SimulacionRequest):
    """
    Endpoint público para simular un préstamo de consumo.
    Calcula cuota, tasa y total basándose en el monto y plazo.
    """
    resultado = calcular_prestamo(request.monto, request.cuotas)
    return resultado