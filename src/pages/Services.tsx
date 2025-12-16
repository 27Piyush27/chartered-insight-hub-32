import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { services } from "@/lib/services";
import { 
  Calculator, 
  FileCheck, 
  Percent, 
  Gavel, 
  Users, 
  TrendingUp 
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="h-8 w-8" />,
  FileCheck: <FileCheck className="h-8 w-8" />,
  Percent: <Percent className="h-8 w-8" />,
  Gavel: <Gavel className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  TrendingUp: <TrendingUp className="h-8 w-8" />,
};

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 animate-fade italic">
            Our Professional Services
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade animate-fade-delay-1">
            Comprehensive solutions to meet all your financial needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-background p-8 md:p-10 flex flex-col text-center animate-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6 text-foreground">
                  {iconMap[service.icon]}
                </div>

                <h3 className="text-xl md:text-2xl mb-4">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                  {service.desc}
                </p>

                <Button variant="outline" asChild className="w-full">
                  <Link to={`/services/${service.id}`}>
                    Learn More
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
            Custom Solutions
          </p>
          <h2 className="text-3xl md:text-4xl mb-6 max-w-2xl mx-auto">
            Need a tailored approach for your business?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Every business is unique. Contact us to discuss how we can customize 
            our services to meet your specific requirements.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}