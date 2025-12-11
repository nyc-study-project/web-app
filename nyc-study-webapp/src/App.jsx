import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useUser } from "./lib/useUser";
import { LogOut, User as UserIcon } from "lucide-react";

// Add to your imports at the top
import AuthCallback from "./pages/AuthCallback"; // Update path if you saved it elsewhere
import { COMPOSITE_BASE } from "./api/config";

import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Textarea } from "./components/ui/textarea";

import {
  Loader2,
  Globe,
  Link2,
  ShieldAlert,
  Server,
  Database as DbIcon,
  Sparkles,
} from "lucide-react";

import Spots from "./pages/Spots";
import SpotDetail from "./pages/SpotDetail";

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
      notes: "FastAPI on GCE VM + Cloud SQL MySQL",
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

  // ✅ Plain JS
  return [config, setConfig];
}


/* ----------------------------------------------------------
 ✅ Health Check Helpers
----------------------------------------------------------- */



function StatusPill({ status }) {

  if (status === "ok")
    return (
      <Badge className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Healthy
      </Badge>
    );
  if (status === "fail")
    return (
      <Badge className="inline-flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Unreachable
      </Badge>
    );
  return (
    <Badge variant="secondary" className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Unknown
    </Badge>
  );
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

function TopNav({ projectName, user }) {
  const linkBase =
    "text-sm px-2 py-1 rounded-full transition-colors hover:bg-slate-100";

  // const user = useUser();


  return (
    <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-sm">
            <Globe className="h-4 w-4" />
          </span>
          <span className="hidden text-sm text-slate-700 sm:inline">
            {projectName}
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-slate-900 text-white" : ""}`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/spots"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-slate-900 text-white" : ""}`
            }
          >
            Study Spots
          </NavLink>
          <NavLink
            to="/database"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-slate-900 text-white" : ""}`
            }
          >
            Database
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-slate-900 text-white" : ""}`
            }
          >
            About
          </NavLink>

          <NavLink to="/configure">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex">
              Configure
            </Button>
          </NavLink>
          {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-700">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-xs">
                  {user.name || user.username || user.email || "Logged in"}
                </span>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("session_id");
                    window.location.reload();
                  }}
                  className={`${linkBase} flex items-center gap-1 text-red-600`}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <a href={`${COMPOSITE_BASE}/auth/login/google`} className={linkBase}>
                Login with Google
              </a>
            )}

        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Home / Dashboard
----------------------------------------------------------- */

