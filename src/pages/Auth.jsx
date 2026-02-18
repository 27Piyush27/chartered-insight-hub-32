import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Briefcase, Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
const roles = [
  { value: "client", label: "Client", icon: User, description: "Access your financial documents and services" },
  { value: "ca", label: "Chartered Accountant", icon: Briefcase, description: "Manage clients and provide services" },
  { value: "admin", label: "Admin", icon: Shield, description: "Full system administration access" }
];
const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255);
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });
const nameSchema = z.string().trim().min(1, { message: "Name is required" }).max(100);
function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("signup") ? "signup" : "login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "client" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client"
  });
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      emailSchema.parse(loginData.email);
      passwordSchema.parse(loginData.password);
    } catch (error2) {
      if (error2 instanceof z.ZodError) {
        toast.error(error2.errors[0].message);
        setIsSubmitting(false);
        return;
      }
    }
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
    setIsSubmitting(false);
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      nameSchema.parse(signupData.name);
      emailSchema.parse(signupData.email);
      passwordSchema.parse(signupData.password);
    } catch (error2) {
      if (error2 instanceof z.ZodError) {
        toast.error(error2.errors[0].message);
        setIsSubmitting(false);
        return;
      }
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    if (signupData.role === "admin") {
      toast.error("Admin accounts can only be created by existing admins");
      setIsSubmitting(false);
      return;
    }
    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.name,
      signupData.role
    );
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }
    setIsSubmitting(false);
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  if (authLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background py-12 px-4", children: /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: "hidden",
      animate: "visible",
      variants: fadeIn,
      className: "w-full max-w-md",
      children: /* @__PURE__ */ jsxs(Card, { className: "border-border/50 shadow-2xl backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-4xl font-semibold tracking-tight", children: "Welcome" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-muted-foreground text-base", children: "Sign in to access your account" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-8 bg-secondary", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "login", className: "data-[state=active]:bg-background", children: "Sign In" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "signup", className: "data-[state=active]:bg-background", children: "Sign Up" })
          ] }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "login", className: "space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: roles.map((role) => {
              const Icon = role.icon;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setLoginData({ ...loginData, role: role.value }),
                  className: `flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${loginData.role === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${loginData.role === role.value ? "text-primary" : "text-muted-foreground"}` }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${loginData.role === role.value ? "text-primary" : "text-muted-foreground"}`, children: role.value === "ca" ? "CA" : role.label })
                  ]
                },
                role.value
              );
            }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "login-email", className: "text-sm font-medium", children: "Email" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "login-email",
                    type: "email",
                    value: loginData.email,
                    onChange: (e) => setLoginData({ ...loginData, email: e.target.value }),
                    placeholder: "your.email@example.com",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "login-password", className: "text-sm font-medium", children: "Password" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "login-password",
                    type: "password",
                    value: loginData.password,
                    onChange: (e) => setLoginData({ ...loginData, password: e.target.value }),
                    placeholder: "Enter your password",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full h-12 text-base font-medium", size: "lg", disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Signing in..."
              ] }) : `Sign In as ${roles.find((r) => r.value === loginData.role)?.label}` })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "signup", className: "space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: roles.filter((r) => r.value !== "admin").map((role) => {
              const Icon = role.icon;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSignupData({ ...signupData, role: role.value }),
                  className: `flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${signupData.role === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${signupData.role === role.value ? "text-primary" : "text-muted-foreground"}` }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${signupData.role === role.value ? "text-primary" : "text-muted-foreground"}`, children: role.value === "ca" ? "Chartered Accountant" : role.label })
                  ]
                },
                role.value
              );
            }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSignup, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "signup-name", className: "text-sm font-medium", children: "Full Name" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "signup-name",
                    type: "text",
                    value: signupData.name,
                    onChange: (e) => setSignupData({ ...signupData, name: e.target.value }),
                    placeholder: "John Doe",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "signup-email", className: "text-sm font-medium", children: "Email" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "signup-email",
                    type: "email",
                    value: signupData.email,
                    onChange: (e) => setSignupData({ ...signupData, email: e.target.value }),
                    placeholder: "your.email@example.com",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "signup-password", className: "text-sm font-medium", children: "Password" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "signup-password",
                    type: "password",
                    value: signupData.password,
                    onChange: (e) => setSignupData({ ...signupData, password: e.target.value }),
                    placeholder: "At least 6 characters",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "signup-confirm", className: "text-sm font-medium", children: "Confirm Password" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "signup-confirm",
                    type: "password",
                    value: signupData.confirmPassword,
                    onChange: (e) => setSignupData({ ...signupData, confirmPassword: e.target.value }),
                    placeholder: "Re-enter your password",
                    className: "h-12 bg-secondary/50 border-border/50 focus:border-primary",
                    required: true,
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full h-12 text-base font-medium", size: "lg", disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Creating account..."
              ] }) : `Create ${signupData.role === "ca" ? "CA" : "Client"} Account` })
            ] })
          ] })
        ] }) })
      ] })
    }
  ) });
}
export {
  Auth as default
};
