import fastapi
import aiohttp
import json
from urllib.parse import urlparse

app = fastapi.FastAPI()

@app.get("/bilibili")
async def bilicard_api(url: str):
    host = urlparse(url).netloc
    if not host.endswith("hdslb.com"):
        return fastapi.Response(
            content=json.dumps({
                "status": "error",
                "code": 400,
                "message": "Unable to parse URI"
            }),
            status_code=400,
            headers={
                "Content-Type": "application/json"
            }
        )
    else:
        async with aiohttp.request(
            method="GET",
            url=url,
            headers={
                "Host": host,
                "Referer": "https://www.bilibili.com/",
                "Sec-Fetch-Dest": "image",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "cross-site"
            }
        ) as response:
            return fastapi.Response(
                content=await response.read(),
                status_code=200,
                headers=response.headers
            )
