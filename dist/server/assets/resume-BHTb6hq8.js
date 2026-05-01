import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const SplitComponent = () => /* @__PURE__ */ jsxs("div", { style: {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "1rem",
  padding: "5rem 1.5rem",
  textAlign: "center"
}, children: [
  /* @__PURE__ */ jsx("h1", { style: {
    fontSize: "2rem",
    fontWeight: 700
  }, children: "Resume" }),
  /* @__PURE__ */ jsxs("p", { style: {
    color: "var(--text-secondary)"
  }, children: [
    /* @__PURE__ */ jsx(Link, { to: "/experience", className: "nav-link", children: "Experience" }),
    " and ",
    /* @__PURE__ */ jsx(Link, { to: "/skills", className: "nav-link", children: "Skills" }),
    " pages include my professional background."
  ] }),
  /* @__PURE__ */ jsx(Link, { to: "/about", className: "btn-primary", style: {
    marginTop: "1rem"
  }, children: "View About Page" })
] });
export {
  SplitComponent as component
};
