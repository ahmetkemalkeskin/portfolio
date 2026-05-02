import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useMemo, useEffect } from "react";
import { b as Route } from "./router-BwW8mIE7.js";
import "@tanstack/react-router";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
function ExperiencePage() {
  const {
    entries
  } = Route.useLoaderData();
  const ref = useRef(null);
  const items = useMemo(() => entries.map((entry, index) => ({
    id: `exp-${index}-${entry._meta.path}`,
    date: entry.date,
    title: entry.title,
    company: entry.company ?? "",
    description: entry.description ?? "",
    image: entry.image
  })), [entries]);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((observerEntries) => observerEntries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), {
      threshold: 0.15
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return /* @__PURE__ */ jsx("div", { ref, style: {
    minHeight: "100vh",
    padding: "5rem 1.5rem"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: "820px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "fade-in", style: {
      textAlign: "center",
      marginBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsx("p", { style: {
        color: "var(--accent-cyan)",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: "0.5rem"
      }, children: "Career" }),
      /* @__PURE__ */ jsx("h1", { className: "section-title", children: "Experience" }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle", children: "Timeline from CMS (commit + deploy updates for everyone)" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }, children: items.map((entry, i) => /* @__PURE__ */ jsxs("div", { className: `glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`, style: {
      padding: "1.2rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        gap: "0.5rem",
        alignItems: "start",
        marginBottom: "0.4rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: {
          margin: 0,
          fontSize: "1.05rem"
        }, children: entry.title }),
        /* @__PURE__ */ jsx("span", { className: "tag", children: entry.date })
      ] }),
      entry.company && /* @__PURE__ */ jsx("p", { style: {
        marginTop: 0,
        marginBottom: "0.4rem",
        color: "var(--accent-cyan)",
        fontSize: "0.9rem"
      }, children: entry.company }),
      entry.description && /* @__PURE__ */ jsx("p", { style: {
        margin: 0,
        fontSize: "0.9rem"
      }, children: entry.description })
    ] }, entry.id)) }),
    items.length === 0 && /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      color: "var(--text-muted)",
      padding: "2rem 0 1rem"
    }, children: [
      "No experience entries yet. Add Markdown files under ",
      /* @__PURE__ */ jsx("code", { style: {
        color: "var(--accent-cyan)"
      }, children: "content/experience/" }),
      "."
    ] })
  ] }) });
}
export {
  ExperiencePage as component
};
