from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import openai
import os
from dotenv import load_dotenv

import asyncio

from modules import CFCOS, UserIdentity, CFCOS_MANAGER as MANAGER

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI Credential
load_dotenv()
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Core Objects
manager = MANAGER()
_user_identity = UserIdentity("_@_.com")

# cfcos = CFCOS(client)
# user_identity = UserIdentity()

@app.get("/")
async def root():
    return {"message": "Hello world!"}

@app.get("/hello")
async def hello():
    return Response(status_code=200)

@app.post("/verify-email")
async def verify_email(request: Request):
    data = await request.json()
    user_email = data['user_email']
    if _user_identity.is_valid_info(user_email):
        return Response(status_code=200)
    return Response(status_code=400)

@app.post("/add-session")
async def add_session(request: Request):
    data = await request.json()
    user_email = data['user_email']
    cfcos = CFCOS(client=client)
    user_identity = UserIdentity(user_email)
    session_key = manager.add_session(cfcos, user_identity)
    return {"response": session_key}

@app.post("/load")
async def load(request: Request):
    data = await request.json()
    session_id = data['session_id']
    try:
        manager.sessions[session_id]["cfcos"].load_file_list()
    except Exception:
        print("[⛔ Err] Failed to load.")
        return Response(status_code=400)
    return Response(status_code=200)

@app.post("/get-semantic-summary")
async def get_semantic_summary(request: Request):
    data = await request.json()
    session_id = data['session_id']
    try:
        return {"response": manager.sessions[session_id]["cfcos"].get_semantic_summary()}
    except Exception as e:
        print(f"[⛔️ Err] Failed to return semantic summary: {e}")
        return Response(status_code=400)
    
@app.post("/select-case")
async def select_case(request: Request):
    data = await request.json()
    session_id = data['session_id']
    selected = data['selected']
    manager.sessions[session_id]["cfcos"].select_test_case(selected)
    return Response(status_code=200)

@app.post("/set-tags")
async def set_tags(request: Request):
    data = await request.json()
    session_id = data['session_id']
    tags = data['tags']
    try:
        await manager.sessions[session_id]["cfcos"].set_tags(tags)
        return Response(status_code=200)
    except Exception as e:
        print(f"[⛔️ Err] Failed to set tag-list: {e}")
        return Response(status_code=400) 

@app.post("/tagging")
async def tagging(request: Request):
    data = await request.json()
    session_id = data['session_id']
    try:
        await manager.sessions[session_id]["cfcos"].tagging()
        return Response(status_code=200)
    except Exception as e:
        print(f"[⛔️ Err] Failed to tagging: {e}")
        return Response(status_code=400)

@app.post("/get-structure")
async def get_structure(request: Request):
    data = await request.json()
    session_id = data['session_id']
    try:
        classified_files_structure = manager.sessions[session_id]["cfcos"].get_classified_files_structure()
        return {"response": classified_files_structure}
    except Exception as e:
        print(f"[⛔️ Err] Failed to get data: {e}")
        return Response(status_code=400)

@app.post("/get-selected")
async def get_selected(request: Request):
    data = await request.json()
    session_id = data['session_id']
    selected = manager.sessions[session_id]["cfcos"].get_selected()
    return {"response": selected}

@app.post("/prefer")
async def prefer(request: Request):
    data = await request.json()
    session_id = data['session_id']
    preference = data['preference']
    try:
        manager.sessions[session_id]["user_identity"].prefer(preference)
        return Response(status_code=200)
    except Exception as e:
        print(f"[⛔️ Err] Failed to record preference: {e}")
        return Response(status_code=400)

@app.post("/rate")
async def rate(request: Request):
    data = await request.json()
    session_id = data['session_id']
    rating = data['rating']
    feedback = data['feedback']
    try:
        manager.sessions[session_id]["user_identity"].rate(rating, feedback)
        manager.remove_session(session_id)
        return Response(status_code=200)
    except Exception as e:
        print(f"[⛔️ Err] Failed to record rating: {e}")
        return Response(status_code=400)
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)