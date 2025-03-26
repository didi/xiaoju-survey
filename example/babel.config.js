const path = require('path');
// const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          root: './src',
          alias: {
            // For development, we want to alias the library to the source
            // [pak.name]: path.join(__dirname, '..', pak.source),
            // 'expo-linear-gradient': path.join(__dirname, './node_modules', 'react-native-linear-gradient')
            ['xiaojusurvey-sdk-rn']: path.join(__dirname, '../src'),
          },
        },
      ],
    ],
  };
};
