import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Thank you! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", message: "" });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const offices = [
    {
      name: "Gurgaon Office",
      address: "H.No.43, SF, Sector-7, Gurugram",
      phone: "+91 98712 09393"
    },
    {
      name: "Delhi Office",
      address: "AB 38, Ground Floor, Shalimar Bagh",
      phone: "+91 98710 84875"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-6 animate-fade", children: "Contact" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl mb-8 text-balance animate-fade animate-fade-delay-1", children: [
        "Get in ",
        /* @__PURE__ */ jsx("span", { className: "italic", children: "touch" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade animate-fade-delay-2", children: "We're ready to answer your questions and help you get started." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 border-t border-border/50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl mb-8", children: "Send Us a Message" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm tracking-wide", children: "Your Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                name: "name",
                value: formData.name,
                onChange: handleChange,
                placeholder: "Your Name",
                className: "mt-2 border-border/50 focus:border-foreground transition-colors",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-sm tracking-wide", children: "Your Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                name: "email",
                type: "email",
                value: formData.email,
                onChange: handleChange,
                placeholder: "Your Email",
                className: "mt-2 border-border/50 focus:border-foreground transition-colors",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "message", className: "text-sm tracking-wide", children: "Your Message" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "message",
                name: "message",
                value: formData.message,
                onChange: handleChange,
                placeholder: "Your Message",
                rows: 6,
                className: "mt-2 border-border/50 focus:border-foreground transition-colors resize-none",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "px-8", children: "Send Message" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl mb-8", children: "Contact Information" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          offices.map((office, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium", children: office.name }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: office.address })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 flex-shrink-0" }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `tel:${office.phone.replace(/\s/g, "")}`,
                    className: "hover:text-foreground transition-colors",
                    children: office.phone
                  }
                )
              ] })
            ] })
          ] }, index)),
          /* @__PURE__ */ jsx("div", { className: "pt-6 border-t border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 flex-shrink-0" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:info@gmrindia.com",
                className: "hover:text-foreground transition-colors",
                children: "info@gmrindia.com"
              }
            )
          ] }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 border-t border-border/50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsx(
      "iframe",
      {
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.0!2d77.03!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzEyLjAiTiA3N8KwMDEnNDguMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
        width: "100%",
        height: "400",
        style: { border: 0 },
        allowFullScreen: true,
        loading: "lazy",
        referrerPolicy: "no-referrer-when-downgrade",
        className: "grayscale"
      }
    ) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 bg-secondary/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-muted-foreground uppercase mb-4", children: "Business Hours" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl mb-12", children: "When we're available" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-8 border border-border/50 bg-background", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg mb-2", children: "Weekdays" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Monday \u2013 Friday" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl", children: "9:00 AM \u2013 6:00 PM" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-8 border border-border/50 bg-background", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg mb-2", children: "Saturday" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "Half Day" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl", children: "9:00 AM \u2013 1:00 PM" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-8 text-sm", children: "Closed on Sundays and public holidays" })
    ] }) }) })
  ] });
}
export {
  Contact as default
};
