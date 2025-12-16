import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "Accounting & Bookkeeping",
      desc: "Precision financial management with meticulous attention to detail.",
      link: "/services/accounting",
    },
    {
      title: "Auditing & Assurance",
      desc: "Comprehensive audits ensuring accuracy and regulatory compliance.",
      link: "/services/auditing",
    },
    {
      title: "Tax Advisory",
      desc: "Strategic planning to optimize your tax position responsibly.",
      link: "/services/tax",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-40 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6 animate-fade">
            Chartered Accountants
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 text-balance animate-fade animate-fade-delay-1">
            Financial clarity for those who 
            <span className="italic"> demand excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-fade animate-fade-delay-2">
            Since 2011, we've partnered with discerning businesses to deliver 
            accounting services of the highest caliber.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade animate-fade-delay-3">
            <Button asChild size="lg">
              <Link to="/contact">
                Schedule Consultation
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-light mb-2">500+</p>
              <p className="text-sm text-muted-foreground tracking-wide">Clients Served</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-light mb-2">13+</p>
              <p className="text-sm text-muted-foreground tracking-wide">Years of Practice</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-light mb-2">99%</p>
              <p className="text-sm text-muted-foreground tracking-wide">Client Retention</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
              Services
            </p>
            <h2 className="text-3xl md:text-4xl mb-6">
              Comprehensive expertise across all financial disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group bg-background p-8 md:p-10 hover:bg-secondary/30 transition-colors duration-500"
              >
                <span className="text-xs text-muted-foreground tracking-widest">
                  0{index + 1}
                </span>
                <h3 className="text-xl md:text-2xl mt-4 mb-4 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
                <span className="text-sm flex items-center gap-2 text-foreground group-hover:gap-4 transition-all duration-300">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6">
              Our Philosophy
            </p>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl italic leading-relaxed mb-8">
              "Excellence is not a skill. It's an attitude reflected in every balance sheet, 
              every audit, every consultation."
            </blockquote>
            <p className="text-muted-foreground">— GMR & Associates</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to elevate your financial strategy?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Let's discuss how our expertise can serve your business objectives.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Begin the Conversation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}