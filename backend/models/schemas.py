from pydantic import BaseModel, Field, EmailStr


class ClientRequest(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    email: EmailStr | None = None
    company: str | None = Field(default=None, min_length=3, max_length=255)
    status: str = Field(default="inactive")

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "John Doe",
                "email": "example@mail.com",
                "company": "Tesla",
                "status": "active",
            }
        }
    }


class ProjectRequest(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    description: str | None = Field(default=None, min_length=3, max_length=255)
    budget: float = Field(gt=0)
    status: str = Field(default="planned")