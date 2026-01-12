# Sistema de Préstamos Online - Microservicios

Este proyecto es una plataforma fintech para gestión de préstamos de consumo.

## Arquitectura
- **Backend:** Python (FastAPI) con Arquitectura Hexagonal.
- **Frontend:** React (Vite).
- **Base de Datos:** PostgreSQL corriendo en Docker.

## Requisitos
1. Docker y Docker Compose.
2. Python 3.12+ (WSL recomendado).
3. Node.js 20+.

## Instalación Rápida
1. Levantar DB: `docker-compose up -d`
2. Iniciar Backend: `cd apps/user-service && source venv/bin/activate && uvicorn src.main:app`
3. Iniciar Frontend: `cd apps/frontend && npm run dev`