export default async function (url, method = 'GET', body = {}) {
  if (url.charAt(0) !== '/') url = '/' + url

  let fetchArgs =
    method == 'POST'
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      : {}

  let res = await fetch(
    process.env.NODE_ENV == 'production'
      ? '/api' + url
      : 'http://localhost:8081' + url,
    Object.assign({ method: method }, fetchArgs)
  )
  if (method == 'POST') return res.status
  else return await res.json()
}
