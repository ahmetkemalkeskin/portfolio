import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState, useMemo, useEffect } from "react";
import { u as useEditMode } from "./useEditMode-D4mVJXwr.js";
import { c as Route } from "./router-CwsCXQi1.js";
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
const SOCIAL_STORAGE = "portfolio.socials";
const ABOUT_STORAGE = "portfolio.about.editable";
const SOCIAL_DEFAULTS = [{
  key: "github",
  label: "GitHub",
  icon: "GH",
  url: "https://github.com/"
}, {
  key: "linkedin",
  label: "LinkedIn",
  icon: "in",
  url: "https://linkedin.com/"
}, {
  key: "behance",
  label: "Behance",
  icon: "Be",
  url: "https://behance.net/"
}];
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
function compressImage(file, maxWidth, quality = 0.74) {
  return new Promise(async (resolve, reject) => {
    try {
      const source = await fileToBase64(file);
      const img = new Image();
      img.onload = () => {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Image decode failed"));
      img.src = source;
    } catch (error) {
      reject(error);
    }
  });
}
function AboutPage() {
  const {
    about
  } = Route.useLoaderData();
  const {
    isEditMode
  } = useEditMode();
  const ref = useRef(null);
  const [socials, setSocials] = useState(SOCIAL_DEFAULTS);
  const defaultAbout = useMemo(() => ({
    profileImage: about?.profileImage ?? "",
    title: about?.title ?? "3D Artist & Game Developer",
    bio: about?.bio ?? "Passionate 3D artist and game developer creating immersive worlds, game environments, and visual storytelling experiences with Blender and Unity.",
    infoRows: [{
      id: "name",
      label: "Name",
      value: about?.name ?? "Ahmet Kemal Keskin"
    }, {
      id: "email",
      label: "Email",
      value: about?.email ?? "ahmetkemal608@gmail.com"
    }, {
      id: "location",
      label: "Location",
      value: about?.location ?? "Turkey"
    }, {
      id: "languages",
      label: "Languages",
      value: "Turkish, English"
    }],
    stats: [{
      id: "s1",
      value: "1+",
      label: "Years of Experience"
    }, {
      id: "s2",
      value: "5+",
      label: "Completed Projects"
    }, {
      id: "s3",
      value: "8+",
      label: "Tools Used"
    }, {
      id: "s4",
      value: "100%",
      label: "Passion"
    }]
  }), [about]);
  const [aboutState, setAboutState] = useState(defaultAbout);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const rawSocials = localStorage.getItem(SOCIAL_STORAGE);
      if (rawSocials) {
        const parsed = JSON.parse(rawSocials);
        if (Array.isArray(parsed)) setSocials(parsed);
      }
      const rawAbout = localStorage.getItem(ABOUT_STORAGE);
      if (rawAbout) {
        const parsed = JSON.parse(rawAbout);
        if (parsed && Array.isArray(parsed.infoRows) && Array.isArray(parsed.stats)) {
          setAboutState(parsed);
        }
      }
    } catch {
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SOCIAL_STORAGE, JSON.stringify(socials));
      localStorage.setItem(ABOUT_STORAGE, JSON.stringify(aboutState));
    } catch {
      window.alert("Could not save about data: local storage is full.");
    }
  }, [socials, aboutState, hydrated]);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), {
      threshold: 0.1
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const editSocial = (key) => {
    const current = socials.find((entry) => entry.key === key);
    const next = window.prompt(`Update ${current?.label} URL:`, current?.url ?? "");
    if (!next) return;
    setSocials((prev) => prev.map((entry) => entry.key === key ? {
      ...entry,
      url: next.trim()
    } : entry));
  };
  const editInfoRow = (id) => {
    const row = aboutState.infoRows.find((item) => item.id === id);
    if (!row) return;
    const nextLabel = window.prompt("Field label:", row.label);
    if (!nextLabel) return;
    const nextValue = window.prompt("Field value:", row.value);
    if (nextValue == null) return;
    setAboutState((prev) => ({
      ...prev,
      infoRows: prev.infoRows.map((item) => item.id === id ? {
        ...item,
        label: nextLabel.trim(),
        value: nextValue.trim()
      } : item)
    }));
  };
  const addInfoRow = () => {
    const label = window.prompt("New field label:");
    if (!label) return;
    const value = window.prompt("New field value:");
    if (value == null) return;
    setAboutState((prev) => ({
      ...prev,
      infoRows: [...prev.infoRows, {
        id: `row-${Date.now()}`,
        label: label.trim(),
        value: value.trim()
      }]
    }));
  };
  const removeInfoRow = (id) => {
    setAboutState((prev) => ({
      ...prev,
      infoRows: prev.infoRows.filter((item) => item.id !== id)
    }));
  };
  const editStat = (id) => {
    const stat = aboutState.stats.find((item) => item.id === id);
    if (!stat) return;
    const nextValue = window.prompt("Stat value:", stat.value);
    if (!nextValue) return;
    const nextLabel = window.prompt("Stat label:", stat.label);
    if (!nextLabel) return;
    setAboutState((prev) => ({
      ...prev,
      stats: prev.stats.map((item) => item.id === id ? {
        ...item,
        value: nextValue.trim(),
        label: nextLabel.trim()
      } : item)
    }));
  };
  return /* @__PURE__ */ jsx("div", { ref, style: {
    minHeight: "100vh",
    padding: "5rem 1.5rem"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: "1100px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "fade-in", style: {
      marginBottom: "4rem",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsx("p", { style: {
        color: "var(--accent-cyan)",
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: "0.5rem"
      }, children: "Get to know me" }),
      /* @__PURE__ */ jsx("h1", { className: "section-title", children: "About" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "3rem",
      alignItems: "start"
    }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "fade-in glass-card", style: {
          overflow: "hidden",
          marginBottom: "1rem"
        }, children: /* @__PURE__ */ jsx("div", { className: "img-placeholder", style: {
          height: "360px",
          position: "relative"
        }, children: aboutState.profileImage ? /* @__PURE__ */ jsx("img", { src: aboutState.profileImage, alt: about?.name ?? "Profile", style: {
          width: "100%",
          height: "100%",
          objectFit: "cover"
        } }) : /* @__PURE__ */ jsx("span", { style: {
          fontSize: "4rem"
        }, children: "??" }) }) }),
        isEditMode && /* @__PURE__ */ jsxs("label", { className: "btn-outline", style: {
          marginBottom: "1.5rem",
          display: "inline-flex",
          cursor: "pointer"
        }, children: [
          "Upload Profile Image",
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", style: {
            display: "none"
          }, onChange: async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const encoded = await compressImage(file, 1200, 0.75);
            setAboutState((prev) => ({
              ...prev,
              profileImage: encoded
            }));
          } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-1", style: {
          padding: "1.5rem"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem"
          }, children: [
            /* @__PURE__ */ jsx("h3", { style: {
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--accent-cyan)",
              margin: 0
            }, children: "Personal Info" }),
            isEditMode && /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", style: {
              padding: "0.35rem 0.7rem",
              fontSize: "0.82rem"
            }, onClick: addInfoRow, children: "+ Add" })
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }, children: aboutState.infoRows.map((row) => /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "0.6rem",
            alignItems: "center",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "0.5rem"
          }, children: [
            isEditMode ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => editInfoRow(row.id), style: {
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              textAlign: "left",
              cursor: "pointer"
            }, children: row.label }) : /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              textAlign: "left"
            }, children: row.label }),
            isEditMode ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => editInfoRow(row.id), style: {
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textAlign: "left",
              cursor: "pointer"
            }, children: row.value }) : /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textAlign: "left"
            }, children: row.value }),
            isEditMode && /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", onClick: () => removeInfoRow(row.id), style: {
              width: "28px",
              height: "28px",
              padding: 0,
              justifyContent: "center"
            }, children: "X" })
          ] }, row.id)) }),
          about?.cvFile && /* @__PURE__ */ jsx("a", { href: about.cvFile, download: true, className: "btn-primary", style: {
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            textAlign: "center"
          }, children: "Download CV" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-2", style: {
          padding: "1.5rem",
          marginTop: "1.5rem"
        }, children: [
          /* @__PURE__ */ jsx("h3", { style: {
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--accent-cyan)"
          }, children: "Social Profiles" }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "grid",
            gap: "0.75rem"
          }, children: socials.map((social) => /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "40px 1fr auto",
            gap: "0.5rem",
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ jsx("a", { href: social.url, target: "_blank", rel: "noopener noreferrer", className: "social-btn", title: social.label, style: {
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.9rem"
            }, children: social.icon }),
            isEditMode ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => editSocial(social.key), style: {
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              overflowWrap: "anywhere",
              textAlign: "left",
              cursor: "pointer"
            }, children: social.url }) : /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              overflowWrap: "anywhere"
            }, children: social.url }),
            isEditMode && /* @__PURE__ */ jsx("button", { type: "button", className: "btn-outline", onClick: () => editSocial(social.key), style: {
              padding: "0.4rem 0.7rem",
              fontSize: "0.8rem"
            }, children: "Edit" })
          ] }, social.key)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-1", style: {
        padding: "2.5rem"
      }, children: [
        /* @__PURE__ */ jsxs("h2", { style: {
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: "1rem"
        }, children: [
          "Hi, I am ",
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: about?.name ?? "Ahmet Kemal Keskin" })
        ] }),
        isEditMode ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          const next = window.prompt("Job title:", aboutState.title);
          if (!next) return;
          setAboutState((prev) => ({
            ...prev,
            title: next.trim()
          }));
        }, style: {
          background: "none",
          border: "none",
          color: "var(--accent-purple)",
          fontWeight: 600,
          marginBottom: "1.2rem",
          fontSize: "1rem",
          cursor: "pointer",
          padding: 0
        }, children: aboutState.title }) : /* @__PURE__ */ jsx("p", { style: {
          color: "var(--accent-purple)",
          fontWeight: 600,
          marginBottom: "1.2rem",
          fontSize: "1rem"
        }, children: aboutState.title }),
        isEditMode ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          const next = window.prompt("Bio text:", aboutState.bio);
          if (!next) return;
          setAboutState((prev) => ({
            ...prev,
            bio: next.trim()
          }));
        }, style: {
          background: "none",
          border: "none",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          cursor: "pointer",
          padding: 0,
          textAlign: "left"
        }, children: aboutState.bio }) : /* @__PURE__ */ jsx("p", { style: {
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          margin: 0
        }, children: aboutState.bio }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "2.5rem"
        }, children: aboutState.stats.map((item) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => isEditMode && editStat(item.id), style: {
          textAlign: "center",
          padding: "1.25rem",
          background: "rgba(0,212,255,0.04)",
          borderRadius: "var(--radius)",
          border: "1px solid rgba(0,212,255,0.1)",
          cursor: isEditMode ? "pointer" : "default"
        }, children: [
          /* @__PURE__ */ jsx("div", { className: "gradient-text", style: {
            fontSize: "1.8rem",
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif"
          }, children: item.value }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem"
          }, children: item.label })
        ] }, item.id)) })
      ] }) })
    ] })
  ] }) });
}
export {
  AboutPage as component
};
