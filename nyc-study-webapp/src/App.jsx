import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Textarea } from "./components/ui/textarea";

import {
  Loader2,
  Globe,
  Link2,
  ShieldAlert,
} from "lucide-react";

import Spots from "./pages/Spots";
import SpotDetail from "./pages/SpotDetail";

import AuthCallback from "./pages/AuthCallback";


const STORAGE_KEY = "sprint1_webapp_config_v1";

/* ----------------------------------------------------------
 ✅ PUBLIC CLOUD SERVICE CONFIG — SPRINT 2
----------------------------------------------------------- */

const defaultConfig = {
  projectName: "NYC Study Spots – Sprint 2",

  microservices: [
    {
      name: "Spot Management (Cloud Run)",
      baseUrl: "https://spot-management-642518168067.us-east1.run.app",
      notes: "Cloud Run + Cloud SQL Postgres",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/studyspots", path: "/studyspots" },
      ],
    },
    {
      name: "User Management (FastAPI, VM)",
      baseUrl: "http://34.139.134.144:8002",
      notes: "FastAPI running on GCE VM + Cloud SQL MySQL",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/docs", path: "/docs" },
      ],
    },
    {
      name: "Reviews API (Cloud Run)",
      baseUrl: "https://reviews-api-c73xxvyjwq-ue.a.run.app",
      notes: "Swagger-first reviews service on Cloud Run",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/reviews/{id}", path: "/reviews" },
      ],
    },
    {
      name: "Composite Gateway (Cloud Run)",
      baseUrl: "https://composite-gateway-642518168067.us-east1.run.app",
      notes: "Aggregates data across microservices",
      endpoints: [
        { label: "/health", path: "/health" },
        { label: "/spots/overview", path: "/spots/overview" },
      ],
    },
  ],

  database: {
    vendor: "Cloud SQL (Postgres & MySQL)",
    host: "Managed via Cloud Run & VM",
    notes:
      "Spot Management uses Postgres; User Service uses MySQL; Reviews TBD",
  },
};

/* ----------------------------------------------------------
 ✅ Persist config in browser
----------------------------------------------------------- */

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

/* ----------------------------------------------------------
 ✅ Health Check Helpers
----------------------------------------------------------- */

function StatusPill({ status }) {
  if (status === "ok")
    return (
      <Badge className="bg-green-600 hover:bg-green-600">Healthy</Badge>
    );
  if (status === "fail")
    return <Badge variant="destructive">Unreachable</Badge>;
  return <Badge variant="secondary">Unknown</Badge>;
}

function joinUrl(base, path = "") {
  return `${base.replace(/\/+$/, "")}${
    path && !path.startsWith("/") ? `/${path}` : path
  }`;
}

async function pingHealth(baseUrl) {
  try {
    const res = await fetch(joinUrl(baseUrl, "/health"));
    return { status: res.ok ? "ok" : "fail", code: res.status };
  } catch {
    return { status: "fail", code: "ERR" };
  }
}

/* ----------------------------------------------------------
 ✅ Layout — Navigation
----------------------------------------------------------- */

function TopNav({ projectName }) {
  const sessionId = localStorage.getItem("session_id");

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur border-b z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex justify-between">
        <Link to="/" className="flex gap-2 font-semibold items-center">
          <Globe className="w-5 h-5" />
          {projectName}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/services" className="hover:underline">
            Services
          </Link>
          <Link to="/spots" className="hover:underline">
            Study Spots
          </Link>
          <Link to="/database" className="hover:underline">
            Database
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>

          <Link to="/configure">
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </Link>

          {!sessionId && (
            <button
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_USER_MANAGEMENT_BASE}/auth/login/google`)
              }
              className="px-2 py-1 rounded bg-blue-500 text-white"
            >
              Login
            </button>
          )}

          {sessionId && (
            <button
              onClick={() => {
                localStorage.removeItem("session_id");
                window.location.reload();
              }}
              className="px-2 py-1 rounded bg-gray-400 text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ----------------------------------------------------------
 ✅ Services Dashboard Page UI
----------------------------------------------------------- */

function Services({ config }) {
  const [statuses, setStatuses] = useState(
    config.microservices.map(() => ({ status: "unknown", code: "" }))
  );
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const doPing = async (idx) => {
    setLoadingIndex(idx);
    const result = await pingHealth(config.microservices[idx].baseUrl);
    setStatuses((prev) =>
      prev.map((s, i) => (i === idx ? result : s))
    );
    setLoadingIndex(-1);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold">Services</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {config.microservices.map((svc, idx) => (
          <Card key={idx} className="rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{svc.name}</span>
                <StatusPill status={statuses[idx].status} />
              </div>

              <p className="text-sm text-muted-foreground">{svc.notes}</p>

              {/* Endpoint links */}
              <div className="grid grid-cols-2 gap-2">
                {svc.endpoints.map((e, i) => (
                  <a
                    key={i}
                    href={joinUrl(svc.baseUrl, e.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-lg py-2 text-center text-sm hover:bg-gray-50"
                  >
                    {e.label}
                  </a>
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => doPing(idx)}
                disabled={loadingIndex === idx}
              >
                {loadingIndex === idx ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Health"
                )}
              </Button>

              <div className="flex gap-2 text-xs text-muted-foreground items-center truncate">
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

/* ----------------------------------------------------------
 ✅ Database placeholder page
----------------------------------------------------------- */

function DatabasePage({ config }) {
  const db = config.database;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold">Database</h2>
      <p className="text-sm text-muted-foreground mt-2">
        {db.vendor} — {db.notes}
      </p>
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Configure page
----------------------------------------------------------- */

function ConfigurePage({ config, setConfig }) {
  const [draft, setDraft] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const save = () => {
    try {
      const next = JSON.parse(draft);
      setConfig(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      navigate("/services");
    } catch {
      setError("Invalid JSON — fix formatting first.");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-xl font-semibold">Configure</h2>

      <Textarea
        rows={22}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="font-mono text-sm"
      />

      {error && (
        <div className="text-sm text-red-600 flex gap-2 items-center">
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
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Footer
----------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t mt-10 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Study Spots · Sprint 2
    </footer>
  );
}

/* ----------------------------------------------------------
 ✅ Main Routing Shell
----------------------------------------------------------- */

function AppShell() {
  const [config, setConfig] = useConfig();

  return (
    <HashRouter>
      <TopNav projectName={config.projectName} />

      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-screen-2xl mx-auto px-4 py-10">
              <h1 className="text-3xl font-bold">Welcome to Study Spots</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore NYC campus study spaces — powered by distributed
                microservices.
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
        <Route path="/spots" element={<Spots />} />
        <Route path="/spots/:id" element={<SpotDetail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/about"
          element={
            <div className="max-w-screen-2xl mx-auto px-4 py-10">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-muted-foreground">
                Built in Sprint 2 of COMS 6998 — demonstrating Cloud Run,
                GCE VM, API integration, and a composite gateway.
              </p>
            </div>
          }
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
    </HashRouter>
  );
}

/* ----------------------------------------------------------
 ✅ Export Root Component
----------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <AppShell />
    </div>
  );
}
