module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a25cd0883c92ec01c0a0d08cd89935b9'),
  },
});
