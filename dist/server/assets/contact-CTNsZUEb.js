import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
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
const getContactData_createServerFn_handler = createServerRpc({
  id: "c9091b78a9b760de45715db1cc4443694157974684bac3bd1835bf1e1335e18c",
  name: "getContactData",
  filename: "src/routes/contact.tsx"
}, (opts) => getContactData.__executeServer(opts));
const getContactData = createServerFn({
  method: "GET"
}).handler(getContactData_createServerFn_handler, async () => {
  const settings = allSiteSettings[0] ?? null;
  return {
    settings
  };
});
export {
  getContactData_createServerFn_handler
};
