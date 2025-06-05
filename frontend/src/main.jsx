import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import BookingPage from "./layouts/User/component/BookingPage.jsx";
import ScrollToTop from "./layouts/User/component/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop/>
      <App />
      
    </BrowserRouter>
    
  </StrictMode>
);
