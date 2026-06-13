from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="Rhythm API",
    description="Personalized nutrition guidance for women",
    version="1.0.0"
)

# This allows your React frontend to call this API
# Without this, browsers block cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes from routes.py
app.include_router(router)

# Root endpoint — just confirms the server is alive
@app.get("/")
def root():
    return {"status": "Rhythm API is running 🌸"}