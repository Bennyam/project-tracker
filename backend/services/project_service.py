from fastapi import HTTPException
from starlette import status

def get_project(client, project_id):
  for project in client.projects:
    if project.id == project_id:
      return project
  raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
