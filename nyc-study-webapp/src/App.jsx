import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { Loader2, Globe, Server, Database as DbIcon, Cloud, Link2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

/* ----------------------- Sprint 1 Placeholder Web App ---------------------- */

const STORAGE_KEY = "sprint1_webapp_config_v1";

// Update baseUrls in-app via the Configure page; these are just defaults.
const defaultConfig = {
  projectName: "Study Spots – Sprint 1",
  microservices: [
    {
      name: "Flask Service (port 80)",
      baseUrl: "http://34.139.134.144",        
      notes: "Landing page + MySQL-backed endpoints.",
      apiDocsUrl: "",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/items (MySQL)", path: "/items" },
        { label: "/students", path: "/students" },
        { label: "/counts", path: "/counts" },
      ],
    },
    {
      name: "User Management (FastAPI, port 8002)",
      baseUrl: "http://34.139.134.144:8002",
      notes: "Auth, users, preferences API with Swagger docs.",
      apiDocsUrl: "http://34.139.134.144:8002/docs",
      endpoints: [
        { label: "Docs (Swagger)", path: "/docs" },
        { label: "OpenAPI JSON", path: "/openapi.json" },
        { label: "/health", path: "/health" },
        { label: "Back to Home", path: "/" },
      ],
    },
    {
      name: "Reviews & Ratings (Swagger-first, port 8003)",
      baseUrl: "/reviews",
      notes: "Defined with Swagger; implement later.",
      apiDocsUrl: "/reviews/docs#/",          // optional top link (keeps it simple)
      endpoints: [
        { label: "Docs (Swagger)", path: "/docs#/" },  // <— RELATIVE path
        { label: "/health",         path: "/health" },
        { label: "OpenAPI JSON", path: "/openapi.json"},
        { label: "Back to Home", path: "/"}
      ],
    },
  ],
  database: {
    vendor: "MySQL",
    host: "34.139.134.144",                     
    port: 3306,
    dbName: "sprint1",
    notes: "Deployed on VM; reachable from service VM",
  },
};

function useConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);
  return [config, setConfig];
}

function StatusPill({ status }) {
  if (status === "ok") return <Badge className="bg-green-600 hover:bg-green-600">Healthy</Badge>;
  if (status === "fail") return <Badge variant="destructive">Unreachable</Badge>;
  if (status === "unknown") return <Badge variant="secondary">Unknown</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

function joinUrl(base, path = "") {
  if (!base) return path || "/";
  return `${base.replace(/\/+$/, "")}${path && !path.startsWith("/") ? `/${path}` : path}`;
}

async function pingHealth(baseUrl) {
  if (!baseUrl) return { status: "fail", code: "-", msg: "No baseUrl set" };
  const url = joinUrl(baseUrl, "/health");
  try {
    const res = await fetch(url, { method: "GET" });
    const ok = res.ok;
    return { status: ok ? "ok" : "fail", code: res.status, msg: ok ? "OK" : `HTTP ${res.status}` };
  } catch (e) {
    return { status: "fail", code: "ERR", msg: "Network error" };
  }
}

/* --------------------------------- Layout --------------------------------- */

function TopNav({ projectName }) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span className="font-semibold">{projectName}</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link className="text-sm hover:underline" to="/services">Services</Link>
          <Link className="text-sm hover:underline" to="/database">Database</Link>
          <Link className="text-sm hover:underline" to="/about">About</Link>
          <Link to="/configure"><Button size="sm" variant="outline">Configure</Button></Link>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-screen-2xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Spots – Service Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Explore the Flask and FastAPI services running on the VM.</p>
          <div className="mt-4 flex gap-3">
            <Link to="/services"><Button><Server className="w-4 h-4 mr-2" />View Services</Button></Link>
            <Link to="/configure"><Button variant="outline">Configure</Button></Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <Stat icon={<Server className="w-5 h-5" />} label="3 Microservices" />
                <Stat icon={<Cloud className="w-5 h-5" />} label="1 Service on VM" />
                <Stat icon={<DbIcon className="w-5 h-5" />} label="MySQL on VM" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label }) {
  return (
    <div className="p-3 rounded-xl border bg-white">
      {icon}
      <p className="mt-2 text-sm">{label}</p>
    </div>
  );
}

/* --------------------------------- Pages ---------------------------------- */

