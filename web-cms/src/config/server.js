module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: process.env.NODE_ENV == 'production' ? '/cms' : undefined
});
