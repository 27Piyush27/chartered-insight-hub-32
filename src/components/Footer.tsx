import { Link } from "react-router-dom";
import logo from "@/assets/logo.avif";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm mt-20 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in">
            <img src={logo} alt="GMR & Associates" className="h-12 mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              A leading chartered accountancy firm providing comprehensive professional services with
              innovative AI-powered solutions.
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-semibold mb-4 text-primary">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Accounting</li>
              <li className="text-muted-foreground">Auditing</li>
              <li className="text-muted-foreground">Tax Advisory</li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold mb-4 text-primary">Contact Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Gurgaon:</strong> H.No.43, SF, Sector-7
              </p>
              <p>
                <strong>Delhi:</strong> AB 38, Ground Floor, Shalimar Bagh
              </p>
              <p>
                <a href="mailto:info@gmrindia.com" className="hover:text-primary transition-colors">
                  info@gmrindia.com
                </a>
              </p>
              <p>
                <a href="tel:+919871209393" className="hover:text-primary transition-colors">
                  +91 98712 09393
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GMR & Associates. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
