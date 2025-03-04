import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import React from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
