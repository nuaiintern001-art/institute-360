
from fastapi import APIRouter, HTTPException
from uuid import uuid4

from app.models.chat import ChatRequest, ChatResponse
from app.services.ai_service import generate_response

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


@router.post("", response_model=ChatResponse)
async def send_message(request: ChatRequest):

    try:
        conversation_id = (
            request.conversation_id or str(uuid4())
        )

        reply = await generate_response(
            request.message
        )

        return ChatResponse(
            conversation_id=conversation_id,
            reply=reply
        )

    except Exception as error:
        print("Chat API Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to process chat request"
        )
