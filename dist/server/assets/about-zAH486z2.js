import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useMemo, useEffect } from "react";
import { d as Route } from "./router-BwW8mIE7.js";
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
const STAT_ITEMS = [{
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
}];
function AboutPage() {
  const {
    about,
    settings
  } = Route.useLoaderData();
  const ref = useRef(null);
  const socials = useMemo(() => {
    const rows = [{
      key: "github",
      label: "GitHub",
      icon: "GH",
      url: settings?.github
    }, {
      key: "linkedin",
      label: "LinkedIn",
      icon: "in",
      url: settings?.linkedin
    }, {
      key: "youtube",
      label: "YouTube",
      icon: "▶",
      url: settings?.youtube
    }, {
      key: "instagram",
      label: "Instagram",
      icon: "◎",
      url: settings?.instagram
    }];
    return rows.filter((r) => Boolean(r.url?.trim()));
  }, [settings]);
  const infoRows = useMemo(() => [{
    id: "name",
    label: "Name",
    value: about?.name ?? ""
  }, {
    id: "email",
    label: "Email",
    value: about?.email ?? ""
  }, {
    id: "location",
    label: "Location",
    value: about?.location ?? ""
  }, {
    id: "languages",
    label: "Languages",
    value: about?.languages ?? ""
  }].filter((row) => row.value), [about]);
  const title = about?.title ?? "3D Artist & Game Developer";
  const bio = about?.bio ?? "Passionate 3D artist and game developer creating immersive worlds, game environments, and visual storytelling experiences with Blender and Unity.";
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), {
      threshold: 0.1
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
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
        }, children: about?.profileImage ? /* @__PURE__ */ jsx("img", { src: about.profileImage, alt: about?.name ?? "Profile", style: {
          width: "100%",
          height: "100%",
          objectFit: "cover"
        } }) : /* @__PURE__ */ jsx("span", { style: {
          fontSize: "4rem"
        }, children: "??" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-1", style: {
          padding: "1.5rem"
        }, children: [
          /* @__PURE__ */ jsx("h3", { style: {
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--accent-cyan)",
            marginBottom: "1rem"
          }, children: "Personal Info" }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }, children: infoRows.map((row) => /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
            alignItems: "center",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "0.5rem"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              textAlign: "left"
            }, children: row.label }),
            /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textAlign: "left"
            }, children: row.value })
          ] }, row.id)) }),
          about?.cvFile && /* @__PURE__ */ jsx("a", { href: about.cvFile, download: true, className: "btn-primary", style: {
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            textAlign: "center"
          }, children: "Download CV" })
        ] }),
        socials.length > 0 && /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-2", style: {
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
            gridTemplateColumns: "40px 1fr",
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
            /* @__PURE__ */ jsx("span", { style: {
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              overflowWrap: "anywhere"
            }, children: social.url })
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
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: about?.name ?? "Creator" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: {
          color: "var(--accent-purple)",
          fontWeight: 600,
          marginBottom: "1.2rem",
          fontSize: "1rem"
        }, children: title }),
        /* @__PURE__ */ jsx("p", { style: {
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          margin: 0
        }, children: bio }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "2.5rem"
        }, children: STAT_ITEMS.map((item) => /* @__PURE__ */ jsxs("div", { style: {
          textAlign: "center",
          padding: "1.25rem",
          background: "rgba(0,212,255,0.04)",
          borderRadius: "var(--radius)",
          border: "1px solid rgba(0,212,255,0.1)"
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
