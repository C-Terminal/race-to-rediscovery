import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
# import routers # Example: If you structure with routers

load_dotenv()

app = FastAPI(title="Race to Rediscovery") # Load environment variables from .env file for local dev


# --- CORS Configuration ---
# Allows requests from your Svelte frontend during development
origins = [
    "http://localhost:5173", # Default SvelteKit dev port
    "http://127.0.0.1:5173",
    # Add frontend container's origin if needed later, or allow "*" for PoC (less secure)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# --- Database Connection (Example Placeholder) ---
# You would set up actual connection pooling and session management here
DATABASE_URL = os.getenv("DATABASE_URL")
# print(f"Connecting to DB: {DATABASE_URL}") # Replace localhost with 'db' inside Docker

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the DataViz PoC Backend!"}

@app.get("/api/data/sample")
async def get_sample_data():
    # In a real scenario: Query DB, process data with pandas/geopandas
    # For PoC, return dummy data:
    return {
        "description": "Sample demographic data",
        "source": "dummy",
        "data": [
            {"area": "Neighbourhood A", "population": 5000, "year": 2023},
            {"area": "Neighbourhood B", "population": 7500, "year": 2023},
        ]
    }

# Example: Include routers if you split endpoints into different files
# from .routers import data_api
# app.include_router(data_api.router, prefix="/api/data")

print("FastAPI app initialized.") # For checking startup