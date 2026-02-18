import { jsx, jsxs } from "react/jsx-runtime";
function About() {
  const values = [
    {
      title: "Precision",
      desc: "Every figure verified. Every detail considered. No exceptions."
    },
    {
      title: "Integrity",
      desc: "Transparent practices and honest counsel, even when it's difficult."
    },
    {
      title: "Partnership",
      desc: "Your success is our measure. We invest in understanding your goals."
    },
    {
      title: "Excellence",
      desc: "Standards that exceed expectations, consistently delivered."
    }
  ];
  const partners = [
    {
      name: "Gaurav Makkar",
      title: "",
      desc: "An expert in capital markets and statutory audits, Mr. Makkar has a sound financial and accounting background, assisting numerous SMEs with project financing from nationalised banks."
    },
    {
      name: "Mohit Gupta",
      title: "FCA, LLB",
      desc: "With 10+ years of experience, Mr. Gupta specializes in Taxation and the NGO sector. He provides expert consultancy and handles complex GST cases, searches, and appeals."
    },
    {
      name: "Saurabh Madan",
      title: "",
      desc: "Mr. Madan brings a wealth of knowledge in corporate finance and advisory, helping businesses navigate complex financial landscapes and achieve sustainable growth."
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-40 px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-6 animate-fade", children: "About Us" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl mb-8 text-balance animate-fade animate-fade-delay-1", children: [
        "Thirteen years of",
        /* @__PURE__ */ jsx("span", { className: "italic", children: " trusted expertise" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade animate-fade-delay-2", children: "Established in 2011, GMR & Associates has grown from a dedicated practice to a trusted partner for over 500 businesses across India." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 border-y border-border/50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Mission" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed", children: "To empower businesses with precise financial insights and compliance solutions, delivered with the care and attention your enterprise deserves." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Vision" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed", children: "To be recognized as India's most trusted chartered accountancy firm\u2014setting the standard for quality, integrity, and client dedication." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mb-16", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Our Values" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl", children: "The principles that guide every engagement" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50", children: values.map((value, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-background p-8 md:p-12",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground tracking-widest", children: [
              "0",
              index + 1
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl mt-4 mb-4", children: value.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: value.desc })
          ]
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-secondary/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-6", children: "About GMR & Associates" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-lg leading-relaxed", children: [
        /* @__PURE__ */ jsx("p", { children: "Established in 2011, we are a premier chartered accountancy firm dedicated to providing comprehensive professional services. We merge deep domain expertise with innovative technology to deliver unparalleled value to our clients across India." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Over thirteen years, we've remained steadfast in this belief. We've witnessed our clients grow from startups to established enterprises, navigating complex regulatory landscapes and emerging stronger." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Our 99% client retention rate speaks not to our marketing, but to something more fundamental\u2014the relationships we build and the results we deliver, year after year." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mb-16 text-center mx-auto", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Leadership" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl", children: "Our Partners" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto", children: partners.map((partner, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "text-center p-8 border border-border/50 bg-background",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-secondary/50 mx-auto mb-6" }),
            /* @__PURE__ */ jsxs("h3", { className: "text-xl mb-1", children: [
              partner.name,
              partner.title && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-base font-normal", children: [
                ", ",
                partner.title
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mt-4", children: partner.desc })
          ]
        },
        index
      )) })
    ] }) })
  ] });
}
export {
  About as default
};
