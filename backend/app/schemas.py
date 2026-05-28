from pydantic import BaseModel
from typing import Optional, List

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    content: str
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    tags: str
    orbit_radius: float = 1.5
    orbit_speed: float = 0.5

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# --- TechStack Schemas ---
class TechStackBase(BaseModel):
    name: str
    category: str
    proficiency: int
    icon: Optional[str] = None

class TechStackCreate(TechStackBase):
    pass

class TechStack(TechStackBase):
    id: int

    class Config:
        from_attributes = True

# --- Academic Schemas ---
class AcademicBase(BaseModel):
    institution: str
    degree: str
    major: Optional[str] = None
    gpa: Optional[str] = None
    start_date: str
    end_date: str
    description: Optional[str] = None

class AcademicCreate(AcademicBase):
    pass

class Academic(AcademicBase):
    id: int

    class Config:
        from_attributes = True

# --- Social Schemas ---
class SocialBase(BaseModel):
    platform: str
    url: str
    icon: Optional[str] = None

class SocialCreate(SocialBase):
    pass

class Social(SocialBase):
    id: int

    class Config:
        from_attributes = True
