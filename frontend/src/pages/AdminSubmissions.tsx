import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";

interface ContactMsg {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

const API = "/api";
const getToken = () => localStorage.getItem("speshway_admin_token");

const statusColors: Record<string, string> = {
  unread: "bg-blue-100 text-blue-700",
  read: "bg-yellow-100 text-yellow-700",
  replied: "bg-green-100 text-green-700",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<ContactMsg | null>(null);

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setContacts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/contact/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    setContacts(prev => prev.map(c => c._id === id ? { ...c, status: status as ContactMsg["status"] } : c));
    if (selected?._id === id) setSelected(prev => prev ? { ...prev, status: status as ContactMsg["status"] } : null);
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    await fetch(`${API}/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setContacts(prev => prev.filter(c => c._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = contacts.filter(c => c.status === "unread").length;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Submissions" />

      <main className="lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Contact Messages</h1>
            <p className="text-gray-400 text-sm mt-1">
              Messages sent from the contact form
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-sm"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-sm font-medium"
          >
            {["All", "unread", "read", "replied"].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="px-4 py-2.5 rounded-xl bg-cyan-50 text-cyan-700 text-sm font-bold">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">No messages found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Sender", "Subject", "Date", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.status === "unread" ? "bg-cyan-50/40" : ""}`}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium max-w-[220px] truncate">{c.subject}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{fmt(c.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold capitalize ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => { setSelected(c); if (c.status === "unread") updateStatus(c._id, "read"); }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 text-xs font-bold hover:bg-cyan-100 transition-colors"
                        >
                          View
                        </button>
                        <select
                          value={c.status}
                          onChange={e => updateStatus(c._id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:border-cyan-400 capitalize"
                        >
                          {["unread", "read", "replied"].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => deleteContact(c._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Message Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Name" value={selected.name} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Received" value={fmt(selected.createdAt)} />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected._id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-cyan-500 focus:outline-none capitalize"
                  >
                    {["unread", "read", "replied"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm text-gray-800 font-semibold">{selected.subject}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                onClick={() => updateStatus(selected._id, "replied")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-colors"
              >
                ✉️ Reply via Email
              </a>
              <button
                onClick={() => deleteContact(selected._id)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors border border-red-100"
              >
                🗑️ Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value}</p>
  </div>
);
