@echo off
title Functional Cosmos Runner
echo ===================================================
echo   Starting Functional Cosmos Project...
echo ===================================================
echo.

cd /d "%~dp0"

:: Detect backend python executable
set BACKEND_RUN_CMD=
if exist "backend\venv\Scripts\python.exe" (
    set BACKEND_RUN_CMD=cd backend ^&^& venv\Scripts\python.exe -m uvicorn app.main:app --reload
) else if exist "backend\.venv\Scripts\python.exe" (
    set BACKEND_RUN_CMD=cd backend ^&^& .venv\Scripts\python.exe -m uvicorn app.main:app --reload
) else (
    set BACKEND_RUN_CMD=cd backend ^&^& python -m uvicorn app.main:app --reload
)

echo Starting Backend API Server in a new window...
start "Functional Cosmos Backend" cmd /k "cd /d ""%~dp0"" && %BACKEND_RUN_CMD%"

echo Starting Frontend Next.js Dev Server in a new window...
start "Functional Cosmos Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ===================================================
echo Both servers have been launched in separate windows!
echo - Backend API: http://localhost:8000
echo - Frontend: http://localhost:3000
echo ===================================================
echo.
pause
