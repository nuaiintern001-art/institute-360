
import httpx


async def generate_response(message: str) -> str:

    url = "http://localhost:11434/api/chat"

    payload = {
        "model": "llama3.2:3b",
        "messages": [
            {
                "role": "user",
                "content": message
            }
        ],
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                url,
                json=payload
            )

            response.raise_for_status()

            data = response.json()

            return data["message"]["content"]

    except httpx.ConnectError:
        return "Cannot connect to Ollama. Please make sure Ollama is running."

    except Exception as error:
        print("AI Service Error:", error)
        return "Sorry, something went wrong. Please try again."
