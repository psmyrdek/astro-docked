import {type AstroCookies} from "astro";
import {supabase} from "./supabase";

export async function verifyAuth(cookies: AstroCookies) {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return {user: null, error: "No auth cookies found"};
  }

  // Set up Supabase auth with the access token
  supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  });

  // Get the user data
  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return {user: null, error: error.message};
  }

  return {user, error: null};
}
