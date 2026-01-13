from pydantic import BaseModel

class SimulacionRequest(BaseModel):
    monto: float
    cuotas: int

class SimulacionResponse(BaseModel):
    cuota_mensual: float
    tasa_aplicada: float
    total_pagar: float
    cae: float