import { jsx, jsxs } from "react/jsx-runtime";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "text-center animate-slide-up", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-4 text-6xl font-bold text-primary", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mb-8 text-xl text-muted-foreground", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Return to Home" }) })
  ] }) });
};
var stdin_default = NotFound;
export {
  stdin_default as default
};
