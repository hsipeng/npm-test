import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import MyComponent from "./src/MyComponent";
import { hot } from "react-hot-loader";

let HotMyComponent = MyComponent;
if (process.env.NODE_ENV === "development") {
  // 热启动
  HotMyComponent = hot(module)(MyComponent);
}

ReactDOM.render(<HotMyComponent />, document.getElementById("app"));
