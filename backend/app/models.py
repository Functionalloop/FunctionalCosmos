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

# --- Resume Models ---

class ResumeExperience(Base):
    __tablename__ = "resume_experience"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    company = Column(String, nullable=False)
    period = Column(String, nullable=False)         # e.g. "Jan 2024 - Present"
    description = Column(String, nullable=False)
    tags = Column(String, nullable=False)            # Comma-separated tech tags
    order = Column(Integer, nullable=False, default=0)

class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)        # e.g. "Frontend", "Backend", "DevOps"
    level = Column(Integer, nullable=False, default=3)  # 1-5

class ResumeEducation(Base):
    __tablename__ = "resume_education"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    period = Column(String, nullable=False)
    gpa = Column(String, nullable=True)
    description = Column(String, nullable=True)
    order = Column(Integer, nullable=False, default=0)

class VisitorCount(Base):
    __tablename__ = "visitor_count"
    id = Column(Integer, primary_key=True, default=1)
    count = Column(Integer, default=0)

class ResumeCertification(Base):
    __tablename__ = "resume_certifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    year = Column(String, nullable=False)
    badge = Column(String, nullable=True)             # Emoji or icon key
    order = Column(Integer, nullable=False, default=0)
