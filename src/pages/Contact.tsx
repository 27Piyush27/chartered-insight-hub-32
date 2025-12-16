import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Thank you! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const offices = [
    {
      name: "Gurgaon Office",
      address: "H.No.43, SF, Sector-7, Gurugram",
      phone: "+91 98712 09393",
    },
    {
      name: "Delhi Office",
      address: "AB 38, Ground Floor, Shalimar Bagh",
      phone: "+91 98710 84875",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6 animate-fade">
            Contact
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 text-balance animate-fade animate-fade-delay-1">
            Get in <span className="italic">touch</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade animate-fade-delay-2">
            We're ready to answer your questions and help you get started.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm tracking-wide">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="mt-2 border-border/50 focus:border-foreground transition-colors"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm tracking-wide">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="mt-2 border-border/50 focus:border-foreground transition-colors"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm tracking-wide">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={6}
                    className="mt-2 border-border/50 focus:border-foreground transition-colors resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="px-8">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl md:text-3xl mb-8">Contact Information</h2>
              <div className="space-y-10">
                {offices.map((office, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-medium">{office.name}</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 flex-shrink-0" />
                        <a 
                          href={`tel:${office.phone.replace(/\s/g, '')}`}
                          className="hover:text-foreground transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href="mailto:info@gmrindia.com"
                      className="hover:text-foreground transition-colors"
                    >
                      info@gmrindia.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.0!2d77.03!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzEyLjAiTiA3N8KwMDEnNDguMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale"
            />
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
              Business Hours
            </p>
            <h2 className="text-3xl md:text-4xl mb-12">When we're available</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-border/50 bg-background">
                <h3 className="text-lg mb-2">Weekdays</h3>
                <p className="text-muted-foreground text-sm mb-2">Monday – Friday</p>
                <p className="text-xl">9:00 AM – 6:00 PM</p>
              </div>
              <div className="p-8 border border-border/50 bg-background">
                <h3 className="text-lg mb-2">Saturday</h3>
                <p className="text-muted-foreground text-sm mb-2">Half Day</p>
                <p className="text-xl">9:00 AM – 1:00 PM</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-8 text-sm">
              Closed on Sundays and public holidays
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}