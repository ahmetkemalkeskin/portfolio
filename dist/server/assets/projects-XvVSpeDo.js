import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { a as allProjects } from "./allProjects-B1V7QG9B.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const getProjectsData_createServerFn_handler = createServerRpc({
  id: "6ce7ed10848c58e7a3195cec59648d3ebb1e3149c2e9e376844395d9dc2e8dcc",
  name: "getProjectsData",
  filename: "src/routes/projects.tsx"
}, (opts) => getProjectsData.__executeServer(opts));
const getProjectsData = createServerFn({
  method: "GET"
}).handler(getProjectsData_createServerFn_handler, async () => {
  const projects = allProjects.sort((a, b) => a.order - b.order);
  return {
    projects
  };
});
export {
  getProjectsData_createServerFn_handler
};
