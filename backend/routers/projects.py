from fastapi import APIRouter, Path
from starlette import status
from ..data.database import db_dependency
from ..models.db_models import Project
from ..models.schemas import ProjectRequest
from ..services.client_service import get_client
from ..services.project_service import get_project

router = APIRouter(prefix="/clients", tags=["Client Projects"])

@router.get("/{id}/projects", status_code=status.HTTP_200_OK)
async def get_client_projects(db: db_dependency, id: int = Path(gt=0)):
  client = get_client(db, id)
  
  return client.projects

@router.post("/{id}/projects", status_code=status.HTTP_201_CREATED)
async def create_project(db: db_dependency, project_request: ProjectRequest, id: int = Path(gt=0)):
  client = get_client(db, id)
  
  new_project = Project(**project_request.model_dump(), client_id=id)
  db.add(new_project)
  db.commit()
  db.refresh(new_project)
  return new_project

@router.put("/{id}/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT) 
async def update_project(db: db_dependency, project_request: ProjectRequest, id: int = Path(gt=0), project_id: int = Path(gt=0)):
  client = get_client(db, id);
  project = get_project(client, project_id)
  
  project.name = project_request.name
  project.description = project_request.description
  project.budget = project_request.budget
  project.status = project_request.status
  
  db.commit()
  
@router.delete("/{id}/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(db: db_dependency, id: int = Path(gt=0), project_id: int = Path(gt=0)):
  client = get_client(db, id)
  project = get_project(client, project_id)
  
  db.delete(project)
  db.commit()
  
  
  
  
  
  
  
  