import type {APIRoute} from "astro";
import {supabaseAdmin} from "../../../lib/supabase";

export const POST: APIRoute = async ({request, cookies}) => {
  try {
    const data = await request.json();
    const {access_token, refresh_token, expires_in, expires_at} = data;

    // Validate input
    if (!access_token || !refresh_token) {
      return new Response(
        JSON.stringify({
          error: "Access token and refresh token are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify the token by getting the user
    const {data: userData, error: userError} = await supabaseAdmin.auth.getUser(
      access_token
    );

    if (userError) {
      return new Response(
        JSON.stringify({
          error: userError.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Set the session cookies
    cookies.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(
      JSON.stringify({
        user: userData.user,
        message: "Successfully verified token!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
