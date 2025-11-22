import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";

import {
  Loader2,
  Globe,
  Server,
  Database as DbIcon,
  Cloud,
  Link2,
  ShieldAlert,
} from "lucide-react";

import { motion } from "framer-motion";

import Spots from "./pages/Spots";
import SpotDetail from "./pages/SpotDetail";

const STORAGE_KEY = "sprint1_webapp_config_v1";

/* ------------------------------------------------------------------
   NEW PUBLIC CLOUD RUN + VM CONFIG  (Sprint 2)
------------------------------------------------------------------- */

const defaultConfig = {
  projectName: "Study Spots – Sprint 2",

  microservices: [
    {
      name: "Spot Management (Cloud Run)",
      baseUrl: "https://spot-management-642518168067.us-east1.run.app",
      notes: "Cloud Run + Cloud SQL Postgres",
      apiDocsUrl:
        "https://spot-management-642518168067.us-east1.run.app/docs",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/studyspots", path: "/studyspots" },
      ],
    },
    {
      name: "User Management (FastAPI, VM)",
      baseUrl: "http://34.139.134.144:8002",
      notes: "FastAPI running on GCE VM + Cloud SQL MySQL",
      apiDocsUrl: "http://34.139.134.144:8002/docs",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/docs", path: "/docs" },
      ],
    },
    {
      name: "Reviews API (Cloud Run)",
      baseUrl: "https://reviews-api-c73xxvyjwq-ue.a.run.app",
      notes: "Reviews microservice on Cloud Run",
      apiDocsUrl: "",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/reviews/{id}", path: "/reviews" },
      ],
    },
  ],

  database: {
    vendor: "Cloud SQL (Postgres + MySQL)",
    host: "Managed by Cloud Run / VM",
    port: "",
    dbName: "",
    notes: "Different DB per service (Postgres for spots, MySQL for users)",
  },
};

/* ------------------------------------------------------------------
   LocalStorage Config Handling
------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------
   Utility Functions
------------------------------------------------------------------- */

function StatusPill({ status }) {
  if (status === "ok")
    return (
      <Badge className="bg-green-600 hover:bg-green-600">Healthy</Badge>
    );
  if (status === "fail") return <Badge variant="destructive">Unreachable</Badge>;
  if (status === "unknown")
    return <Badge variant="secondary">Unknown</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

function joinUrl(base, path = "") {
  if (!base) return path || "/";
  return `${base.replace(/\/+$/, "")}${
    path && !path.startsWith("/") ? `/${path}` : path
  }`;
}

async function pingHealth(baseUrl) {
  if (!baseUrl) return { status: "fail", code: "-", msg: "No baseUrl set" };
  const url = joinUrl(baseUrl, "/health");

  try {
    const res = await fetch(url, { method: "GET" });
    const ok = res.ok;

    return {
      status: ok ? "ok" : "fail",
      code: res.status,
      msg: ok ? "OK" : `HTTP ${res.status}`,
    };
  } catch {
    return { status: "fail", code: "ERR", msg: "Network error" };
  }
}

/* ------------------------------------------------------------------
   Layout Components
------------------------------------------------------------------- */

function TopNav({ projectName }) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span className="font-semibold">{projectName}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link className="text-sm hover:underline" to="/services">
            Services
          </Link>
          <Link className="text-sm hover:underline" to="/database">
            Database
          </Link>
          <Link className="text-sm hover:underline" to="/spots">
            Study Spots
          </Link>
          <Link className="text-sm hover:underline" to="/about">
            About
          </Link>

          <Link to="/configure">
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Services Dashboard Page
------------------------------------------------------------------- */

function Services({ config }) {
  const [statuses, setStatuses] = useState(
    config.microservices.map(() => ({ status: "unknown", code: null, msg: "" }))
  );
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const doPing = async (idx) => {
    setLoadingIndex(idx);
    const res = await pingHealth(config.microservices[idx].baseUrl);

    setStatuses((prev) =>
      prev.map((s, i) => (i === idx ? res : s))
    );

    setLoadingIndex(-1);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold">Services</h2>
      <p className="text-muted-foreground mt-1 mb-4">
        Set base URLs in <em>Configure</em>, then ping <code>/health</code>.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {config.microservices.map((svc, idx) => (
          <Card key={idx} className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{svc.name}</div>
                <StatusPill status={statuses[idx].status} />
              </div>

              <p className="text-sm text-muted-foreground">{svc.notes}</p>

              {Array.isArray(svc.endpoints) && (
                <div className="grid grid-cols-2 gap-3">
                  {svc.endpoints.map((e, i) => (
                    <a
                      key={i}
                      href={joinUrl(svc.baseUrl, e.path)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="w-full text-center border rounded-lg py-2 text-sm bg-white hover:bg-gray-50">
                        {e.label}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => doPing(idx)}
                  disabled={!svc.baseUrl || loadingIndex === idx}
                >
                  {loadingIndex === idx ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking…
                    </>
                  ) : (
                    "Check Health"
                  )}
                </Button>

                <span className="text-xs text-muted-foreground">
                  {statuses[idx].msg}
                </span>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                <Link2 className="w-4 h-4" />
                {svc.baseUrl}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Database Page
------------------------------------------------------------------- */

function DatabasePage({ config }) {
  const db = config.database;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <DbIcon className="w-5 h-5" /> Database
      </h2>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Vendor" value={db.vendor} />
            <Field label="Host" value={db.host} />
            <Field label="Notes" value={db.notes} />
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

/* ------------------------------------------------------------------
   Configure Page
------------------------------------------------------------------- */

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
      setError("Invalid JSON. Please fix errors.");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">Configure</h2>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <Textarea
            rows={20}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="font-mono text-sm"
          />

          {error && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button
              variant="outline"
              onClick={() =>
                setDraft(JSON.stringify(defaultConfig, null, 2))
              }
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------
   Footer
------------------------------------------------------------------- */

function Footer() {
  return (
    <div className="mt-10 border-t">
      <div className="max-w-screen-2xl mx-auto px-4 py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Study Spots · Sprint 2
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   AppShell (Router)
------------------------------------------------------------------- */

function AppShell() {
  const [config, setConfig] = useConfig();

  return (
    <BrowserRouter>
      <TopNav projectName={config.projectName} />

      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-screen-2xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Study Spots Dashboard</h1>
              <p className="text-sm mt-2 text-muted-foreground">
                Sprint-2 UI using Cloud Run services
              </p>
            </div>
          }
        />

        <Route path="/services" element={<Services config={config} />} />
        <Route path="/database" element={<DatabasePage config={config} />} />
        <Route
          path="/configure"
          element={<ConfigurePage config={config} setConfig={setConfig} />}
        />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/spots" element={<Spots />} />
        <Route path="/spots/:id" element={<SpotDetail />} />

        <Route
          path="*"
          element={
            <div className="max-w-screen-2xl mx-auto px-4 py-10">
              Page not found.
            </div>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

function AboutPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">About</h2>
      <p className="text-muted-foreground text-sm">
        This application connects to Cloud Run microservices for study
        spot management, reviews, and user accounts.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Export Default
------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <AppShell />
    </div>
  );
}
