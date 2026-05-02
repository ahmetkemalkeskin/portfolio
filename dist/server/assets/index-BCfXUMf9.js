import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { e as Route } from "./router-BwW8mIE7.js";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
function useFadeIn(dep) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")), {
      threshold: 0.1
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
  return ref;
}
function isImageIcon(icon) {
  return icon.startsWith("data:image/") || icon.startsWith("http://") || icon.startsWith("https://");
}
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "").trim();
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.includes("/embed/")) return parsed.pathname.split("/embed/")[1]?.split("/")[0] ?? "";
      return parsed.searchParams.get("v") ?? "";
    }
    return "";
  } catch {
    return "";
  }
}
function toThumbnailUrl(url) {
  const id = url ? getYouTubeId(url) : "";
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}
function getProjectImages(project) {
  return [project.coverImage, ...project.galleryImages ?? []].filter((img) => Boolean(img));
}
function normalizeImageIndex(index, total) {
  if (total <= 0) return 0;
  return (index % total + total) % total;
}
function HomePage() {
  const {
    featured,
    settings,
    skillCategories
  } = Route.useLoaderData();
  const pageRef = useFadeIn();
  const [carouselById, setCarouselById] = useState({});
  const siteName = settings?.siteName?.trim() || "Ahmet Kemal Keskin";
  const siteTagline = settings?.siteTitle?.trim() || "3D Artist | Game Developer | Graphic Designer";
  const featuredProjects = useMemo(() => featured.map((project, index) => ({
    id: `seed-${index}-${project._meta.path}`,
    title: project.title,
    description: project.description ?? "",
    tags: project.tags ?? [],
    category: project.category,
    coverImage: project.coverImage ?? project.image,
    galleryImages: project.gallery ?? [],
    youtubeUrl: project.youtubeUrl
  })), [featured]);
  const quickSkills = useMemo(() => {
    const flat = skillCategories.flatMap((cat) => (cat.items ?? []).map((item) => ({
      name: item.name,
      icon: "✨"
    })));
    const names = flat.map((s) => s.name);
    const unique = [...new Set(names)].map((name) => ({
      name,
      icon: "✨"
    }));
    return unique.slice(0, 16);
  }, [skillCategories]);
  const bumpCarousel = (id, direction) => {
    const project = featuredProjects.find((p) => p.id === id);
    if (!project) return;
    const total = getProjectImages(project).length;
    if (total <= 1) return;
    setCarouselById((prev) => {
      const cur = prev[id] ?? 0;
      return {
        ...prev,
        [id]: normalizeImageIndex(cur + direction, total)
      };
    });
  };
  const displayImage = (project) => {
    const imgs = getProjectImages(project);
    if (!imgs.length) {
      return project.youtubeUrl ? toThumbnailUrl(project.youtubeUrl) : void 0;
    }
    const idx = normalizeImageIndex(carouselById[project.id] ?? 0, imgs.length);
    return imgs[idx];
  };
  return /* @__PURE__ */ jsxs("div", { ref: pageRef, style: {
    minHeight: "100vh"
  }, children: [
    /* @__PURE__ */ jsxs("section", { style: {
      position: "relative",
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      overflow: "hidden",
      padding: "4rem 1.5rem"
    }, children: [
      /* @__PURE__ */ jsx("div", { className: "ambient-glow ambient-glow-cyan", style: {
        top: "-100px",
        left: "20%",
        position: "absolute"
      } }),
      /* @__PURE__ */ jsx("div", { className: "ambient-glow ambient-glow-purple", style: {
        bottom: "0",
        right: "10%",
        position: "absolute"
      } }),
      /* @__PURE__ */ jsxs("div", { style: {
        position: "relative",
        zIndex: 1,
        maxWidth: "820px"
      }, children: [
        /* @__PURE__ */ jsx("p", { className: "hero-title", style: {
          color: "var(--accent-cyan)",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }, children: "Welcome to my portfolio" }),
        /* @__PURE__ */ jsxs("h1", { className: "hero-title", style: {
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          fontWeight: 700,
          lineHeight: 1.08,
          marginBottom: "1.5rem"
        }, children: [
          siteName,
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: siteTagline })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-subtitle", style: {
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          maxWidth: "560px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.7
        }, children: "Creating immersive 3D worlds, games, and visual experiences with Blender & Unity" }),
        /* @__PURE__ */ jsxs("div", { className: "hero-cta", style: {
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/projects", className: "btn-primary", children: "View Projects" }),
          /* @__PURE__ */ jsx(Link, { to: "/contact", className: "btn-outline", children: "Get in Touch" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          marginTop: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-muted)",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }, children: [
          /* @__PURE__ */ jsx("span", { children: "Scroll" }),
          /* @__PURE__ */ jsx("div", { style: {
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, var(--accent-cyan), transparent)"
          } })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "glow-line" }),
    /* @__PURE__ */ jsxs("section", { style: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "6rem 1.5rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        textAlign: "center",
        marginBottom: "3rem"
      }, children: [
        /* @__PURE__ */ jsx("p", { className: "fade-in", style: {
          color: "var(--accent-cyan)",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.5rem"
        }, children: "Selected Work" }),
        /* @__PURE__ */ jsx("h2", { className: "section-title fade-in fade-in-delay-1", children: "Featured Projects" }),
        /* @__PURE__ */ jsx("p", { className: "section-subtitle fade-in fade-in-delay-2", children: "A curated selection of my latest work" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "home-project-grid", style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "1.5rem",
        alignItems: "stretch"
      }, children: featuredProjects.map((project) => {
        const shown = displayImage(project);
        const totalImages = getProjectImages(project).length;
        const activeIndex = normalizeImageIndex(carouselById[project.id] ?? 0, Math.max(totalImages, 1));
        return /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in home-project-card", style: {
          overflow: "hidden"
        }, children: [
          /* @__PURE__ */ jsxs("div", { className: "img-placeholder", style: {
            height: "200px",
            borderRadius: "var(--radius) var(--radius) 0 0",
            position: "relative"
          }, children: [
            shown ? /* @__PURE__ */ jsx("img", { src: shown, alt: project.title, style: {
              width: "100%",
              height: "100%",
              objectFit: "cover"
            } }) : /* @__PURE__ */ jsxs("span", { style: {
              fontSize: "0.85rem"
            }, children: [
              "📸 ",
              project.title
            ] }),
            totalImages > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { style: {
                position: "absolute",
                left: "50%",
                top: "0.55rem",
                transform: "translateX(-50%)",
                padding: "0.2rem 0.5rem",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.55)",
                color: "#e2e8f0",
                fontSize: "0.7rem",
                fontWeight: 600,
                pointerEvents: "none"
              }, children: [
                activeIndex + 1,
                " ",
                "/",
                " ",
                totalImages
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
                e.stopPropagation();
                bumpCarousel(project.id, -1);
              }, style: {
                position: "absolute",
                left: "0.7rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.05rem",
                lineHeight: 1
              }, children: "‹" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
                e.stopPropagation();
                bumpCarousel(project.id, 1);
              }, style: {
                position: "absolute",
                right: "0.7rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.05rem",
                lineHeight: 1
              }, children: "›" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.7rem",
            minHeight: "170px"
          }, children: [
            project.category && /* @__PURE__ */ jsx("span", { className: "tag tag-purple", style: {
              marginBottom: "0.6rem",
              display: "inline-block"
            }, children: project.category }),
            /* @__PURE__ */ jsx("h3", { style: {
              fontSize: "1.1rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--text-primary)"
            }, children: project.title }),
            /* @__PURE__ */ jsxs("p", { style: {
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: 1.6
            }, children: [
              project.description?.slice(0, 110),
              "…"
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginTop: "auto"
            }, children: project.tags?.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: "tag", children: tag }, tag)) })
          ] })
        ] }, project.id);
      }) }),
      /* @__PURE__ */ jsx("div", { style: {
        textAlign: "center",
        marginTop: "3rem"
      }, children: /* @__PURE__ */ jsx(Link, { to: "/projects", className: "btn-outline", children: "View All Projects →" }) })
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "glow-line" }),
    /* @__PURE__ */ jsxs("section", { style: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "6rem 1.5rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        textAlign: "center",
        marginBottom: "3rem"
      }, children: [
        /* @__PURE__ */ jsx("p", { className: "fade-in", style: {
          color: "var(--accent-cyan)",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.5rem"
        }, children: "Expertise" }),
        /* @__PURE__ */ jsx("h2", { className: "section-title fade-in fade-in-delay-1", children: "Skills & Tools" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center"
      }, children: quickSkills.map((s, i) => /* @__PURE__ */ jsxs("div", { className: `glass-card fade-in fade-in-delay-${Math.min(i + 1, 5)}`, style: {
        padding: "0.9rem 1.4rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
      }, children: [
        isImageIcon(s.icon) ? /* @__PURE__ */ jsx("img", { src: s.icon, alt: `${s.name} icon`, style: {
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          objectFit: "cover"
        } }) : /* @__PURE__ */ jsx("span", { style: {
          fontSize: "1.3rem"
        }, children: s.icon }),
        /* @__PURE__ */ jsx("span", { style: {
          fontWeight: 500,
          fontSize: "0.9rem"
        }, children: s.name })
      ] }, s.name)) }),
      /* @__PURE__ */ jsx("div", { style: {
        textAlign: "center",
        marginTop: "2.5rem"
      }, children: /* @__PURE__ */ jsx(Link, { to: "/skills", className: "btn-outline", children: "See Full Skills →" }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 1080px) {
          .home-project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 720px) {
          .home-project-grid {
            grid-template-columns: 1fr !important;
          }
        }
      ` })
  ] });
}
export {
  HomePage as component
};
