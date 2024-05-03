import fastapi
import aiohttp
import json
from urllib.parse import urlparse

app = fastapi.FastAPI()


@app.get("/bilibili")
async def bimage_api(url: str):
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
            headers = response.headers
            headers['Access-Control-Allow-Origin'] = '*'
            return fastapi.Response(
                content=await response.read(),
                status_code=200,
                headers=headers
            )


@app.get("/bvideo_info")
async def bvideo_info_api(type: str, vtype: str, id: str):
    async with aiohttp.request(
        method="GET",
        url=f"https://api.bilibili.com/x/web-interface/view?{vtype}={id if type == 'bv' else id[2:]}",
        headers={
            "Host": "api.bilibili.com",
            "Referer": "https://www.bilibili.com/",
        }
    ) as response:
        headers = response.headers
        headers['Access-Control-Allow-Origin'] = '*'
        return fastapi.Response(
            content=await response.read(),
            status_code=200,
            headers=headers
        )
