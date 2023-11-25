/**
 * hexo-theme-stellaris bilicard API
 * By Kirikaze Chiyuki
 * Usage: https://your.api.workers.dev/?url=https://i0.hdslb.com/some/image
 */

export default {
  async fetch(request, env, ctx) {
    const params = new URL(request.url).searchParams
    const url = params.get("url")
    if (url === null || !new URL(url).hostname.endsWith("hdslb.com")) {
      // error
      return new Response(
        JSON.stringify({status: "error", code: 400, message: "Unable to parse URI " + url}),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    } else {
      return await fetch(url, Object.assign({
        headers: {
          "Host": new URL(url).host,
          "Referer": "https://www.bilibili.com/",
          "Sec-Fetch-Dest": "image",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site"
        }
      }))
    }
  },
};
