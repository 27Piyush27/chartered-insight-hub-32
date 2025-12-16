export default function About() {
  const values = [
    {
      title: "Precision",
      desc: "Every figure verified. Every detail considered. No exceptions.",
    },
    {
      title: "Integrity",
      desc: "Transparent practices and honest counsel, even when it's difficult.",
    },
    {
      title: "Partnership",
      desc: "Your success is our measure. We invest in understanding your goals.",
    },
    {
      title: "Excellence",
      desc: "Standards that exceed expectations, consistently delivered.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-40 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6 animate-fade">
            About Us
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 text-balance animate-fade animate-fade-delay-1">
            Thirteen years of 
            <span className="italic"> trusted expertise</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade animate-fade-delay-2">
            Established in 2011, GMR & Associates has grown from a dedicated practice 
            to a trusted partner for over 500 businesses across India.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
                Mission
              </p>
              <p className="text-lg leading-relaxed">
                To empower businesses with precise financial insights and compliance 
                solutions, delivered with the care and attention your enterprise deserves.
              </p>
            </div>
            <div>
              <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
                Vision
              </p>
              <p className="text-lg leading-relaxed">
                To be recognized as India's most trusted chartered accountancy firm—setting 
                the standard for quality, integrity, and client dedication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
              Our Values
            </p>
            <h2 className="text-3xl md:text-4xl">
              The principles that guide every engagement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-background p-8 md:p-12"
              >
                <span className="text-xs text-muted-foreground tracking-widest">
                  0{index + 1}
                </span>
                <h3 className="text-2xl mt-4 mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6">
              Our Story
            </p>
            <div className="space-y-8 text-lg leading-relaxed">
              <p>
                GMR & Associates began with a conviction: that every business, 
                regardless of size, deserves access to exceptional financial guidance.
              </p>
              <p className="text-muted-foreground">
                Over thirteen years, we've remained steadfast in this belief. We've 
                witnessed our clients grow from startups to established enterprises, 
                navigating complex regulatory landscapes and emerging stronger.
              </p>
              <p className="text-muted-foreground">
                Our 99% client retention rate speaks not to our marketing, but to 
                something more fundamental—the relationships we build and the results 
                we deliver, year after year.
              </p>
              <p>
                Today, we continue to evolve, integrating thoughtful technology where 
                it serves our clients, while never losing sight of what matters most: 
                the human judgment, expertise, and dedication that no algorithm can replace.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}