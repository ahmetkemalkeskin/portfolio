import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useMemo, useEffect } from "react";
import { R as Route } from "./router-BwW8mIE7.js";
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
function SkillsPage() {
  const {
    categories
  } = Route.useLoaderData();
  const ref = useRef(null);
  const flatCount = useMemo(() => categories.reduce((acc, c) => acc + (c.items?.length ?? 0), 0), [categories]);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    }), {
      threshold: 0.1
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [categories]);
  return /* @__PURE__ */ jsx("div", { ref, style: {
    minHeight: "100vh",
    padding: "5rem 1.5rem"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: "900px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "fade-in", style: {
      textAlign: "center",
      marginBottom: "4rem"
    }, children: [
      /* @__PURE__ */ jsx("p", { style: {
        color: "var(--accent-cyan)",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: "0.5rem"
      }, children: "Capabilities" }),
      /* @__PURE__ */ jsx("h1", { className: "section-title", children: "Skills" }),
      /* @__PURE__ */ jsxs("p", { className: "section-subtitle", children: [
        "Edit categories in Decap CMS → ",
        /* @__PURE__ */ jsx("code", { style: {
          color: "var(--accent-cyan)"
        }, children: "content/skills/" })
      ] })
    ] }),
    categories.map((cat, ci) => /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in", style: {
      padding: "1.2rem",
      marginBottom: ci < categories.length - 1 ? "1.25rem" : 0
    }, children: [
      /* @__PURE__ */ jsx("h2", { style: {
        margin: "0 0 1rem",
        fontSize: "1.05rem",
        color: "var(--accent-cyan)"
      }, children: cat.category }),
      (cat.items ?? []).map((skill, si) => /* @__PURE__ */ jsxs("div", { style: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "0.75rem",
        alignItems: "center",
        padding: "0.75rem",
        borderBottom: si < (cat.items?.length ?? 0) - 1 ? "1px solid var(--border-color)" : "none"
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontWeight: 500,
          color: "var(--text-primary)"
        }, children: skill.name }),
        /* @__PURE__ */ jsx("span", { className: "tag", children: skill.level })
      ] }, `${cat._meta.path}-${si}-${skill.name}`))
    ] }, cat._meta.path)),
    flatCount === 0 && /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      color: "var(--text-muted)",
      padding: "4rem"
    }, children: [
      "No skills in CMS yet. Add markdown under ",
      /* @__PURE__ */ jsx("code", { style: {
        color: "var(--accent-cyan)"
      }, children: "content/skills/" }),
      "."
    ] })
  ] }) });
}
export {
  SkillsPage as component
};
