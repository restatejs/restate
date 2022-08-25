const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    index: "./src/index.ts",
    coreModel: {
      import: "./src/models/CoreModel.ts",
      filename: "models/CoreModel.js",
    },
    collectionModel: {
      import: "./src/models/CollectionModel.ts",
      filename: "models/CollectionModel.js",
    },
    itemModel: {
      import: "./src/models/ItemModel.ts",
      filename: "models/ItemModel.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: ["Restate", "[name]"],
      type: "umd",
    },
    globalObject: "this",
  },
  externals: [nodeExternals()],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
