import { jsx, jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
const Navigation = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, role, signOut, loading } = useAuth();
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
  };
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
    ...role === "admin" || role === "ca" ? [{ name: "Admin", path: "/admin" }] : []
  ];
  const displayName = profile?.name || user?.email?.split("@")[0] || "";
  return /* @__PURE__ */ jsxs(
    motion.nav,
    {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      className: `sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/60 backdrop-blur-xl backdrop-saturate-150 border-b border-border/30 shadow-subtle" : "bg-background/80 backdrop-blur-sm border-b border-border/50"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center group", children: /* @__PURE__ */ jsxs("span", { className: "text-xl font-medium tracking-tight transition-all duration-300 group-hover:tracking-normal", children: [
            "GMR",
            /* @__PURE__ */ jsx("span", { className: "text-accent", children: "&" }),
            "Associates"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-10", children: navLinks.map((link) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: link.path,
              className: `text-sm tracking-wide transition-colors duration-300 link-underline relative ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                link.name,
                location.pathname === link.path && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    layoutId: "nav-indicator",
                    className: "absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full",
                    transition: { type: "spring", stiffness: 300, damping: 30 }
                  }
                )
              ]
            },
            link.path
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                onClick: toggleTheme,
                whileHover: { scale: 1.1, rotate: 15 },
                whileTap: { scale: 0.9 },
                className: "p-2 text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Toggle theme",
                children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    initial: { rotate: -90, opacity: 0 },
                    animate: { rotate: 0, opacity: 1 },
                    exit: { rotate: 90, opacity: 0 },
                    transition: { duration: 0.2 },
                    children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
                  },
                  isDark ? "sun" : "moon"
                ) })
              }
            ),
            !loading && user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(NotificationBell, {}),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: displayName }),
              /* @__PURE__ */ jsx(Button, { onClick: handleLogout, variant: "outline", size: "sm", children: "Sign Out" })
            ] }) : !loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/auth", children: "Login" }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/auth?signup=true", children: "Get Started" }) })
            ] }) : null
          ] }),
          /* @__PURE__ */ jsx(
            motion.button,
            {
              whileTap: { scale: 0.9 },
              className: "md:hidden p-2 text-foreground",
              onClick: () => setIsMenuOpen(!isMenuOpen),
              "aria-label": "Toggle menu",
              children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { rotate: -90, opacity: 0 },
                  animate: { rotate: 0, opacity: 1 },
                  exit: { rotate: 90, opacity: 0 },
                  transition: { duration: 0.15 },
                  children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
                },
                isMenuOpen ? "close" : "menu"
              ) })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: isMenuOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
            className: "md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden",
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-6 flex flex-col gap-4", children: [
              navLinks.map((link, i) => /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: i * 0.05, duration: 0.3 },
                  children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: link.path,
                      onClick: () => setIsMenuOpen(false),
                      className: `text-sm py-2 block transition-colors ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground"}`,
                      children: link.name
                    }
                  )
                },
                link.path
              )),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 pt-4 border-t border-border/50", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: toggleTheme,
                  className: "text-sm text-muted-foreground flex items-center gap-2",
                  children: [
                    isDark ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" }),
                    isDark ? "Light" : "Dark",
                    " Mode"
                  ]
                }
              ) }),
              !loading && user ? /* @__PURE__ */ jsx(Button, { onClick: handleLogout, variant: "outline", className: "w-full", children: "Sign Out" }) : !loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: "/auth", children: "Login" }) }),
                /* @__PURE__ */ jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: "/auth?signup=true", children: "Get Started" }) })
              ] }) : null
            ] })
          }
        ) })
      ]
    }
  );
};
export {
  Navigation
};
