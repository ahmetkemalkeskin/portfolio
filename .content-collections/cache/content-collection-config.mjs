// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var jobs = defineCollection({
  name: "jobs",
  directory: "content/jobs",
  include: "**/*.md",
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var education = defineCollection({
  name: "education",
  directory: "content/education",
  include: "**/*.md",
  schema: z.object({
    school: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var blog = defineCollection({
  name: "blog",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    author: z.string(),
    content: z.string()
  })
});
var projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    liveUrl: z.string().optional(),
    image: z.string().optional(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).optional().default([]),
    youtubeUrl: z.string().optional(),
    category: z.string().optional(),
    featured: z.boolean().optional().default(false),
    order: z.number().optional().default(0),
    content: z.string()
  })
});
var works = defineCollection({
  name: "works",
  directory: "content/works",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    image: z.string().optional(),
    youtubeUrl: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional().default(0)
  })
});
var experience = defineCollection({
  name: "experience",
  directory: "content/experience",
  include: "**/*.md",
  schema: z.object({
    date: z.string(),
    title: z.string(),
    company: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    order: z.number().optional().default(0)
  })
});
var skillCategories = defineCollection({
  name: "skillCategories",
  directory: "content/skills",
  include: "**/*.md",
  schema: z.object({
    category: z.string(),
    order: z.number().optional().default(0),
    items: z.array(
      z.object({
        name: z.string(),
        level: z.enum(["Beginner", "Normal", "Good", "Very Good", "Expert"])
      })
    ).optional().default([])
  })
});
var about = defineCollection({
  name: "about",
  directory: "content/about",
  include: "**/*.md",
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    email: z.string().optional(),
    location: z.string().optional(),
    languages: z.string().optional(),
    profileImage: z.string().optional(),
    cvFile: z.string().optional(),
    bio: z.string().optional()
  })
});
var siteSettings = defineCollection({
  name: "siteSettings",
  directory: "content/settings",
  include: "**/*.md",
  schema: z.object({
    siteName: z.string().optional(),
    siteTitle: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    github: z.string().optional(),
    youtube: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    mapsEmbed: z.string().optional()
  })
});
var content_collections_default = defineConfig({
  collections: [
    jobs,
    education,
    blog,
    projects,
    works,
    experience,
    skillCategories,
    about,
    siteSettings
  ]
});
export {
  content_collections_default as default
};
