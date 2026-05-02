import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { a as allSkillCategories } from "./allSkillCategories-BX2iTg5W.js";
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
const getSkillsData_createServerFn_handler = createServerRpc({
  id: "fe191397dc25ac54e32446ba2f3d743f60a311badc0d68469ca31d972c794d71",
  name: "getSkillsData",
  filename: "src/routes/skills.tsx"
}, (opts) => getSkillsData.__executeServer(opts));
const getSkillsData = createServerFn({
  method: "GET"
}).handler(getSkillsData_createServerFn_handler, async () => {
  const categories = [...allSkillCategories].sort((a, b) => a.order - b.order);
  return {
    categories
  };
});
export {
  getSkillsData_createServerFn_handler
};
