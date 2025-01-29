const path = require('path');

module.exports = {
  // ...existing code...
  module: {
    rules: [
      // ...existing code...
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
      // ...existing code...
    ],
  },
  // ...existing code...
};
