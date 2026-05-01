import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { u as useEditMode } from "./useEditMode-D4mVJXwr.js";
import { a as Route } from "./router-CU1IVljr.js";
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
const STORAGE_KEY = "portfolio.experience";
function ExperiencePage() {
  const {
    entries
  } = Route.useLoaderData();
  const {
    isEditMode
  } = useEditMode();
  const initialEntries = entries.map((entry, index) => ({
    id: `exp-${index}-${entry._meta.path}`,
    date: entry.date,
    title: entry.title,
    company: entry.company ?? "",
    description: entry.description ?? "",
    image: entry.image
  }));
  const [items, setItems] = useState(initialEntries);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    id: "",
    date: "",
    title: "",
    company: "",
    description: "",
    image: ""
  });
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries2) => entries2.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), {
      threshold: 0.15
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, showAdd]);
  const addItem = () => {
    if (!newItem.title.trim() || !newItem.date.trim()) return;
    setItems((prev) => [...prev, {
      id: `exp-${Date.now()}`,
      title: newItem.title.trim(),
      date: newItem.date.trim(),
      company: newItem.company?.trim(),
      description: newItem.description?.trim(),
      image: newItem.image?.trim()
    }]);
    setNewItem({
      id: "",
      date: "",
      title: "",
      company: "",
      description: "",
      image: ""
    });
    setShowAdd(false);
  };
  return /* @__PURE__ */ jsxs("div", { ref, style: {
    minHeight: "100vh",
    padding: "5rem 1.5rem"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
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
        /* @__PURE__ */ jsx("p", { className: "section-subtitle", children: "Editable timeline entries in English" }),
        isEditMode && /* @__PURE__ */ jsx("button", { type: "button", className: "btn-primary", onClick: () => setShowAdd(true), children: "+ Add Experience" })
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
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            gap: "0.5rem",
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ jsx("span", { className: "tag", children: entry.date }),
            isEditMode && /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", style: {
              width: "30px",
              height: "30px",
              padding: 0,
              justifyContent: "center"
            }, onClick: () => setItems((prev) => prev.filter((item) => item.id !== entry.id)), children: "X" })
          ] })
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
      items.length === 0 && /* @__PURE__ */ jsx("div", { style: {
        textAlign: "center",
        color: "var(--text-muted)",
        padding: "2rem 0 1rem"
      }, children: "No experience entries yet." })
    ] }),
    isEditMode && showAdd && /* @__PURE__ */ jsx("div", { className: "lightbox-overlay", onClick: (e) => e.target === e.currentTarget && setShowAdd(false), children: /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
      width: "100%",
      maxWidth: "700px",
      padding: "1rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.75rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: {
          margin: 0
        }, children: "Add Experience" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", style: {
          width: "34px",
          height: "34px",
          padding: 0,
          justifyContent: "center"
        }, onClick: () => setShowAdd(false), children: "X" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "grid",
        gap: "0.75rem"
      }, children: [
        /* @__PURE__ */ jsx("input", { className: "form-input", placeholder: "Date (e.g. 2024 - Present)", value: newItem.date, onChange: (e) => setNewItem((p) => ({
          ...p,
          date: e.target.value
        })) }),
        /* @__PURE__ */ jsx("input", { className: "form-input", placeholder: "Role title", value: newItem.title, onChange: (e) => setNewItem((p) => ({
          ...p,
          title: e.target.value
        })) }),
        /* @__PURE__ */ jsx("input", { className: "form-input", placeholder: "Company (optional)", value: newItem.company, onChange: (e) => setNewItem((p) => ({
          ...p,
          company: e.target.value
        })) }),
        /* @__PURE__ */ jsx("textarea", { className: "form-input", placeholder: "Description (optional)", rows: 3, value: newItem.description, onChange: (e) => setNewItem((p) => ({
          ...p,
          description: e.target.value
        })) }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: "0.75rem"
        }, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn-primary", onClick: addItem, children: "Add" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", onClick: () => setShowAdd(false), children: "Cancel" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ExperiencePage as component
};
