from fastapi import FastAPI

app = FastAPI(title="LiveWaste API")


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "success",
        "message": "LiveWaste backend is running"
    }