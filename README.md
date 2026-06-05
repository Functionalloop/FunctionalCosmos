# FunctionalCosmos

A fully immersive, 3D interactive portfolio and data visualization experience built to showcase projects, skills, and professional experience through a cosmic, planetary interface.

## Tech Stack

This project is divided into a robust modern frontend and a lightweight Python backend for data delivery.

### Frontend (Web UI & 3D Experience)
- **Framework:** Next.js 16 / React 19
- **3D Rendering:** Three.js (0.184.0)
- **React 3D Integrations:** `@react-three/fiber`, `@react-three/drei`
- **Post-Processing:** `@react-three/postprocessing` (for bloom, cinematic effects, etc.)
- **Styling:** TailwindCSS v4
- **Animations:** Framer Motion (UI transitions) & GSAP (complex sequencing)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Language:** TypeScript

### Backend (API & Data Layer)
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Database ORM:** SQLAlchemy
- **Databases:** SQLite (Local Development) / PostgreSQL (Production ready via `psycopg2-binary`)
- **Data Validation:** Pydantic
- **Environment Management:** Python Dotenv

## Architecture Overview

- `frontend/`: Contains the Next.js application, Three.js canvas components (`src/components/celestial/`), UI overlays, global state, and custom shaders.
- `backend/`: Contains the FastAPI application, database models, schemas, and routing logic for delivering the portfolio data to the frontend.