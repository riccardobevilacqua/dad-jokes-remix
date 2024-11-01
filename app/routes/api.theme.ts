import { json, type ActionFunction } from "@remix-run/node";
import { themeCookie } from "~/utils/theme.server";

export const action: ActionFunction = async ({ request }) => {
  const { theme } = await request.json();
  
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
      },
    }
  );
}; 