import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({
        message: 'User ID is required',
      }),
      { status: 400 }
    );
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return new Response(
        JSON.stringify({
          message: 'Error deleting user',
          error: error.message,
        }),
        { status: 500 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
};

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({
        message: 'User ID is required',
      }),
      { status: 400 }
    );
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) {
      return new Response(
        JSON.stringify({
          message: 'Error fetching user',
          error: error.message,
        }),
        { status: 500 }
      );
    }

    if (!user) {
      return new Response(
        JSON.stringify({
          message: 'User not found',
        }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
};
