import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-lg font-medium mb-4">
              GMR<span className="text-accent">&</span>Associates
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Chartered Accountants providing comprehensive professional services 
              with precision and integrity since 2011.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
              Navigation
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-foreground hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-foreground hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-foreground hover:text-accent transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
              Contact
            </p>
            <div className="space-y-3 text-sm">
              <p className="text-foreground">
                <a href="mailto:info@gmrindia.com" className="hover:text-accent transition-colors">
                  info@gmrindia.com
                </a>
              </p>
              <p className="text-foreground">
                <a href="tel:+919871209393" className="hover:text-accent transition-colors">
                  +91 98712 09393
                </a>
              </p>
              <p className="text-muted-foreground">
                Gurgaon & Delhi, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GMR & Associates. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Chartered Accountants
          </p>
        </div>
      </div>
    </footer>
  );
};