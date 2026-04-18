from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from ml_pipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API running"}


@app.post("/train")
async def train(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    try:
        # save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # run ML pipeline
        result = run_pipeline(file_path)

        # pass through pipeline errors directly
        if isinstance(result, dict) and "error" in result:
            return result

        return result

    except Exception as e:
        return {
            "error": str(e)
        }

    finally:
        # clean temp file
        if os.path.exists(file_path):
            os.remove(file_path)