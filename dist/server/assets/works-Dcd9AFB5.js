import { jsx } from "react/jsx-runtime";
import { Navigate } from "@tanstack/react-router";
function WorksRedirectPage() {
  return /* @__PURE__ */ jsx(Navigate, { to: "/projects", replace: true });
}
export {
  WorksRedirectPage as component
};
