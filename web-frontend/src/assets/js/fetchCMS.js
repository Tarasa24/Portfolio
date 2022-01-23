export default async function (url, params = {}) {
  if (url.charAt(0) !== '/') url = '/' + url

  return await fetch(
    process.env.NODE_ENV == 'production'
      ? process.server 
        ? `http://${process.env.STRAPI_HOST}:1337`
        : '/cms' + url
      : 'http://localhost:1337' + url,
    params
  )
}
