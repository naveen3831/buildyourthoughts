import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, Send, Upload } from "lucide-react";
import { toast } from "sonner";

interface Job { _id: string; title: string; location: string; type: string; }

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => r.json())
      .then(data => setJob(data))
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) { toast.error("Please upload your resume"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("coverLetter", form.coverLetter);
      fd.append("resume", resumeFile);

      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      toast.success("Application submitted! We'll get back to you soon.");
      navigate("/career");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        {/* Back */}
        <Link to={`/career/${id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-border text-muted-foreground font-bold text-sm hover:text-foreground hover:border-primary/30 transition-all duration-300 mb-8 w-fit">
          <ArrowLeft size={16} /> Back to Job Details
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-2">
            Send Your <span className="text-gradient">Resume</span>
          </h1>
          <p className="text-muted-foreground">Ready to join our team? Upload your resume and tell us about yourself. We're always looking for talented individuals.</p>
          {job && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
              Applying for: {job.title}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-8 border border-border">
          <h2 className="text-xl font-heading font-black text-foreground mb-6 text-center">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Full Name *</label>
                <input value={form.name} onChange={f("name")} required placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none text-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={f("email")} required placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none text-sm transition-all" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Phone Number *</label>
                <input value={form.phone} onChange={f("phone")} required placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none text-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Position Applying For *</label>
                <input value={job?.title || ""} readOnly
                  className="w-full px-4 py-3 rounded-xl glass border border-border text-sm bg-muted/30 text-muted-foreground" />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Upload Resume *</label>
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors group">
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3 text-primary">
                    <Upload size={20} />
                    <span className="font-semibold text-sm">{resumeFile.name}</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <Upload size={32} className="mx-auto mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium">Click to upload your resume</p>
                    <p className="text-xs mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] || null)} className="hidden" />
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Cover Letter / Additional Message (Optional)</label>
              <textarea value={form.coverLetter} onChange={f("coverLetter")} rows={4}
                placeholder="Tell us about yourself, your experience, and why you want to join BUILD YOUR THOUGHTS..."
                className="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none text-sm resize-none transition-all" />
            </div>

            <p className="text-xs text-muted-foreground">By submitting this form, you agree to share your information with BUILD YOUR THOUGHTS for recruitment purposes.</p>

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-60">
              {submitting ? "Sending…" : <><Send size={16} /> Send Resume</>}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
