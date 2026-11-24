# Institute 360 REST API

FastAPI-based REST API for the Institute 360 AI Chatbot.

## Technologies Used
- Python
- FastAPI
- Uvicorn
- HTML
- CSS
- JavaScript

## Project Structure
- backend/ – REST API backend
- frontend/ – Chatbot frontend
- college_knowledge.txt – College knowledge data
- requirements.txt – Python dependencies

## API Endpoint

POST `/api/chat`

## Run Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
uvicorn backend.main:app --reload
```

API documentation:

http://127.0.0.1:8000/docs
