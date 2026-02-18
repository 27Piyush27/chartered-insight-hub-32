import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
function Home() {
  const services = [
    {
      title: "Accounting & Bookkeeping",
      desc: "Precision financial management with meticulous attention to detail.",
      link: "/services/accounting"
    },
    {
      title: "Auditing & Assurance",
      desc: "Comprehensive audits ensuring accuracy and regulatory compliance.",
      link: "/services/auditing"
    },
    {
      title: "Tax Advisory",
      desc: "Strategic planning to optimize your tax position responsibly.",
      link: "/services/tax"
    }
  ];
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxs("section", { className: "py-24 md:py-40 px-6 lg:px-12 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.03] blur-[120px] pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto relative", children: [
        /* @__PURE__ */ jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.1 },
            className: "text-sm tracking-widest text-muted-foreground uppercase mb-6",
            children: "Chartered Accountants"
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] },
            className: "text-4xl md:text-6xl lg:text-7xl mb-8 text-balance",
            children: [
              "Financial clarity for those who",
              /* @__PURE__ */ jsx("span", { className: "italic gradient-text", children: " demand excellence" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.4 },
            className: "text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed",
            children: "Since 2011, we've partnered with discerning businesses to deliver accounting services of the highest caliber."
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.55 },
            className: "flex flex-col sm:flex-row gap-4",
            children: [
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "group", children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
                "Schedule Consultation",
                /* @__PURE__ */ jsx(
                  motion.span,
                  {
                    className: "inline-block ml-1",
                    whileHover: { x: 4 },
                    transition: { type: "spring", stiffness: 400 },
                    children: "\u2192"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "group", children: /* @__PURE__ */ jsxs(Link, { to: "/services", children: [
                "Our Services ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })
              ] }) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-20 border-y border-border/50 relative", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs(StaggerContainer, { className: "grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8", staggerDelay: 0.15, children: [
      /* @__PURE__ */ jsxs(StaggerItem, { className: "text-center md:text-left", children: [
        /* @__PURE__ */ jsx(AnimatedCounter, { target: 500, suffix: "+", className: "text-5xl md:text-6xl font-light mb-2 block" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground tracking-wide", children: "Clients Served" })
      ] }),
      /* @__PURE__ */ jsxs(StaggerItem, { className: "text-center md:text-left", children: [
        /* @__PURE__ */ jsx(AnimatedCounter, { target: 13, suffix: "+", className: "text-5xl md:text-6xl font-light mb-2 block" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground tracking-wide", children: "Years of Practice" })
      ] }),
      /* @__PURE__ */ jsxs(StaggerItem, { className: "text-center md:text-left", children: [
        /* @__PURE__ */ jsx(AnimatedCounter, { target: 99, suffix: "%", className: "text-5xl md:text-6xl font-light mb-2 block" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground tracking-wide", children: "Client Retention" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
      /* @__PURE__ */ jsxs(ScrollReveal, { className: "max-w-2xl mb-16", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Services" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl mb-6", children: "Comprehensive expertise across all financial disciplines" })
      ] }),
      /* @__PURE__ */ jsx(StaggerContainer, { className: "grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50", staggerDelay: 0.12, children: services.map((service, index) => /* @__PURE__ */ jsx(StaggerItem, { children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: service.link,
          className: "group block bg-background p-8 md:p-10 hover:bg-secondary/30 transition-all duration-500 relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground tracking-widest", children: [
                "0",
                index + 1
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl mt-4 mb-4 group-hover:text-accent transition-colors duration-300", children: service.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: service.desc }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm flex items-center gap-2 text-foreground group-hover:gap-4 transition-all duration-300", children: [
                "Learn more ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" })
              ] })
            ] })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-24 md:py-32 bg-secondary/30 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs(ScrollReveal, { className: "max-w-3xl mx-auto text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-6", children: "Our Philosophy" }),
        /* @__PURE__ */ jsx(
          motion.blockquote,
          {
            className: "text-2xl md:text-3xl lg:text-4xl italic leading-relaxed mb-8",
            initial: { opacity: 0, scale: 0.97 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            children: `"Excellence is not a skill. It's an attitude reflected in every balance sheet, every audit, every consultation."`
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "\u2014 GMR & Associates" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs(ScrollReveal, { className: "max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl mb-6", children: "Ready to elevate your financial strategy?" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-10 leading-relaxed", children: "Let's discuss how our expertise can serve your business objectives." }),
      /* @__PURE__ */ jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Begin the Conversation" }) }) })
    ] }) }) })
  ] }) });
}
export {
  Home as default
};
