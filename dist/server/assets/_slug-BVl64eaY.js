import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { marked } from "marked";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowLeft, Calendar } from "lucide-react";
import { e as Route } from "./router-CwsCXQi1.js";
import "react";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const allBlogs = [
  {
    "title": "TanStack Start ile H�zl� Ba�lang��",
    "date": "2026-01-15",
    "summary": "TanStack Start ile proje kurulum ad�mlar�n� ve temel yap�y� �zetler.",
    "tags": [
      "TanStack",
      "React",
      "Routing"
    ],
    "author": "Ahmet Kemal Keskin",
    "content": "Bu yaz�da TanStack Start ile yeni bir proje kurarken dikkat edilmesi gereken temel ad�mlar� ve �nerilen klas�r yap�s�n� payla��yorum.",
    "_meta": {
      "filePath": "getting-started-with-tanstack.md",
      "fileName": "getting-started-with-tanstack.md",
      "directory": ".",
      "extension": "md",
      "path": "getting-started-with-tanstack"
    }
  },
  {
    "title": "React 19 �ne ��kan Yenilikler",
    "date": "2026-02-10",
    "summary": "React 19 ile gelen �nemli geli�tirmeler ve etkileri.",
    "tags": [
      "React",
      "Frontend"
    ],
    "author": "Ahmet Kemal Keskin",
    "content": "React 19 s�r�m�ndeki yeni �zellikleri, mevcut projelere etkisini ve g�� plan� i�in pratik notlar� ele al�yorum.",
    "_meta": {
      "filePath": "react-19-features.md",
      "fileName": "react-19-features.md",
      "directory": ".",
      "extension": "md",
      "path": "react-19-features"
    }
  },
  {
    "title": "Tailwind CSS v4 Rehberi",
    "date": "2026-02-01",
    "summary": "Tailwind CSS v4 ile gelen de�i�ikliklerin k�sa bir �zeti.",
    "tags": [
      "Tailwind",
      "CSS"
    ],
    "author": "Ahmet Kemal Keskin",
    "content": "Tailwind CSS v4 s�r�m�ndeki yenilikleri ve mevcut projelerde ge�i� s�recinde dikkat edilmesi gereken noktalar� anlat�yorum.",
    "_meta": {
      "filePath": "tailwind-css-v4-guide.md",
      "fileName": "tailwind-css-v4-guide.md",
      "directory": ".",
      "extension": "md",
      "path": "tailwind-css-v4-guide"
    }
  }
];
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function BlogPost() {
  const {
    slug
  } = Route.useParams();
  const post = allBlogs.find((p) => p._meta.path === slug);
  if (!post) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen  flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Post not found" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-blue-600 hover:underline", children: "Back to home" })
    ] }) });
  }
  const html = marked(post.content);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen ", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
      "Back to home"
    ] }),
    /* @__PURE__ */ jsxs("article", { children: [
      /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: post.title }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-gray-500 mb-4", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 16 }),
          /* @__PURE__ */ jsx("time", { children: new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }) }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsx("span", { children: post.author })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: tag }, tag)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "prose prose-gray max-w-none", dangerouslySetInnerHTML: {
        __html: html
      } })
    ] })
  ] }) });
}
export {
  BlogPost as component
};
