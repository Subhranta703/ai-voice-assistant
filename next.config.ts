const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.openai\.com/,
              handler: 'NetworkOnly'
            }
          ]
        })
      );
    }
    return config;
  }
};
