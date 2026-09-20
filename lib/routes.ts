/**
 * Centralized Route Map for Essay Support
 *
 * Designed for embedding as a sub-feature inside MyThorneAI's parent dashboard.
 * When mounted under a subpath (e.g. NEXT_PUBLIC_BASE_PATH=/dashboard/essay-support),
 * all internal links will automatically inherit the correct prefix without breaking.
 */

export interface AppRoutes {
  home: string;
  upload: string;
  editor: string;
  results: string;
  progress: string;
}

export const getRoutes = (basePath: string = ""): AppRoutes => {
  // Normalize basePath: strip trailing slash if present
  const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

  return {
    home: cleanBase || "/",
    upload: cleanBase || "/",
    editor: `${cleanBase}/editor`,
    results: `${cleanBase}/results`,
    progress: `${cleanBase}/progress`,
  };
};

export const ROUTES: AppRoutes = getRoutes(
  process.env.NEXT_PUBLIC_BASE_PATH || ""
);
