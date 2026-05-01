import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { u as useEditMode } from "./useEditMode-D4mVJXwr.js";
import { b as Route } from "./router-CU1IVljr.js";
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
function encode(data) {
  return Object.entries(data).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}
function ContactPage() {
  const {
    settings
  } = Route.useLoaderData();
  const {
    toggleEditMode
  } = useEditMode();
  const [fields, setFields] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const ref = useRef(null);
  const secretTap = useRef({
    count: 0,
    lastAt: 0
  });
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")), {
      threshold: 0.1
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const handleChange = (e) => setFields({
    ...fields,
    [e.target.name]: e.target.value
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encode({
          "form-name": "contact",
          ...fields
        })
      });
      if (!response.ok) throw new Error("Form submit failed");
      setStatus("sent");
      setFields({
        name: "",
        email: "",
        message: ""
      });
    } catch {
      const targetEmail = settings?.email ?? "ahmetkemal608@gmail.com";
      const subject = encodeURIComponent(`Portfolio Contact - ${fields.name}`);
      const body = encodeURIComponent(`Name: ${fields.name}
Email: ${fields.email}

${fields.message}`);
      try {
        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
        setStatus("sent");
        setFields({
          name: "",
          email: "",
          message: ""
        });
      } catch {
        setStatus("error");
      }
    }
  };
  const socials = [{
    label: "GitHub",
    url: settings?.github,
    icon: "⌨️"
  }, {
    label: "YouTube",
    url: settings?.youtube,
    icon: "▶️"
  }, {
    label: "Instagram",
    url: settings?.instagram,
    icon: "📷"
  }, {
    label: "LinkedIn",
    url: settings?.linkedin,
    icon: "💼"
  }].filter((s) => s.url);
  const handleSecretToggle = () => {
    const now = Date.now();
    const withinWindow = now - secretTap.current.lastAt < 900;
    const nextCount = withinWindow ? secretTap.current.count + 1 : 1;
    secretTap.current = {
      count: nextCount,
      lastAt: now
    };
    if (nextCount >= 3) {
      toggleEditMode();
      secretTap.current = {
        count: 0,
        lastAt: 0
      };
    }
  };
  return /* @__PURE__ */ jsx("div", { ref, style: {
    minHeight: "100vh",
    padding: "5rem 1.5rem"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: "1100px",
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
      }, children: "Contact" }),
      /* @__PURE__ */ jsx("h1", { className: "section-title", onClick: handleSecretToggle, children: "Get in Touch" }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle", children: "Have a project idea? Share the details with me." })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "3rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in", style: {
          padding: "2rem",
          marginBottom: "1.5rem"
        }, children: [
          /* @__PURE__ */ jsx("h3", { style: {
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--accent-cyan)",
            marginBottom: "1.5rem"
          }, children: "Contact Info" }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }, children: [
            settings?.email && /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.1rem"
              }, children: "✉️" }),
              /* @__PURE__ */ jsx("a", { href: `mailto:${settings.email}`, style: {
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.9rem"
              }, className: "nav-link", children: settings.email })
            ] }),
            settings?.phone && /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                fontSize: "1.1rem"
              }, children: "📞" }),
              /* @__PURE__ */ jsx("span", { style: {
                color: "var(--text-secondary)",
                fontSize: "0.9rem"
              }, children: settings.phone })
            ] })
          ] })
        ] }),
        socials.length > 0 && /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-1", style: {
          padding: "2rem",
          marginBottom: "1.5rem"
        }, children: [
          /* @__PURE__ */ jsx("h3", { style: {
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--accent-cyan)",
            marginBottom: "1.25rem"
          }, children: "Social Media" }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap"
          }, children: socials.map(({
            label,
            url,
            icon
          }) => /* @__PURE__ */ jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "social-btn", title: label, children: /* @__PURE__ */ jsx("span", { style: {
            fontSize: "1.1rem"
          }, children: icon }) }, label)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "glass-card fade-in fade-in-delay-2", style: {
          overflow: "hidden"
        }, children: settings?.mapsEmbed ? /* @__PURE__ */ jsx("iframe", { src: settings.mapsEmbed, style: {
          width: "100%",
          height: "220px",
          border: "none"
        }, title: "Location" }) : /* @__PURE__ */ jsx("div", { className: "img-placeholder", style: {
          height: "180px",
          borderRadius: "var(--radius)"
        }, children: /* @__PURE__ */ jsx("span", { children: "🗺️ Add location from CMS" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card fade-in fade-in-delay-1", style: {
        padding: "2.5rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: {
          fontSize: "1.1rem",
          fontWeight: 600,
          marginBottom: "2rem"
        }, children: "Send a Message" }),
        status === "sent" ? /* @__PURE__ */ jsxs("div", { style: {
          textAlign: "center",
          padding: "2rem"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "2.5rem",
            marginBottom: "1rem"
          }, children: "✅" }),
          /* @__PURE__ */ jsx("h4", { style: {
            marginBottom: "0.5rem"
          }, children: "Message sent!" }),
          /* @__PURE__ */ jsx("p", { style: {
            color: "var(--text-secondary)",
            fontSize: "0.9rem"
          }, children: "Thanks for reaching out. I will get back to you soon." }),
          /* @__PURE__ */ jsx("button", { onClick: () => setStatus("idle"), className: "btn-outline", style: {
            marginTop: "1.5rem"
          }, children: "Send another" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: {
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }, children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "form-name", value: "contact" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "bot-field", style: {
            display: "none"
          }, "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: {
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem"
            }, children: "Name" }),
            /* @__PURE__ */ jsx("input", { type: "text", name: "name", value: fields.name, onChange: handleChange, required: true, placeholder: "Your name", className: "form-input" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: {
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem"
            }, children: "Email" }),
            /* @__PURE__ */ jsx("input", { type: "email", name: "email", value: fields.email, onChange: handleChange, required: true, placeholder: "your@email.com", className: "form-input" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: {
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem"
            }, children: "Message" }),
            /* @__PURE__ */ jsx("textarea", { name: "message", value: fields.message, onChange: handleChange, required: true, rows: 5, placeholder: "Tell me about your project...", className: "form-input", style: {
              resize: "vertical",
              minHeight: "120px"
            } })
          ] }),
          status === "error" && /* @__PURE__ */ jsx("p", { style: {
            color: "#f87171",
            fontSize: "0.875rem"
          }, children: "Something went wrong. Please try again." }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: status === "sending", className: "btn-primary", style: {
            justifyContent: "center"
          }, children: status === "sending" ? "Sending..." : "Send Message" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ContactPage as component
};
