import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="container max-w-4xl py-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-black text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">This governs your agreement for using BUILD YOUR THOUGHTS services.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 space-y-8 text-sm leading-relaxed text-muted-foreground">

          {/* Intro */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 text-foreground text-sm leading-relaxed">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using BUILD YOUR THOUGHTS website and services operated by BUILD YOUR THOUGHTS Private Limited ("us", "we", or "our").
          </div>

          <Section num="1" title="Acceptance of Terms">
            By accessing or using the services you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
          </Section>

          <Section num="2" title="Intellectual Property">
            The Service and its original content, features, and functionality are and will remain the exclusive property of <strong className="text-foreground">BUILD YOUR THOUGHTS Private Limited</strong> and its licensors. It is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of BUILD YOUR THOUGHTS Private Limited.
          </Section>

          <Section num="3" title="Links To Other Web Sites">
            Our Service may contain links to third-party websites or services that are not owned or controlled by BUILD YOUR THOUGHTS Private Limited. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that BUILD YOUR THOUGHTS Private Limited shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </Section>

          <Section num="4" title="Limitation of Liability">
            In no event shall Build Your Thoughts Private Limited, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </Section>

          <Section num="5" title="Disclaimer">
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. Build Your Thoughts Private Limited, its subsidiaries, affiliates, and its licensors do not warrant that (a) the Service will function uninterrupted, secure, or available at any particular time or location; (b) any errors or defects will be corrected; (c) the Service is free of viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
          </Section>

          <Section num="6" title="Governing Law">
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </Section>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="mb-5">If you have any questions about these Terms, please contact us:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email</p>
                <a href="mailto:info@buildyourthoughts.com" className="text-primary font-medium hover:underline">info@buildyourthoughts.com</a>
              </div>
              <div className="p-5 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Address</p>
                <p className="text-foreground text-sm">T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, Hyderabad, Telangana 500032</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </Layout>
  );
}

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-lg font-bold text-foreground mb-3">{num}. {title}</h2>
    <p>{children}</p>
  </div>
);
