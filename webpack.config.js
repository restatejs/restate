const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    index: './src/index.ts',
    axiosHTTPClient: {
      import: './src/implementations/httpClient/axios/index.ts',
      filename: 'implementations/httpClient/axios.js'
    },
    vueStore: {
      import: './src/implementations/store/vue/index.ts',
      filename: 'implementations/store/vue.js'
    },
    coreModel: {
      import: './src/models/CoreModel.ts',
      filename: 'models/CoreModel.js'
    },
    baseModel: {
      import: './src/models/BaseModel.ts',
      filename: 'models/BaseModel.js',
    },
    vue: {
      import: './src/plugins/vue/index.ts',
      filename: 'plugins/vue.js',
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: ['Restate', '[name]'],
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: [nodeExternals()],
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
};
