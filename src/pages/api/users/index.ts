import type {APIRoute} from "astro";
import {supabaseAdmin} from "../../../lib/supabase";

export const GET: APIRoute = async () => {
  console.log("[Users API] Starting GET request");

  try {
    console.log("[Users API] Attempting to fetch users from Supabase Auth");

    const {
      data: {users},
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("[Users API] Supabase error:", {
        message: error.message,
        name: error.name,
      });

      return new Response(
        JSON.stringify({
          message: "Error fetching users",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[Users API] Successfully fetched users:", {
      count: users?.length ?? 0,
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[Users API] Unexpected error:", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    return new Response(
      JSON.stringify({
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
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
