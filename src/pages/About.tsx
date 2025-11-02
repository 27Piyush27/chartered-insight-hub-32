import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Client-Centric",
      desc: "Your success is our priority. We tailor our services to meet your unique needs.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Precision & Accuracy",
      desc: "We maintain the highest standards of accuracy in all our financial services.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Professional Excellence",
      desc: "Our team comprises highly qualified chartered accountants with proven expertise.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Innovation",
      desc: "We leverage cutting-edge AI technology to deliver faster, smarter solutions.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            About GMR & Associates
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-95 animate-fade-in leading-relaxed">
            Established in 2011, we are a premier chartered accountancy firm dedicated to providing
            comprehensive professional services. We merge deep domain expertise with innovative
            technology to deliver unparalleled value to our clients across India.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up border-t-4 border-t-primary">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower businesses with accurate, timely financial insights and compliance
                  solutions through the perfect blend of professional expertise and AI-driven
                  technology. We strive to be the trusted financial partner for businesses of all
                  sizes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up border-t-4 border-t-accent" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be recognized as India's leading chartered accountancy firm that sets the
                  standard for innovation, quality, and client satisfaction. We envision a future
                  where technology and human expertise work seamlessly together to solve complex
                  financial challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 to-secondary/60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center animate-fade-in hover:scale-105 transition-transform duration-300 p-6 rounded-xl bg-background/50 backdrop-blur-sm shadow-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center mb-4 bg-gradient-to-br from-primary/10 to-primary-light/10 p-4 rounded-xl">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>

            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Founded in 2011, GMR & Associates began with a simple yet powerful vision: to provide
                businesses with world-class chartered accountancy services that combine traditional
                expertise with modern technology. Over the past 13+ years, we've grown from a small
                practice to a trusted partner for over 500 businesses across India.
              </p>

              <p className="leading-relaxed">
                Our journey has been marked by continuous innovation and an unwavering commitment to
                our clients' success. We were among the first CA firms in India to integrate
                artificial intelligence into our service delivery, allowing us to provide faster,
                more accurate, and more insightful financial services.
              </p>

              <p className="leading-relaxed">
                Today, we serve clients across diverse industries, from startups to established
                enterprises, helping them navigate complex financial landscapes, ensure compliance,
                and achieve their business goals. Our 99% client retention rate is a testament to the
                quality of our work and the strength of our relationships.
              </p>

              <p className="leading-relaxed">
                As we look to the future, we remain committed to pushing the boundaries of what's
                possible in chartered accountancy, always putting our clients' needs first and
                maintaining the highest standards of professional excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
