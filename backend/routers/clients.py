from fastapi import APIRouter, Path
from starlette import status
from ..data.database import db_dependency
from ..models.db_models import Client
from ..models.schemas import ClientRequest
from ..services.client_service import get_client, check_existing_email

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_clients(db: db_dependency):
  return db.query(Client).all()

@router.get("/{id}")
async def get_client_by_id(db: db_dependency, id: int = Path(gt=0)):
  client = get_client(db, id)
  
  return client

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_client(db: db_dependency, client_request: ClientRequest):
  check_existing_email(db, client_request.email)
  
  new_client = Client(**client_request.model_dump())
  db.add(new_client)
  db.commit()
  db.refresh(new_client)
  return new_client

@router.put("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_client(db: db_dependency, client_request: ClientRequest, id: int = Path(gt=0)):
  client = get_client(db, id)
  
  check_existing_email(db, client_request.email, id)
  
  client.email = client_request.email  
  client.name = client_request.name
  client.company = client_request.company
  client.status = client_request.status
  
  db.commit()
  
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(db: db_dependency, id: int = Path(gt=0)):
  client = get_client(db, id)
  
  db.delete(client)
  db.commit()