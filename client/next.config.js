module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },

  serverRuntimeConfig: {
    stripePublishable: process.env.STRIPE_PUBLISHABLE,
  },
  publicRuntimeConfig: {
    stripePublishable: process.env.STRIPE_PUBLISHABLE,
  },
};
