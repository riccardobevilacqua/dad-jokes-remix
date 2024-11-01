import { createCookie } from "@remix-run/node";

export const themeCookie = createCookie("theme", {
  path: "/",
  maxAge: 34560000, // 400 days
});

export type Theme = "light" | "dark";