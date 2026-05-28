from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=False)
    content = Column(String, nullable=False) # Markdown detail
    image_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    tags = Column(String, nullable=False) # Comma-separated tags
    orbit_radius = Column(Float, nullable=False, default=1.5)
    orbit_speed = Column(Float, nullable=False, default=0.5)

class TechStack(Base):
    __tablename__ = "tech_stacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False) # frontend, backend, tools, infra
    proficiency = Column(Integer, nullable=False, default=3) # 1 to 5
    icon = Column(String, nullable=True)

class Academic(Base):
    __tablename__ = "academics"

    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    major = Column(String, nullable=True)
    gpa = Column(String, nullable=True)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    description = Column(String, nullable=True)

class Social(Base):
    __tablename__ = "socials"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, unique=True, index=True, nullable=False)
    url = Column(String, nullable=False)
    icon = Column(String, nullable=True)
