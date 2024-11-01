import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { themeCookie, type Theme } from "~/utils/theme.server";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "/app/styles/global.css"
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
];

type LoaderData = {
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const theme = await themeCookie.parse(cookieHeader) || "light";
  
  return json<LoaderData>({ theme: theme as Theme });
};

export default function App() {
  const { theme: initialTheme } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<Theme>(initialTheme || "light");

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    fetch("/api/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ theme, setTheme }} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
