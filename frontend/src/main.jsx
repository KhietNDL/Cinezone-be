import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import BookingPage from "./layouts/User/component/BookingPage.jsx";
import ScrollToTop from "./layouts/User/component/ScrollToTop.jsx";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </StrictMode>
    </PersistGate>
  </Provider>
);
