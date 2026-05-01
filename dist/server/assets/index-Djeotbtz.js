import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { a as allProjects } from "./allProjects-B1V7QG9B.js";
import { a as allSiteSettings } from "./allSiteSettings-G6SLa_l5.js";
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
const getHomeData_createServerFn_handler = createServerRpc({
  id: "e5d3f5d948391b170b648653d55968324eb90a864ee693154a5ada87efb58755",
  name: "getHomeData",
  filename: "src/routes/index.tsx"
}, (opts) => getHomeData.__executeServer(opts));
const getHomeData = createServerFn({
  method: "GET"
}).handler(getHomeData_createServerFn_handler, async () => {
  const featured = allProjects.filter((p) => p.featured).sort((a, b) => a.order - b.order).slice(0, 6);
  const settings = allSiteSettings[0] ?? null;
  return {
    featured,
    settings
  };
});
export {
  getHomeData_createServerFn_handler
};
