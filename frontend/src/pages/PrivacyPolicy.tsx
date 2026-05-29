import Layout from "@/components/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container max-w-4xl py-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-black text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">How we protect and manage your data at BUILD YOUR THOUGHTS.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 space-y-8 text-sm leading-relaxed text-muted-foreground">

          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          {/* Introduction */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Introduction</h2>
            <p>
              Welcome to <strong className="text-foreground">BUILD YOUR THOUGHTS Private Limited</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </div>

          {/* Data We Collect */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">The Data We Collect About You</h2>
            <p className="mb-4">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <DataBox title="Identity Data" desc="Includes first name, last name, username or similar identifier." />
              <DataBox title="Contact Data" desc="Includes billing address, email address and telephone numbers." />
              <DataBox title="Technical Data" desc="Includes internet protocol (IP) address, browser type and version, device information." />
              <DataBox title="Usage Data" desc="Includes information about how you use our website, products and services." />
            </div>
          </div>

          {/* How We Use */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">How We Use Your Personal Data</h2>
            <p className="mb-3">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "To provide and maintain our site, including to monitor the usage of our service.",
                "To manage your requests and respond to your enquiries in a timely manner.",
                "For the performance of a contract and development of services.",
                "To send you updates, newsletters, or SMS regarding updates.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </div>

          {/* Legal Rights */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and, where the lawful ground of processing is consent, to withdraw consent.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="mb-5">If you have any questions about this Privacy Policy or our privacy practices, please reach out to us:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email Address</p>
                <a href="mailto:info@buildyourthoughts.com" className="text-primary font-medium hover:underline">info@buildyourthoughts.com</a>
              </div>
              <div className="p-5 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Office Address</p>
                <p className="text-foreground text-sm">T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

const DataBox = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 rounded-xl bg-muted/40 border border-border">
    <p className="font-bold text-foreground mb-1">{title}</p>
    <p className="text-xs">{desc}</p>
  </div>
);
