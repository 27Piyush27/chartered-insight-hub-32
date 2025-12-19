import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Briefcase, Shield } from "lucide-react";

const roles = [
  { value: "client", label: "Client", icon: User, description: "Access your financial documents and services" },
  { value: "ca", label: "Chartered Accountant", icon: Briefcase, description: "Manage clients and provide services" },
  { value: "admin", label: "Admin", icon: Shield, description: "Full system administration access" },
];

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("signup") ? "signup" : "login");
  const [selectedRole, setSelectedRole] = useState("client");

  const [loginData, setLoginData] = useState({ email: "", password: "", role: "client" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("gmr_current_v5");
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("gmr_users_v5") || "[]");
    const user = users.find(
      (u: any) => u.email === loginData.email && u.password === loginData.password && u.role === loginData.role
    );

    if (user) {
      localStorage.setItem("gmr_current_v5", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials or role mismatch");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Admin signup requires special code
    if (signupData.role === "admin") {
      toast.error("Admin accounts can only be created by existing admins");
      return;
    }

    const users = JSON.parse(localStorage.getItem("gmr_users_v5") || "[]");

    if (users.find((u: any) => u.email === signupData.email)) {
      toast.error("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("gmr_users_v5", JSON.stringify(users));
    localStorage.setItem("gmr_current_v5", JSON.stringify(newUser));

    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-semibold tracking-tight">Welcome</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary">
                <TabsTrigger value="login" className="data-[state=active]:bg-background">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                {/* Role Selection */}
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setLoginData({ ...loginData, role: role.value })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                          loginData.role === role.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${loginData.role === role.value ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-xs font-medium ${loginData.role === role.value ? "text-primary" : "text-muted-foreground"}`}>
                          {role.value === "ca" ? "CA" : role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
                    Sign In as {roles.find(r => r.value === loginData.role)?.label}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                {/* Role Selection for Signup */}
                <div className="grid grid-cols-2 gap-3">
                  {roles.filter(r => r.value !== "admin").map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSignupData({ ...signupData, role: role.value })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                          signupData.role === role.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${signupData.role === role.value ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-xs font-medium ${signupData.role === role.value ? "text-primary" : "text-muted-foreground"}`}>
                          {role.value === "ca" ? "Chartered Accountant" : role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sm font-medium">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      placeholder="Re-enter your password"
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
                    Create {signupData.role === "ca" ? "CA" : "Client"} Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
