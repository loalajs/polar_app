const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const precss = require("precss");
const autoprefixer = require("autoprefixer");

const SRC = path.resolve(__dirname, "src");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js"
  },
  resolve: {
    /** Must include .js, .jsx for react to resolve after ts-loader */
    extensions: [".js", ".jsx", ".json", ".css", ".scss"],
    alias: {
      assets: path.resolve(SRC, "assets"),
      utils: path.resolve(SRC, "utils"),
      components: path.resolve(SRC, "components"),
      routers: path.resolve(SRC, "routers")
    },
    modules: [SRC, "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader" // Will reference .babelrc
        }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              // postcss-loader is for bootstrap to work
              loader: "postcss-loader", // Run post css actions
              options: {
                plugins() {
                  // post css plugins, can be exported to postcss.config.js
                  return [precss, autoprefixer];
                }
              }
            },
            {
              // For url() function in scss; This should be placed after sass-loader
              loader: "resolve-url-loader"
            },
            {
              loader: "sass-loader"
            }
          ],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {} // do not remove
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Polar App",
      template: "./src/index.html",
      filename: "index.html"
    }),
    new ExtractTextPlugin({
      filename: "style.css",
      disable: process.env.NODE_ENV === "development"
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
