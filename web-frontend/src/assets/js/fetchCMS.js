export default async function (url, params = {}) {
  if (url.charAt(0) !== '/') url = '/' + url

  return await fetch(
    process.env.NODE_ENV == 'production'
      ? process.server
        ? 'http://strapi:1337' + url
        : '/cms' + url
      : 'http://localhost:1337' + url,
    params
  )
}
