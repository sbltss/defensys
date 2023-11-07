import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import "antd/dist/antd.min.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "tw-elements";
import store, { persistor } from "./store/store";
import { injectStore } from "./helpers/injectedStore";
injectStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
