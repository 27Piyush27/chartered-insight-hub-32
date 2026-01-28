import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { servicesData } from "@/lib/servicesData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Calculator, 
  FileCheck, 
  Percent, 
  Users, 
  TrendingUp,
  Building,
  Shield,
  ClipboardCheck,
  Clock,
  ArrowRight,
  IndianRupee,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="h-6 w-6" />,
  FileCheck: <FileCheck className="h-6 w-6" />,
  Percent: <Percent className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  ClipboardCheck: <ClipboardCheck className="h-6 w-6" />,
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEnroll = (serviceId: string) => {
    if (!user) {
      toast.error("Please login to enroll in a service");
      navigate("/auth", { state: { redirectTo: `/checkout/${serviceId}` } });
      return;
    }
    navigate(`/checkout/${serviceId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 lg:px-12 text-center border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 text-xs tracking-widest uppercase">
              Professional Services
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
              Expert Financial Solutions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive CA services tailored to your needs. Select a service to get started with instant enrollment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {servicesData.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeIn}
                className="group relative"
              >
                <div className="h-full bg-background border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-soft hover:border-border flex flex-col">
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute -top-3 right-6">
                      <Badge className="bg-foreground text-background gap-1">
                        <Sparkles className="w-3 h-3" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      {iconMap[service.icon]}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {service.shortDesc}
                  </p>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-semibold flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {service.price.toLocaleString()}
                    </span>
                    {service.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{service.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Features Preview */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{service.features.length - 3} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleEnroll(service.id)}
                    className="w-full group/btn"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm tracking-widest text-background/60 uppercase mb-4">
              Need a Custom Solution?
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 max-w-2xl mx-auto">
              Don't see what you're looking for?
            </h2>
            <p className="text-background/70 mb-10 max-w-xl mx-auto">
              Every business is unique. Contact us to discuss how we can customize 
              our services to meet your specific requirements.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}