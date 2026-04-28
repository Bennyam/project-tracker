from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .data.database import Base, engine
from .models.db_models import Project, Client
from .routers import clients, projects

app = FastAPI()

origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(clients.router)
app.include_router(projects.router)


  