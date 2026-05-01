import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
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
const allExperiences = [
  {
    "date": "2024 - Present",
    "title": "Senior 3D Artist",
    "company": "",
    "description": "",
    "order": 1,
    "content": "",
    "_meta": {
      "filePath": "exp-1.md",
      "fileName": "exp-1.md",
      "directory": ".",
      "extension": "md",
      "path": "exp-1"
    }
  },
  {
    "date": "2022 - 2024",
    "title": "Game Developer",
    "company": "",
    "description": "",
    "order": 2,
    "content": "",
    "_meta": {
      "filePath": "exp-2.md",
      "fileName": "exp-2.md",
      "directory": ".",
      "extension": "md",
      "path": "exp-2"
    }
  },
  {
    "date": "2020 - 2022",
    "title": "3D Generalist",
    "company": "",
    "description": "",
    "order": 3,
    "content": "",
    "_meta": {
      "filePath": "exp-3.md",
      "fileName": "exp-3.md",
      "directory": ".",
      "extension": "md",
      "path": "exp-3"
    }
  },
  {
    "date": "2018 - 2020",
    "title": "Junior Designer",
    "company": "",
    "description": "",
    "order": 4,
    "content": "",
    "_meta": {
      "filePath": "exp-4.md",
      "fileName": "exp-4.md",
      "directory": ".",
      "extension": "md",
      "path": "exp-4"
    }
  }
];
const getExperienceData_createServerFn_handler = createServerRpc({
  id: "0850288abaaf8cd9ce1d691cdb532a1830740c7c49fd42f77e60717d4b74ab35",
  name: "getExperienceData",
  filename: "src/routes/experience.tsx"
}, (opts) => getExperienceData.__executeServer(opts));
const getExperienceData = createServerFn({
  method: "GET"
}).handler(getExperienceData_createServerFn_handler, async () => {
  const entries = allExperiences.sort((a, b) => a.order - b.order);
  return {
    entries
  };
});
export {
  getExperienceData_createServerFn_handler
};
