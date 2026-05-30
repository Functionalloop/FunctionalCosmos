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

# --- Resume Schemas ---

class ResumeExperienceBase(BaseModel):
    role: str
    company: str
    period: str
    description: str
    tags: str   # Comma-separated
    order: int = 0

class ResumeExperienceCreate(ResumeExperienceBase):
    pass

class ResumeExperience(ResumeExperienceBase):
    id: int

    class Config:
        from_attributes = True


class ResumeSkillBase(BaseModel):
    name: str
    category: str
    level: int = 3

class ResumeSkillCreate(ResumeSkillBase):
    pass

class ResumeSkill(ResumeSkillBase):
    id: int

    class Config:
        from_attributes = True


class ResumeEducationBase(BaseModel):
    degree: str
    institution: str
    period: str
    gpa: Optional[str] = None
    description: Optional[str] = None
    order: int = 0

class ResumeEducationCreate(ResumeEducationBase):
    pass

class ResumeEducation(ResumeEducationBase):
    id: int

    class Config:
        from_attributes = True


class ResumeCertificationBase(BaseModel):
    name: str
    issuer: str
    year: str
    badge: Optional[str] = None
    order: int = 0

class ResumeCertificationCreate(ResumeCertificationBase):
    pass

class ResumeCertification(ResumeCertificationBase):
    id: int

    class Config:
        from_attributes = True
