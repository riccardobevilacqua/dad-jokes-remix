import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import styles from "~/styles/index.module.css";
import type { Theme } from "~/utils/theme.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Dad Jokes" },
    { name: "description", content: "Random dad jokes to brighten your day!" },
  ];
};

type LoaderData = {
  joke: string;
  fetchedAt: string;
};

type ContextType = {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
};

export const loader: LoaderFunction = async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      "User-Agent": "https://github.com/riccardobevilacqua/dad-jokes-remix",
      "Accept": "application/json"
    }
  });

  const data = await response.json();
  
  return json<LoaderData>({
    joke: data.joke,
    fetchedAt: new Date().toISOString()
  });
};

export default function Index() {
  const { joke } = useLoaderData<LoaderData>();
  const { theme, setTheme } = useOutletContext<ContextType>();

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className={styles.content}>
        <h1 className={styles.title}>Dad Jokes Remix</h1>
        <div className={styles.jokeCard}>
          <p>{joke}</p>
        </div>
      </div>
      <footer className={styles.footer}>
        Made with ❤️ by Riccardo Bevilacqua © 2024
      </footer>
    </div>
  );
}
