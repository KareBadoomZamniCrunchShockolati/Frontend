// src/main.tsx (یا src/index.tsx)

import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./routes/routes.tsx";
import { RouterProvider } from "react-router-dom";

// ← این خط رو اضافه کن
import { ThemeProvider } from "./pages/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>                          {/* ← شروع ThemeProvider */}
    <RouterProvider router={router} />
  </ThemeProvider>                        
);