import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebaseInit from "./firebase";
import "./index.css";
import AuthStore from "./store/AuthStore";
import ArticleStore from "./store/ArticleStore";

firebaseInit();

const auth = new AuthStore();
const article = new ArticleStore();

ReactDOM.render(
  <Provider auth={auth} article={article}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
