const transpileModules = require('next-transpile-modules');

const withTM = transpileModules(['ky', 'lodash-es']);

module.exports = withTM({
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    /**
     * ISSUE: https://github.com/vercel/next.js/issues/17806
     */
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
});