function Services({ config }) {
  const [statuses, setStatuses] = useState(config.microservices.map(() => ({ status: "unknown", code: null, msg: "" })));
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const doPing = async (idx) => {
    setLoadingIndex(idx);
    const res = await pingHealth(config.microservices[idx].baseUrl);
    setStatuses((prev) => prev.map((s, i) => (i === idx ? res : s)));
    setLoadingIndex(-1);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold">Services</h2>
      <p className="text-muted-foreground mt-1 mb-4">Set base URLs in <em>Configure</em>, then ping <code>/health</code>.</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {config.microservices.map((svc, idx) => (
          <Card key={idx} className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{svc.name}</div>
                <StatusPill status={statuses[idx].status} />
              </div>

              <p className="text-sm text-muted-foreground">{svc.notes}</p>

              {/* Endpoint buttons */}
              {Array.isArray(svc.endpoints) && svc.endpoints.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {svc.endpoints.map((e, i) => (
                    <EndpointButton key={i} baseUrl={svc.baseUrl} path={e.path} label={e.label} />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => doPing(idx)} disabled={!svc.baseUrl || loadingIndex === idx}>
                  {loadingIndex === idx ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Checking…</>) : (<>Check Health</>)}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {statuses[idx].status === "ok"
                    ? (svc.name.toLowerCase().includes("flask") ? "Flask responded OK" :
                      svc.name.toLowerCase().includes("fastapi") ? "FastAPI docs reachable" : "OK")
                    : statuses[idx].msg || ""}
                </span>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                <span className="truncate" title={svc.baseUrl}>{svc.baseUrl || "(not set)"}</span>
                <span>• last code: {String(statuses[idx].code ?? "-")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EndpointButton({ baseUrl, path, label }) {
  const href = joinUrl(baseUrl || "", path || "/");
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <div className="w-full rounded-xl border bg-white text-slate-800 text-sm px-3 py-2 text-center hover:bg-slate-50">
        {label}
      </div>
    </a>
  );
}

function DatabasePage({ config }) {
  const db = config.database;
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2"><DbIcon className="w-5 h-5" />Database</h2>
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Vendor" value={db.vendor} />
            <Field label="Host" value={`${db.host}:${db.port}`} />
            <Field label="Database" value={db.dbName} />
            <Field label="Notes" value={db.notes} />
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Tip: Add a simple <code>/db/health</code> endpoint in a service to proxy a DB ping.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-muted-foreground">{value}</div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">About this Placeholder</h2>
      <p className="text-muted-foreground">
        Minimal routes, health checks, and configuration to satisfy Sprint-1. Replace stubs with real UI in later sprints.
      </p>
      <Tabs defaultValue="stack" className="w-full">
        <TabsList>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="stack" className="text-sm text-muted-foreground">
          React + Vite • Tailwind • shadcn/ui • lucide-react • framer-motion • react-router
        </TabsContent>
        <TabsContent value="notes" className="text-sm text-muted-foreground">
          Config is saved in <code>localStorage</code>. Health checks call <code>GET /health</code>.
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConfigurePage({ config, setConfig }) {
  const [draft, setDraft] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const save = () => {
    try {
      const next = JSON.parse(draft);
      setConfig(next);
      setError("");
      navigate("/services");
    } catch {
      setError("Invalid JSON. Please fix and try again.");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">Configure</h2>
      <p className="text-muted-foreground text-sm">
        Update service base URLs, API docs, and DB details. Stored locally in your browser.
      </p>
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <Textarea rows={18} value={draft} onChange={(e) => setDraft(e.target.value)} className="font-mono text-sm" />
          {error && (
            <div className="text-sm text-red-600 flex items-center gap-2"><ShieldAlert className="w-4 h-4" />{error}</div>
          )}
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setDraft(JSON.stringify(config, null, 2))}>Reset</Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-muted-foreground">
        Use full URLs like <code>http://&lt;vm-ip&gt;</code> or <code>http://&lt;vm-ip&gt;:8002</code>. For API docs, paste Swagger/ReDoc URLs.
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-10 border-t">
      <div className="max-w-screen-2xl mx-auto px-4 py-6 text-xs text-muted-foreground flex flex-wrap gap-3 items-center">
        <span>© {new Date().getFullYear()} Study Spots · VM</span>
      </div>
    </div>
  );
}

function AppShell() {
  const [config, setConfig] = useConfig();
  return (
    <BrowserRouter>
      <TopNav projectName={config.projectName} />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/services" element={<Services config={config} />} />
        <Route path="/database" element={<DatabasePage config={config} />} />
        <Route path="/configure" element={<ConfigurePage config={config} setConfig={setConfig} />} />
        <Route
          path="/about"
          element={<AboutPage />}
        />
        <Route
          path="*"
          element={
            <div className="max-w-screen-2xl mx-auto px-4 py-10 text-sm text-muted-foreground">
              Page not found.
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <AppShell />
    </div>
  );
}
