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
const allAbouts = [
  {
    "name": "Ahmet Kemal Keskin",
    "title": "3D Artist & Game Developer",
    "email": "ahmetkemal608@gmail.com",
    "location": "Turkey",
    "languages": "English",
    "profileImage": "/images/uploads/profile.jpg",
    "cvFile": "/files/cv.pdf",
    "bio": "Passionate 3D artist and game developer creating immersive worlds, game environments, and visual storytelling experiences with Blender and Unity.",
    "content": "",
    "_meta": {
      "filePath": "main.md",
      "fileName": "main.md",
      "directory": ".",
      "extension": "md",
      "path": "main"
    }
  }
];
const getAboutData_createServerFn_handler = createServerRpc({
  id: "fc10383af2b87974a109858b99bbb5f34ef6da7644fced3476f483b7a1a90953",
  name: "getAboutData",
  filename: "src/routes/about.tsx"
}, (opts) => getAboutData.__executeServer(opts));
const getAboutData = createServerFn({
  method: "GET"
}).handler(getAboutData_createServerFn_handler, async () => {
  const about = allAbouts[0] ?? null;
  return {
    about
  };
});
export {
  getAboutData_createServerFn_handler
};
