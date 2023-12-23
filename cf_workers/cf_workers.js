/**
 * hexo-theme-stellaris bilicard API
 * By Kirikaze Chiyuki
 * Usage: https://your.api.workers.dev/?url=https://i0.hdslb.com/some/image
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const params = url.searchParams
    let route = url.pathname
    if (route.slice(-1) === '/') route = route.slice(0, -1)

    switch (route) {
      case "/bilibili":
        const realUrl = params.get("url")
        if (realUrl === null || !new URL(realUrl).hostname.endsWith("hdslb.com")) {
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
          return await fetch(realUrl, Object.assign({
            headers: {
              "Host": new URL(realUrl).host,
              "Referer": "https://www.bilibili.com/",
              "Sec-Fetch-Dest": "image",
              "Sec-Fetch-Mode": "no-cors",
              "Sec-Fetch-Site": "cross-site"
            }
          }))
        }
      case "/bvideo_info":
        const type = params.get("type")
        const vtype = params.get("vtype")
        const id = params.get("id")
        const url = `https://api.bilibili.com/x/web-interface/view?${vtype}=${type == 'bv' ? id : id.slice(2)}`
        return await fetch(url, Object.assign({
          headers: {
            "Host": new URL(url).host,
            "Referer": "https://www.bilibili.com/"
          }
        }))
      default:
        return new Response(
          JSON.stringify({status: "error", code: 404, message: "Not found"}),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
    }
  },
}
