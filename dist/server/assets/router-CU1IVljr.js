import { useRouterState, Link, createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "../server.js";
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" }
];
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored !== "light";
    setDark(isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const isActive = (to) => to === "/" ? currentPath === "/" : currentPath.startsWith(to);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          transition: "background 0.3s ease, border-color 0.3s ease",
          background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none"
        },
        children: /* @__PURE__ */ jsx("div", { style: { maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", style: { textDecoration: "none" }, children: /* @__PURE__ */ jsx("span", { style: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            background: "linear-gradient(135deg, #00d4ff, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }, children: "AK.dev" }) }),
          /* @__PURE__ */ jsx("nav", { style: { display: "flex", alignItems: "center", gap: "2rem" }, className: "hidden-mobile", children: navLinks.map(({ to, label }) => /* @__PURE__ */ jsx(
            Link,
            {
              to,
              className: `nav-link${isActive(to) ? " active" : ""}`,
              children: label
            },
            to
          )) }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleTheme,
                title: dark ? "Switch to light mode" : "Switch to dark mode",
                style: {
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  fontSize: "1rem",
                  transition: "all 0.2s ease"
                },
                children: dark ? "☀️" : "🌙"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setMenuOpen(true),
                className: "show-mobile",
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  display: "none",
                  flexDirection: "column",
                  gap: "5px",
                  padding: "4px"
                },
                "aria-label": "Open menu",
                children: [
                  /* @__PURE__ */ jsx("span", { style: { display: "block", width: "22px", height: "2px", background: "currentColor", borderRadius: "2px" } }),
                  /* @__PURE__ */ jsx("span", { style: { display: "block", width: "22px", height: "2px", background: "currentColor", borderRadius: "2px" } }),
                  /* @__PURE__ */ jsx("span", { style: { display: "block", width: "14px", height: "2px", background: "currentColor", borderRadius: "2px" } })
                ]
              }
            )
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `mobile-menu${menuOpen ? " open" : ""}`, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMenuOpen(false),
          style: {
            position: "absolute",
            top: "1.25rem",
            right: "1.5rem",
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            fontSize: "1.5rem",
            cursor: "pointer"
          },
          "aria-label": "Close menu",
          children: "✕"
        }
      ),
      navLinks.map(({ to, label }) => /* @__PURE__ */ jsx(
        Link,
        {
          to,
          className: `nav-link${isActive(to) ? " active" : ""}`,
          onClick: () => setMenuOpen(false),
          children: label
        },
        to
      ))
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      ` })
  ] });
}
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `back-to-top${visible ? " visible" : ""}`,
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      "aria-label": "Back to top",
      children: "↑"
    }
  );
}
const Route$9 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ahmet Kemal Keskin — AK.dev" },
      { name: "description", content: "Portfolio of Ahmet Kemal Keskin: projects, skills, and contact details." },
      { name: "theme-color", content: "#0a0a0a" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Nav, {}),
      /* @__PURE__ */ jsx("main", { style: { paddingTop: "64px" }, children }),
      /* @__PURE__ */ jsx(BackToTop, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$8 = () => import("./works-Dcd9AFB5.js");
const Route$8 = createFileRoute("/works")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./skills-CrEtDkPV.js");
const Route$7 = createFileRoute("/skills")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./resume-BHTb6hq8.js");
const Route$6 = createFileRoute("/resume")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const $$splitComponentImporter$5 = () => import("./projects-DfTPVYvp.js");
const getProjectsData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6ce7ed10848c58e7a3195cec59648d3ebb1e3149c2e9e376844395d9dc2e8dcc"));
const Route$5 = createFileRoute("/projects")({
  loader: () => getProjectsData(),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./experience-svMBXfTu.js");
const getExperienceData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("0850288abaaf8cd9ce1d691cdb532a1830740c7c49fd42f77e60717d4b74ab35"));
const Route$4 = createFileRoute("/experience")({
  loader: () => getExperienceData(),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./contact-Dfhtbhq6.js");
const getContactData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("c9091b78a9b760de45715db1cc4443694157974684bac3bd1835bf1e1335e18c"));
const Route$3 = createFileRoute("/contact")({
  loader: () => getContactData(),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./about-C5xBYLPy.js");
const getAboutData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("fc10383af2b87974a109858b99bbb5f34ef6da7644fced3476f483b7a1a90953"));
const Route$2 = createFileRoute("/about")({
  loader: () => getAboutData(),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-OuFzc4tI.js");
const getHomeData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("e5d3f5d948391b170b648653d55968324eb90a864ee693154a5ada87efb58755"));
const Route$1 = createFileRoute("/")({
  loader: () => getHomeData(),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./_slug-C1OVWxfu.js");
const Route = createFileRoute("/blog/$slug")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WorksRoute = Route$8.update({
  id: "/works",
  path: "/works",
  getParentRoute: () => Route$9
});
const SkillsRoute = Route$7.update({
  id: "/skills",
  path: "/skills",
  getParentRoute: () => Route$9
});
const ResumeRoute = Route$6.update({
  id: "/resume",
  path: "/resume",
  getParentRoute: () => Route$9
});
const ProjectsRoute = Route$5.update({
  id: "/projects",
  path: "/projects",
  getParentRoute: () => Route$9
});
const ExperienceRoute = Route$4.update({
  id: "/experience",
  path: "/experience",
  getParentRoute: () => Route$9
});
const ContactRoute = Route$3.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$9
});
const AboutRoute = Route$2.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const BlogSlugRoute = Route.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ContactRoute,
  ExperienceRoute,
  ProjectsRoute,
  ResumeRoute,
  SkillsRoute,
  WorksRoute,
  BlogSlugRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$5 as R,
  Route$4 as a,
  Route$3 as b,
  Route$2 as c,
  Route$1 as d,
  Route as e,
  router as r
};
