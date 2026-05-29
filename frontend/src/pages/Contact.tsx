import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "@/context/SiteDataContext";

const Contact = () => {
  const { settings, s } = useSiteData();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", subject: "", message: "" });

  const contactInfo = useMemo(
    () => [
      { icon: Mail, label: "Email", value: settings.contact_email || "info@buildyourthoughts.com", color: "primary" as const },
      { icon: Phone, label: "Phone", value: settings.contact_phone || "+91 9100006020", color: "secondary" as const },
      { icon: MapPin, label: "Address", value: settings.contact_address || "T-Hub, Hyderabad, Telangana 500032", color: "accent" as const },
      { icon: Globe, label: "Website", value: settings.site_tagline || "www.buildyourthoughts.com", color: "primary" as const },
    ],
    [settings]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message || "Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    }
  };

  return (
    <Layout>
      <PageHeader title="Contact Us" subtitle="Get in touch with our team." />

      <section className="py-8 md:py-20 bg-background relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
        <div className="container grid md:grid-cols-2 gap-6 md:gap-12 relative">

          {/* Form */}
          <AnimatedSection animation="slide-in-left">
            <span className="text-primary text-xs md:text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-lg md:text-2xl font-heading font-bold mt-1 md:mt-2 mb-4 md:mb-6 text-foreground">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
              {[
                { placeholder: "Your Name", key: "name", type: "text" },
                { placeholder: "Your Email", key: "email", type: "email" },
                { placeholder: "Phone Number", key: "phone", type: "tel" },
              ].map((field, i) => (
                <AnimatedSection key={field.key} delay={i * 80} animation="fade-in-up">
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg glass focus:glow-border focus:outline-none transition-all duration-300 text-sm md:text-base"
                  />
                </AnimatedSection>
              ))}
              <AnimatedSection delay={240} animation="fade-in-up">
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg glass focus:glow-border focus:outline-none transition-all duration-300 text-sm md:text-base"
                />
              </AnimatedSection>
              <AnimatedSection delay={320} animation="fade-in-up">
                <textarea
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg glass focus:glow-border focus:outline-none transition-all duration-300 resize-none text-sm md:text-base"
                />
              </AnimatedSection>
              <AnimatedSection delay={320} animation="fade-in-up">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm md:text-base hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] transition-all duration-300"
                >
                  <Send size={14} /> Send Message
                </button>
              </AnimatedSection>
            </form>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection animation="slide-in-right">
            <span className="text-secondary text-xs md:text-sm font-semibold uppercase tracking-widest">Contact Info</span>
            <h2 className="text-lg md:text-2xl font-heading font-bold mt-1 md:mt-2 mb-4 md:mb-6 text-foreground">How to Reach Us</h2>
            <div className="flex flex-col gap-3 md:gap-4">
              {contactInfo.map((c, i) => (
                <AnimatedSection key={c.label} delay={i * 100} animation="slide-in-right">
                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl glass hover:glow-border-strong transition-all duration-300 group">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-${c.color}/10 flex items-center justify-center shrink-0 border border-${c.color}/10`}>
                      <c.icon className={`text-${c.color}`} size={15} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-foreground">{c.label}</h4>
                      <p className="text-muted-foreground text-xs md:text-sm leading-tight">{c.value}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={400} animation="fade-in-up" className="mt-4 md:mt-6">
              <div className="glass rounded-xl p-4 md:p-6 glow-border">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Clock className="text-primary" size={16} />
                  <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">Business Hours</h3>
                </div>
                <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p>Saturday: 10:00 AM - 2:00 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={500} animation="fade-in-up" className="mt-3 md:mt-4">
              <div className="glass rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <MessageSquare className="text-secondary" size={16} />
                  <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">Quick Response</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">We typically respond within 2-4 business hours. For urgent matters, call us directly.</p>
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