function Home({ config }) {
  const microserviceCount = config.microservices.length;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
        {/* Hero */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-sm">
            <Sparkles className="h-3 w-3 text-sky-500" />
            Sprint 2 · Distributed Microservices Demo
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Discover NYC study spots,
            <span className="block bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              powered by your cloud architecture.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This web application is the front door to our microservice ecosystem.
            Every interaction in the UI triggers live calls to our Cloud Run study-spots service, our GCE-hosted user
            service, the reviews microservice, and the composite gateway.
            Lets see the full flow from browser → composite gateway → atomic microservices → Cloud
            SQL / MySQL → back to UI in real time.

          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/spots">
              <Button className="shadow-sm">Browse study spots</Button>
            </Link>
            <Link to="/services">
              <Button variant="outline">View service health</Button>
            </Link>
          </div>
        </div>

        {/* Architecture summary card */}
        <Card className="border-none bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50 shadow-xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Architecture snapshot
                </p>
                <p className="mt-2 text-lg font-semibold">
                  NYC Study Spots — Cloud View
                </p>
              </div>
              <div className="rounded-2xl bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-200">
                COMS W4153 001 · Final Project
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-800/80 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Server className="h-3.5 w-3.5" />
                  Microservices
                </div>
                <p className="mt-2 text-2xl font-semibold">{microserviceCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Cloud Run + GCE VM + Composite gateway
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800/80 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <DbIcon className="h-3.5 w-3.5" />
                  Databases
                </div>
                <p className="mt-2 text-2xl font-semibold">2</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Cloud SQL Postgres &amp; MySQL backing services
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800/80 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Globe className="h-3.5 w-3.5" />
                  Frontend
                </div>
                <p className="mt-2 text-2xl font-semibold">1</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Static SPA on Cloud Storage with OAuth2
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800/70 p-3 text-[11px] leading-relaxed text-slate-300">
              User actions in the browser propagate through the Composite Gateway, which performs parallel fan-out
              to the spot, user, and reviews microservices.
              Each microservice reads/writes data in Cloud SQL (Postgres/MySQL) or the MySQL VM, and the
              aggregated result is returned to the UI.
            </div>
          </CardContent>
        </Card>
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
    <div className="mx-auto max-w-screen-2xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A live view of the microservices backing NYC Study Spots.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <StatusPill status="ok" />
          <span>·</span>
          <StatusPill status="fail" />
          <span>·</span>
          <StatusPill status="unknown" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {config.microservices.map((svc, idx) => (
          <Card
            key={idx}
            className="group h-full rounded-2xl border-slate-200 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                    <Server className="h-3 w-3" />
                    Microservice
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {svc.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {svc.notes}
                  </p>
                </div>
                <StatusPill status={statuses[idx].status} />
              </div>

              {/* Endpoint links */}
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                {svc.endpoints.map((e, i) => (
                  <a
                    key={i}
                    href={joinUrl(svc.baseUrl, e.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-xl border bg-white px-2 py-2 text-center font-medium text-slate-700 transition group-hover:border-sky-200 hover:bg-sky-50"
                  >
                    {e.label}
                  </a>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <Button
                  size="sm"
                  onClick={() => doPing(idx)}
                  disabled={loadingIndex === idx}
                  className="text-xs"
                >
                  {loadingIndex === idx ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check health"
                  )}
                </Button>

                <div className="flex flex-1 items-center gap-2 truncate text-[11px] text-muted-foreground">
                  <Link2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{svc.baseUrl}</span>
                  {statuses[idx].code && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">
                      {statuses[idx].code}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Database page
----------------------------------------------------------- */

function DatabasePage({ config }) {
  const db = config.database;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Database layer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How data flows between Cloud SQL, VM, and your microservices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
              <DbIcon className="h-4 w-4" />
              Cloud SQL
            </div>
            <p className="text-sm font-semibold">
              {db.vendor}
            </p>
            <p className="text-sm text-muted-foreground">{db.notes}</p>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Use this card to describe how Spot Management and User Management
              talk to different Cloud SQL instances during our demo.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
              <Server className="h-4 w-4" />
              VM & networking
            </div>
            <p className="text-sm font-semibold">GCE VM + private services</p>
            <p className="text-sm text-muted-foreground">
              {db.host}
            </p>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Call out service accounts, VPC connectors, and how your VM and
              Cloud Run services reach Cloud SQL securely.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Configure page
----------------------------------------------------------- */

function ConfigurePage({ config, setConfig }){
  const [draft, setDraft] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const save = () => {
    try {
      const next = JSON.parse(draft);
      setConfig(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError("");
      navigate("/services");
    } catch {
      setError("Invalid JSON — fix formatting first.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Configure</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the microservice base URLs and metadata used across the UI.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <Textarea
            rows={22}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="font-mono text-xs sm:text-sm bg-slate-950 text-slate-50 border-slate-800 rounded-xl"
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <ShieldAlert className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={save}>Save</Button>
            <Button
              variant="outline"
              onClick={() =>
                setDraft(JSON.stringify(defaultConfig, null, 2))
              }
            >
              Reset to default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Simple About / Not Found
----------------------------------------------------------- */

function AboutPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10">
      <Card className="rounded-2xl">
        <CardContent className="space-y-3 p-6">
          <h2 className="text-xl font-semibold mb-1">About</h2>
          <p className="text-sm text-muted-foreground">
            This app was built for COMS W4153 001 to demonstrate a
            microservice-based architecture on Google Cloud: Cloud Run, GCE VM,
            Cloud SQL, and a composite gateway, all surfaced through a single
            browser UI.
          </p>
          <p className="text-sm text-muted-foreground">
            Use it as a live storyboard in your final presentation: click
            through routes while explaining how requests move through your
            system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 text-sm text-muted-foreground">
      Page not found.
    </div>
  );
}

/* ----------------------------------------------------------
 ✅ Footer
----------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-10 border-t bg-white/60 py-6 text-center text-[11px] text-muted-foreground">
      © {new Date().getFullYear()} Study Spots · Final Project · Built on Google Cloud
    </footer>
  );
}

/* ----------------------------------------------------------
 ✅ Main Routing Shell
----------------------------------------------------------- */

function AppShell() {
  const [config, setConfig] = useConfig();
  const user = useUser();

  return (
    <HashRouter>
      <TopNav projectName={config.projectName} user={user} />

      <Routes>
        <Route path="/" element={<Home config={config} />} />
        <Route path="/services" element={<Services config={config} />} />
        <Route path="/database" element={<DatabasePage config={config} />} />
        <Route
          path="/configure"
          element={<ConfigurePage config={config} setConfig={setConfig} />}
        />
        <Route path="/spots" element={<Spots />} />
        <Route path="/spots/:id" element={<SpotDetail user={user} />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <AppShell />
    </div>
  );
}
