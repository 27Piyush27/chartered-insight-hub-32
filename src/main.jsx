import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializeSampleData } from "./lib/initializeData";
initializeSampleData();
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(App, {}));
