import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import MotionSection from "@/components/MotionSection";
import GooeyButton from "@/components/GooeyButton";
import { ArrowRight, CheckCircle, ArrowLeft, Code, Cloud, Shield, Cpu, Smartphone, Database, Globe, Settings, BarChart, Zap } from "lucide-react";
import TextReveal from "@/components/TextReveal";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  order: number;
}

const iconMap: Record<string, React.ElementType> = {
  Code, Cloud, Shield, Cpu, Smartphone, Database, Globe, Settings, BarChart, Zap,
};

// Slug helper — "Web Development" → "web-development"
export function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Fallback static services matching the real buildyourthoughts.com services
const fallbackServices: Service[] = [
  { _id: "1", icon: "Code", title: "SAP", description: "SAP (Systems, Applications, and Products) is leading enterprise resource planning (ERP) software that centralizes a company's core business processes into one integrated system.", color: "primary", features: ["Centralized Data", "Integrated Modules", "Workflow Automation", "Real-time Reporting", "Finance & HR Management"], order: 0 },
  { _id: "2", icon: "BarChart", title: "Power BI", description: "Power BI is a business analytics tool from Microsoft that allows users to connect to and visualize data from various sources to create interactive reports and dashboards.", color: "secondary", features: ["Data Connectivity", "Data Analysis", "Visualization", "Interactive Dashboards", "AI-powered Insights"], order: 1 },
  { _id: "3", icon: "Code", title: "Full Stack Python", description: "A Full Stack Python Developer handles end-to-end development of web applications, encompassing both client-side (frontend) and server-side (backend) components.", color: "accent", features: ["React, Angular, or Vue.js", "PostgreSQL, MySQL, MongoDB", "REST API Development", "Django / Flask Backend", "Cloud Deployment"], order: 2 },
  { _id: "4", icon: "Database", title: "Full Stack Java", description: "Building entire web applications using Java for the back-end and combining it with front-end technologies like HTML, CSS, JavaScript, and frameworks like Angular, React.", color: "primary", features: ["Core: HTML, CSS, JavaScript", "Frameworks: Angular, React.js", "Database: MySQL, PostgreSQL, MongoDB", "Spring Boot Backend", "Microservices Architecture"], order: 3 },
  { _id: "5", icon: "Shield", title: "Cybersecurity", description: "Enterprise-grade cybersecurity solutions including firewall configuration, penetration testing, and data backup to protect your business from threats.", color: "secondary", features: ["Firewall Configuration", "Penetration Testing", "Data Backup & Recovery", "Security Audits", "Compliance Management"], order: 4 },
  { _id: "6", icon: "Cloud", title: "Cloud Deployment & DevOps", description: "AWS DevOps combines Amazon Web Services' cloud tools with DevOps practices to speed up software delivery via automated CI/CD pipelines and infrastructure as code.", color: "accent", features: ["AWS / Azure / GCP Deployment", "Automated CI/CD Pipelines", "Monitoring & Logging", "Infrastructure as Code", "Container Orchestration"], order: 5 },
  { _id: "7", icon: "Globe", title: "Digital Marketing", description: "Digital marketing using digital channels and technologies to promote products/services, build brands, and connect with customers through data-driven, personalized experiences.", color: "primary", features: ["SEO & SEM", "Social Media Marketing", "Content Strategy", "Email Marketing", "Analytics & Reporting"], order: 6 },
  { _id: "8", icon: "Zap", title: "E-Commerce Solutions", description: "E-commerce solutions for online buying and selling of goods and services, facilitating interactions between businesses (B2B) and businesses and consumers (B2C).", color: "secondary", features: ["Product Catalog Management", "Payment Gateway Integration", "Inventory Management", "Order Tracking", "Admin Dashboard"], order: 7 },
  { _id: "9", icon: "Smartphone", title: "Mobile App Development", description: "Mobile app development for smartphones, tablets, and other handheld devices, offering native & cross-platform apps with smooth UI interactions and high security.", color: "accent", features: ["Native & Cross-Platform Apps", "Smooth UI Interactions", "High Security", "Push Notifications", "App Store Deployment"], order: 8 },
  { _id: "10", icon: "Cpu", title: "Website Development", description: "Web development is the process of creating, building, and maintaining websites and web applications using modern technologies for responsive, high-performance pages.", color: "primary", features: ["Mobile-Friendly Layouts", "SEO Optimized", "High-Performance Pages", "CMS Integration", "E-Commerce Ready"], order: 9 },
];

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge: API services first, then add fallback ones not already covered
          const apiTitles = new Set(data.map((s: Service) => toSlug(s.title)));
          const extras = fallbackServices.filter(s => !apiTitles.has(toSlug(s.title)));
          setServices([...data, ...extras]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const service = services.find(s => toSlug(s.title) === slug);
  const otherServices = services.filter(s => toSlug(s.title) !== slug).slice(0, 4);
  const Icon = service ? (iconMap[service.icon] || Code) : Code;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-black text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all">
            <ArrowLeft size={18} /> Back to Services
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Back button */}
          <AnimatedSection animation="fade-in-up" className="mb-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted-foreground font-bold text-sm hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 w-fit"
            >
              <ArrowLeft size={16} /> Back to Services
            </Link>
          </AnimatedSection>

          {/* Breadcrumb */}
          <AnimatedSection animation="fade-in-up" className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">{service.title}</span>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <AnimatedSection animation="fade-in-up">
                <div className={`w-20 h-20 rounded-3xl bg-${service.color}/15 flex items-center justify-center mb-8 border border-${service.color}/20`}>
                  <Icon className={`text-${service.color}`} size={40} />
                </div>
              </AnimatedSection>

              <MotionSection animation="skew-up">
                <span className={`text-${service.color} text-sm font-bold uppercase tracking-[0.3em] block mb-4`}>
                  Our Services
                </span>
                <TextReveal
                  text={service.title}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black mb-6 leading-tight"
                />
                <p className="text-muted-foreground text-xl leading-relaxed mb-10 font-light">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact">
                    <GooeyButton color="primary">
                      Get a Free Quote <ArrowRight size={18} className="inline ml-2" />
                    </GooeyButton>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border text-foreground font-bold hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    <ArrowLeft size={18} /> All Services
                  </Link>
                </div>
              </MotionSection>
            </div>

            {/* Features card */}
            <AnimatedSection animation="slide-in-right">
              <div className="glass rounded-3xl p-10 border border-white/10 shadow-2xl">
                <h3 className="font-bold text-xl text-foreground mb-8 flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl bg-${service.color}/20 flex items-center justify-center`}>
                    <CheckCircle className={`text-${service.color}`} size={18} />
                  </span>
                  What's Included
                </h3>
                <div className="grid gap-4">
                  {(service.features.length > 0 ? service.features : ["Custom solution tailored to your needs", "Expert team with years of experience", "Agile development methodology", "Post-launch support & maintenance"]).map((f, i) => (
                    <AnimatedSection key={i} delay={i * 80} animation="slide-in-right">
                      <div className="flex items-center gap-4 group">
                        <div className={`w-8 h-8 rounded-xl bg-${service.color}/10 flex items-center justify-center shrink-0 group-hover:bg-${service.color}/20 group-hover:scale-110 transition-all duration-300`}>
                          <CheckCircle className={`text-${service.color}`} size={16} />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">{f}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us for this service */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <MotionSection animation="parallax-reveal" className="text-center mb-16">
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Why BUILD YOUR THOUGHTS</span>
            <TextReveal
              text="Why Choose Us for This Service"
              className="text-3xl md:text-5xl font-heading font-bold justify-center"
            />
          </MotionSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🏆", title: "Proven Expertise", desc: "Years of hands-on experience delivering successful projects across industries." },
              { icon: "⚡", title: "Fast Delivery", desc: "Agile methodology ensures rapid deployment without compromising quality." },
              { icon: "🔒", title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime guarantee for peace of mind." },
            ].map((item, i) => (
              <MotionSection key={item.title} delay={i * 0.1} animation="skew-up">
                <div className="glass rounded-3xl p-8 text-center hover:glow-border-strong transition-all duration-700 hover:-translate-y-2 border-white/5">
                  <div className="text-5xl mb-6">{item.icon}</div>
                  <h3 className="font-bold text-xl text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="container">
            <MotionSection animation="parallax-reveal" className="text-center mb-16">
              <span className="text-secondary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Explore More</span>
              <TextReveal
                text="Other Services We Offer"
                className="text-3xl md:text-5xl font-heading font-bold justify-center"
              />
            </MotionSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherServices.map((s, i) => {
                const OtherIcon = iconMap[s.icon] || Code;
                return (
                  <AnimatedSection key={s._id} delay={i * 100} animation="fade-in-up">
                    <Link
                      to={`/services/${toSlug(s.title)}`}
                      className="group block h-full p-6 rounded-2xl glass hover:glow-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-white/5"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${s.color}/10 flex items-center justify-center mb-5 group-hover:bg-${s.color}/20 group-hover:scale-110 transition-all duration-300 border border-${s.color}/10`}>
                        <OtherIcon className={`text-${s.color}`} size={24} />
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{s.description}</p>
                      <span className="inline-flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider mt-4 group-hover:gap-2 transition-all">
                        Learn More <ArrowRight size={14} />
                      </span>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">
                View All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-card/50 to-secondary/10" />
        <MotionSection animation="zoom-out" className="container text-center relative z-10">
          <TextReveal
            text="Ready to Get Started?"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black mb-6 justify-center"
          />
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Let's discuss how our {service.title} service can help transform your business.
          </p>
          <Link to="/contact">
            <GooeyButton color="primary">
              Contact Us Today <ArrowRight size={20} className="inline ml-2" />
            </GooeyButton>
          </Link>
        </MotionSection>
      </section>
    </Layout>
  );
}
