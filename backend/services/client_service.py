from fastapi import HTTPException
from starlette import status

from ..models.db_models import Client

def get_client(db, id: int):
  client = db.query(Client).filter(Client.id == id).first()
  if not client:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found.")
  
  return client

def check_existing_email(db, email: str, client_id: int | None = None):
    query = db.query(Client).filter(Client.email == email)

    if client_id is not None:
        query = query.filter(Client.id != client_id)

    existing_client = query.first()

    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )