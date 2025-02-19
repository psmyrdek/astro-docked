import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { email, password } = data;

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: 'Email and password are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Sign up the user
    const { data: authData, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if the user already exists (Supabase returns user with identities = [] for existing users)
    if (
      authData.user &&
      (!authData.user.identities || authData.user.identities.length === 0)
    ) {
      return new Response(
        JSON.stringify({
          error: 'An account with this email already exists',
          isExistingAccount: true,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Set the session cookies only for new successful signups
    if (authData.session) {
      cookies.set('sb-access-token', authData.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('sb-refresh-token', authData.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return new Response(
      JSON.stringify({
        user: authData.user,
        message:
          'Successfully signed up! Please check your email to confirm your account.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
