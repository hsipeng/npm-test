const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const history = require("connect-history-api-fallback");
const proxy = require("http-proxy-middleware");
const convert = require("koa-connect");
const Router = require("koa-router");
const webpackServeWaitpage = require("webpack-serve-waitpage");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const router = new Router();

// api 代理
const proxyOptions = {
  target: "http://localhost:3000/",
  changeOrigin: true
  // ... see: https://github.com/chimurai/http-proxy-middleware#options
};

router.get("/api", convert(proxy(proxyOptions)));

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: path.join(__dirname, "./index.jsx"),
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
    publicPath: "/",
    chunkFilename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      },
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: false,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: loader => [
                // require('postcss-import')({root: loader.resourcePath}),
                require("autoprefixer")() //CSS浏览器兼容
                // require('cssnano')()  //压缩css
              ]
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 超出40960 = 40kb 默认 file-loader
              // file-loader 输出目录
              outputPath: "images",
              limit: 40960
            }
          }
        ]
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new ProgressBarPlugin(),
    new CopyWebpackPlugin([
      {
        context: path.join(__dirname, "./public/"),
        from: "favicon.ico",
        to: path.join(__dirname, "./dist/")
        // ignore: ['*.md'],
      }
    ]),
    new HtmlWebpackPlugin({
      title: "module-test",
      template: path.join(__dirname, "./public/template.html")
    })
  ]
};

// webpack-serve 配置开始
module.exports.serve = {
  content: [__dirname],
  add: (app, middleware, options) => {
    // Be sure to pass the options argument from the arguments
    // build waiting page
    app.use(
      webpackServeWaitpage(options, {
        title: "Webpack building...",
        theme: "default"
      })
    );

    // history api fallback 配置开始
    const historyOptions = {
      disableDotRule: true,
      verbose: true,
      htmlAcceptHeaders: ["text/html", "application/xhtml+xml"]
      // ... see: https://github.com/bripkens/connect-history-api-fallback#options
    };

    app.use(convert(history(historyOptions)));

    // ourselves
    middleware.webpack().then(() => {
      middleware.content({
        index: "index.htm"
      });

      // this example assumes router must be added last
      app.use(router.routes());
    });
  },
  // local ip
  host: 'localhost'//internalIp.v4.sync()
};
