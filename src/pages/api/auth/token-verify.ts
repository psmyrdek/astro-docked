import type {APIRoute} from "astro";
import {supabaseAdmin} from "../../../lib/supabase";

export const POST: APIRoute = async ({request, cookies}) => {
  try {
    const data = await request.json();
    const {access_token, type} = data;

    // Validate input
    if (!access_token) {
      return new Response(
        JSON.stringify({
          error: "Access token is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify OTP token
    const {data: verifyData, error: verifyError} =
      await supabaseAdmin.auth.verifyOtp({
        token_hash: access_token,
        type: type || "email",
      });

    if (verifyError) {
      return new Response(
        JSON.stringify({
          error: verifyError.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Set the session cookies using the verified session
    const session = verifyData.session;
    if (!session) {
      return new Response(
        JSON.stringify({
          error: "No session returned from verification",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    cookies.set("sb-access-token", session.access_token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies.set("sb-refresh-token", session.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(
      JSON.stringify({
        user: session.user,
        message: "Successfully verified token and created session!",
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
