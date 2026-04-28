from sqlalchemy import String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..data.database import Base

class Client(Base):
  __tablename__ = "clients"
  
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  name: Mapped[str] = mapped_column(String, nullable=False)
  email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
  company: Mapped[str | None] = mapped_column(String, nullable=True)
  status: Mapped[str] = mapped_column(String, nullable=False, default="inactive")
  
  projects: Mapped[list["Project"]] = relationship("Project", back_populates="client", cascade="all, delete-orphan")
  
  
class Project(Base):
  __tablename__ = "projects"
  
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"), nullable=False)
  name: Mapped[str] = mapped_column(String, nullable=False)
  description: Mapped[str | None] = mapped_column(String, nullable=True)
  budget: Mapped[float] = mapped_column(Float, nullable=False)
  status: Mapped[str] = mapped_column(String, nullable=False, default="planned")
  
  client: Mapped["Client"] = relationship("Client", back_populates="projects")
  