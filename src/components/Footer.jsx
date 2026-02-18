import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border/50 mt-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12 py-16", children: [
    /* @__PURE__ */ jsxs(StaggerContainer, { className: "grid grid-cols-1 md:grid-cols-4 gap-12", staggerDelay: 0.1, children: [
      /* @__PURE__ */ jsxs(StaggerItem, { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-lg font-medium mb-4", children: [
          "GMR",
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: "&" }),
          "Associates"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-md", children: "Chartered Accountants providing comprehensive professional services with precision and integrity since 2011." })
      ] }),
      /* @__PURE__ */ jsxs(StaggerItem, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Navigation" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-foreground hover:text-accent transition-colors duration-300", children: "About" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/services", className: "text-foreground hover:text-accent transition-colors duration-300", children: "Services" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-foreground hover:text-accent transition-colors duration-300", children: "Contact" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "text-foreground hover:text-accent transition-colors duration-300", children: "Client Portal" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(StaggerItem, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-foreground", children: /* @__PURE__ */ jsx("a", { href: "mailto:info@gmrindia.com", className: "hover:text-accent transition-colors duration-300", children: "info@gmrindia.com" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground", children: /* @__PURE__ */ jsx("a", { href: "tel:+919871209393", className: "hover:text-accent transition-colors duration-300", children: "+91 98712 09393" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gurgaon & Delhi, India" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ScrollReveal, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " GMR & Associates. All rights reserved."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Chartered Accountants" })
    ] }) })
  ] }) });
};
export {
  Footer
};
