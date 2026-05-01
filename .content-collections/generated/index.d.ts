import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Job = GetTypeByName<typeof configuration, "jobs">;
export declare const allJobs: Array<Job>;

export type Education = GetTypeByName<typeof configuration, "education">;
export declare const allEducations: Array<Education>;

export type Blog = GetTypeByName<typeof configuration, "blog">;
export declare const allBlogs: Array<Blog>;

export type Project = GetTypeByName<typeof configuration, "projects">;
export declare const allProjects: Array<Project>;

export type Work = GetTypeByName<typeof configuration, "works">;
export declare const allWorks: Array<Work>;

export type Experience = GetTypeByName<typeof configuration, "experience">;
export declare const allExperiences: Array<Experience>;

export type SkillCategory = GetTypeByName<typeof configuration, "skillCategories">;
export declare const allSkillCategories: Array<SkillCategory>;

export type About = GetTypeByName<typeof configuration, "about">;
export declare const allAbouts: Array<About>;

export type SiteSetting = GetTypeByName<typeof configuration, "siteSettings">;
export declare const allSiteSettings: Array<SiteSetting>;

export {};
