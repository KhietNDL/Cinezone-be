import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import BookingPage from "./layouts/BookingPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      
    </BrowserRouter>
    
  </StrictMode>
);
