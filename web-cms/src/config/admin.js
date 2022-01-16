module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '2ba857a09f48ea94a8da01843ed56b69'),
  },
});
