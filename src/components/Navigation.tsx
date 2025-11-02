import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.avif";

export const Navigation = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }

    const currentUser = localStorage.getItem("gmr_current_v5");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUsername(user.name || user.email);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("gmr_current_v5");
    setIsLoggedIn(false);
    setUsername("");
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <>
      <div className="hidden md:block bg-primary text-primary-foreground py-2 shadow-sm">
        <div className="container mx-auto px-4 flex justify-end items-center gap-6 text-sm">
          <a href="mailto:info@gmrindia.com" className="hover:opacity-80 transition-all flex items-center gap-2">
            <Mail className="h-4 w-4" />
            info@gmrindia.com
          </a>
          <a href="tel:+919871209393" className="hover:opacity-80 transition-all flex items-center gap-2">
            <Phone className="h-4 w-4" />
            +91 98712 09393
          </a>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src={logo} alt="GMR & Associates" className="h-12" />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {isLoggedIn ? (
                <>
                  <span className="text-sm font-medium px-3">{username}</span>
                  <Button onClick={handleLogout} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth?signup=true">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t mt-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="flex-1">
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="ml-2">{isDark ? "Light" : "Dark"} Mode</span>
                </Button>
              </div>
              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Sign Out ({username})
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/auth?signup=true">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
