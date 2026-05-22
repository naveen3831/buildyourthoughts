import { useEffect, useRef, useState } from "react";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface SettingItem {
  _id: string; key: string; label: string; value: string; group: string; type: string;
}

const API = "/api";
const getToken = () => localStorage.getItem("speshway_admin_token");

const groupLabels: Record<string, { icon: string; title: string }> = {
  stats: { icon: "📊", title: "Stats / Counters" },
  site: { icon: "🌐", title: "Site Information" },
  contact: { icon: "📞", title: "Contact Details" },
  social: { icon: "📱", title: "Social Media Links" },
  seo: { icon: "🔍", title: "SEO Settings" },
  home: { icon: "🏠", title: "Home Page Text" },
  appearance: { icon: "🎨", title: "Appearance & Misc" },
  assets: { icon: "🖼️", title: "Site Images" },
};

const assetFields = [
  { key: "asset_about_team", label: "About / Team Photo", hint: "Used on About, Team & Career pages" },
  { key: "asset_web_showcase", label: "Web Showcase Image", hint: "Used on Services page" },
  { key: "asset_logo", label: "Site Logo", hint: "Used in Navbar, Footer & Admin sidebar" },
];

export default function SiteSettingsPanel({ admin }: { admin?: { email?: string; role?: string } | null }) {
  const [items, setItems] = useState<SettingItem[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeGroup, setActiveGroup] = useState("site");
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [assetSaving, setAssetSaving] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchAssets = () => {
    fetch(`${API}/assets`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => setAssets(data))
      .catch(() => {});
  };

  const handleAssetUpload = async (key: string, file: File) => {
    setAssetSaving(p => ({ ...p, [key]: true }));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("key", key);
    try {
      const res = await fetch(`${API}/assets/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setAssets(p => ({ ...p, [key]: data.url }));
        notifySiteDataUpdated("assets");
      }
    } catch {}
    setAssetSaving(p => ({ ...p, [key]: false }));
  };

  useEffect(() => {
    fetch(`${API}/settings/all`, { headers: { Authorization: `Bearer ${getToken()}` }, cache: "no-store" })
      .then(r => r.json())
      .then((data: SettingItem[]) => {        setItems(Array.isArray(data) ? data : []);
        const map: Record<string, string> = {};
        data.forEach(i => { map[i.key] = i.value; });
        setValues(map);
      });
    fetchAssets();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(p => ({ ...p, [key]: true }));
    try {
      await fetch(`${API}/settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ value: values[key] }),
      });
      setSaved(p => ({ ...p, [key]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2000);
      const itemGroup = items.find(i => i.key === key)?.group;
      notifySiteDataUpdated(itemGroup === "home" || key.startsWith("whyus_") ? "all" : "settings");
    } catch {}
    setSaving(p => ({ ...p, [key]: false }));
  };

  const handleSaveGroup = async (group: string) => {
    const groupItems = items.filter(i => i.group === group);
    const updates: Record<string, string> = {};
    groupItems.forEach(i => { updates[i.key] = values[i.key] || ""; });
    setSaving(p => ({ ...p, [group]: true }));
    try {
      await fetch(`${API}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(updates),
      });
      setSaved(p => ({ ...p, [group]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [group]: false })), 2000);
      notifySiteDataUpdated(group === "home" || group === "stats" ? "all" : "settings");
    } catch {}
    setSaving(p => ({ ...p, [group]: false }));
  };

  const groups = [...new Set(items.map(i => i.group))].sort((a, b) => {
    const order = ["stats", "site", "contact", "social", "seo", "home", "appearance"];
    return order.indexOf(a) - order.indexOf(b);
  });
  // stats and assets groups are handled separately — exclude from generic tabs
  const genericGroups = groups.filter(g => g !== "stats" && g !== "assets");
  const groupItems = items.filter(i => i.group === activeGroup);

  return (
    <div className="space-y-6">
      {/* Admin info card */}
      {admin && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-6 items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xl">
            {admin.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{admin.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">{admin.role} · API: {API}</p>
          </div>
        </div>
      )}

      {/* ── Hero Highlight Color ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              🎨 Hero Highlight Color
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">The colour of the second line text in the homepage carousel (e.g. "Online &amp; Beyond")</p>
          </div>
          <button
            onClick={() => handleSave("hero_highlight_color")}
            disabled={saving["hero_highlight_color"]}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${saved["hero_highlight_color"] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}
          >
            {saving["hero_highlight_color"] ? "Saving…" : saved["hero_highlight_color"] ? "✓ Saved" : "Save"}
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Color picker */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 focus-within:border-purple-500 transition-all bg-white">
              <input
                type="color"
                value={values["hero_highlight_color"] || "#a855f7"}
                onChange={e => setValues(p => ({ ...p, hero_highlight_color: e.target.value }))}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={values["hero_highlight_color"] || ""}
                onChange={e => setValues(p => ({ ...p, hero_highlight_color: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSave("hero_highlight_color")}
                placeholder="#a855f7"
                className="w-28 text-sm focus:outline-none font-mono"
              />
            </div>
            {/* Preset swatches */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Purple", color: "#a855f7" },
                { label: "Orange", color: "#f97316" },
                { label: "Pink", color: "#ec4899" },
                { label: "Cyan", color: "#06b6d4" },
                { label: "Green", color: "#22c55e" },
                { label: "Yellow", color: "#eab308" },
                { label: "Red", color: "#ef4444" },
                { label: "White", color: "#ffffff" },
              ].map(s => (
                <button
                  key={s.color}
                  title={s.label}
                  onClick={() => setValues(p => ({ ...p, hero_highlight_color: s.color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${values["hero_highlight_color"] === s.color ? "border-gray-800 scale-110" : "border-gray-200"}`}
                  style={{ background: s.color }}
                />
              ))}
            </div>
            {/* Live preview */}
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400 mb-1">Preview</p>
              <span
                className="text-2xl font-black"
                style={{ color: values["hero_highlight_color"] || "#a855f7" }}
              >
                Online &amp; Beyond
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Quick Edit ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            📊 Stats / Counters
            <span className="text-xs text-gray-400 font-normal">— shown on the homepage</span>
          </h2>
          <button
            onClick={() => handleSaveGroup("stats")}
            disabled={saving["stats"]}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${saved["stats"] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}
          >
            {saving["stats"] ? "Saving…" : saved["stats"] ? "✓ Saved" : "Save All Stats"}
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { numKey: "stat_projects", suffixKey: "stat_projects_suffix", label: "Projects Delivered", icon: "🚀", color: "purple" },
            { numKey: "stat_clients", suffixKey: "stat_clients_suffix", label: "Happy Clients", icon: "😊", color: "blue" },
            { numKey: "stat_team", suffixKey: "stat_team_suffix", label: "Team Members", icon: "👥", color: "green" },
            { numKey: "stat_experience", suffixKey: "stat_experience_suffix", label: "Years Experience", icon: "⭐", color: "orange" },
          ].map(stat => (
            <div key={stat.numKey} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              {/* Preview */}
              <div className="text-3xl font-black text-purple-600 mb-3">
                {values[stat.numKey] || "0"}{values[stat.suffixKey] || "+"}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Number</label>
                  <input
                    type="number"
                    value={values[stat.numKey] || ""}
                    onChange={e => setValues(p => ({ ...p, [stat.numKey]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm font-bold"
                    min="0"
                  />
                </div>
                <div className="w-16">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Suffix</label>
                  <input
                    type="text"
                    value={values[stat.suffixKey] || ""}
                    onChange={e => setValues(p => ({ ...p, [stat.suffixKey]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm font-bold text-center"
                    maxLength={3}
                    placeholder="+"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Stats */}
        <div className="border-t border-gray-100 px-6 py-4">
          <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
            ✅ Why Choose Us — 4 Stat Cards
            <span className="text-xs text-gray-400 font-normal">(shown on homepage)</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { valKey: "whyus_stat1_val", labelKey: "whyus_stat1_label", color: "purple" },
              { valKey: "whyus_stat2_val", labelKey: "whyus_stat2_label", color: "blue" },
              { valKey: "whyus_stat3_val", labelKey: "whyus_stat3_label", color: "yellow" },
              { valKey: "whyus_stat4_val", labelKey: "whyus_stat4_label", color: "pink" },
            ].map((stat, i) => (
              <div key={stat.valKey} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-2xl font-black text-purple-600 mb-2">{values[stat.valKey] || "—"}</div>
                <div className="text-xs text-gray-500 mb-3">{values[stat.labelKey] || "—"}</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Value</label>
                    <input type="text" value={values[stat.valKey] || ""} onChange={e => setValues(p => ({ ...p, [stat.valKey]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm font-bold" placeholder="99%" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Label</label>
                    <input type="text" value={values[stat.labelKey] || ""} onChange={e => setValues(p => ({ ...p, [stat.labelKey]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm" placeholder="Satisfaction" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Us Bullet Points */}
          <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
            📋 Why Choose Us — 6 Bullet Points
          </h3>
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {[1,2,3,4,5,6].map(n => (
              <div key={n}>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Point {n}</label>
                <input type="text" value={values[`whyus_point${n}`] || ""} onChange={e => setValues(p => ({ ...p, [`whyus_point${n}`]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm" />
              </div>
            ))}
          </div>

          {/* Projects Page Stats */}
          <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
            🚀 Projects Page — 4 Stat Cards
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { valKey: "proj_stat1_val", labelKey: "proj_stat1_label" },
              { valKey: "proj_stat2_val", labelKey: "proj_stat2_label" },
              { valKey: "proj_stat3_val", labelKey: "proj_stat3_label" },
              { valKey: "proj_stat4_val", labelKey: "proj_stat4_label" },
            ].map((stat, i) => (
              <div key={stat.valKey} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-2xl font-black text-purple-600 mb-2">{values[stat.valKey] || "—"}</div>
                <div className="text-xs text-gray-500 mb-3">{values[stat.labelKey] || "—"}</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Value</label>
                    <input type="text" value={values[stat.valKey] || ""} onChange={e => setValues(p => ({ ...p, [stat.valKey]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Label</label>
                    <input type="text" value={values[stat.labelKey] || ""} onChange={e => setValues(p => ({ ...p, [stat.labelKey]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Group tabs */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {genericGroups.map(g => {
              const meta = groupLabels[g] || { icon: "⚙️", title: g };
              return (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-50 last:border-0 transition-colors ${activeGroup === g ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                  <span>{meta.icon}</span>
                  <span>{meta.title}</span>
                </button>
              );
            })}
            {/* Assets tab */}
            <button onClick={() => setActiveGroup("assets")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-50 last:border-0 transition-colors ${activeGroup === "assets" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
              <span>🖼️</span>
              <span>Site Images</span>
            </button>
          </div>
        </div>

        {/* Settings form — hidden when assets tab active */}
        {activeGroup !== "assets" && (
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">
                {groupLabels[activeGroup]?.icon} {groupLabels[activeGroup]?.title || activeGroup}
              </h2>
              <button onClick={() => handleSaveGroup(activeGroup)} disabled={saving[activeGroup]}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${saved[activeGroup] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}>
                {saving[activeGroup] ? "Saving…" : saved[activeGroup] ? "✓ All Saved" : "Save All"}
              </button>
            </div>

            <div className="p-6 space-y-6">
              {groupItems.map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{item.label}</label>

                  {item.type === "color" ? (
                    <div className="flex gap-3 items-center">
                      <div className="relative flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus-within:border-purple-500 transition-all bg-white">
                        <input
                          type="color"
                          value={values[item.key] || "#7c3aed"}
                          onChange={e => setValues(p => ({ ...p, [item.key]: e.target.value }))}
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={values[item.key] || ""}
                          onChange={e => setValues(p => ({ ...p, [item.key]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && handleSave(item.key)}
                          placeholder="#000000"
                          className="flex-1 text-sm focus:outline-none font-mono"
                        />
                        <div className="w-6 h-6 rounded-full border border-gray-200 shrink-0" style={{ background: values[item.key] || "#7c3aed" }} />
                      </div>
                      <button onClick={() => handleSave(item.key)} disabled={saving[item.key]}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${saved[item.key] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}>
                        {saving[item.key] ? "…" : saved[item.key] ? "✓" : "Save"}
                      </button>
                    </div>
                  ) : item.type === "toggle" ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newVal = values[item.key] === "true" ? "false" : "true";
                          setValues(p => ({ ...p, [item.key]: newVal }));
                          setTimeout(() => handleSave(item.key), 100);
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${values[item.key] === "true" ? "bg-purple-600" : "bg-gray-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${values[item.key] === "true" ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                      <span className="text-sm text-gray-600">{values[item.key] === "true" ? "Enabled" : "Disabled"}</span>
                    </div>
                  ) : item.type === "textarea" ? (
                    <div className="flex gap-3">
                      <textarea
                        value={values[item.key] || ""}
                        onChange={e => setValues(p => ({ ...p, [item.key]: e.target.value }))}
                        rows={3}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm resize-none transition-all"
                      />
                      <button onClick={() => handleSave(item.key)} disabled={saving[item.key]}
                        className={`px-4 py-2 rounded-xl text-sm font-bold self-start transition-colors ${saved[item.key] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}>
                        {saving[item.key] ? "…" : saved[item.key] ? "✓" : "Save"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type={item.type === "url" ? "url" : "text"}
                        value={values[item.key] || ""}
                        onChange={e => setValues(p => ({ ...p, [item.key]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleSave(item.key)}
                        placeholder={item.type === "url" ? "https://..." : ""}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm transition-all"
                      />
                      <button onClick={() => handleSave(item.key)} disabled={saving[item.key]}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${saved[item.key] ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-60`}>
                        {saving[item.key] ? "…" : saved[item.key] ? "✓" : "Save"}
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1 font-mono hidden">{item.key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Assets panel — shown when activeGroup === "assets" */}
        {activeGroup === "assets" && (
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">🖼️ Site Images</h2>
                <p className="text-xs text-gray-400 mt-1">Upload images to Cloudinary — changes reflect on the website immediately</p>
              </div>
              <div className="p-6 space-y-6">
                {assetFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{field.label}</label>
                    <p className="text-xs text-gray-400 mb-3">{field.hint}</p>
                    <div className="flex gap-4 items-start">
                      {/* Preview */}
                      <div className="w-32 h-20 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                        {assets[field.key] ? (
                          <img src={assets[field.key]} alt={field.label} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-300 text-2xl">🖼️</span>
                        )}
                      </div>
                      {/* Upload */}
                      <div className="flex-1">
                        <input
                          ref={el => { fileRefs.current[field.key] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleAssetUpload(field.key, file);
                          }}
                        />
                        <button
                          onClick={() => fileRefs.current[field.key]?.click()}
                          disabled={assetSaving[field.key]}
                          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 disabled:opacity-60 transition-colors"
                        >
                          {assetSaving[field.key] ? "Uploading…" : assets[field.key] ? "Replace Image" : "Upload Image"}
                        </button>
                        {assets[field.key] && (
                          <p className="text-xs text-green-600 mt-2 font-medium">✓ Stored in Cloudinary</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
