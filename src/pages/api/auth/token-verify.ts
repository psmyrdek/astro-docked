import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { token, email } = data;

    if (!token || !email) {
      console.error('Missing OTP token or email in request');
      return new Response(
        JSON.stringify({
          error: 'OTP token and email are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: verifyData, error: verifyError } =
      await supabaseAdmin.auth.verifyOtp({
        token,
        email,
        type: 'email',
      });

    if (verifyError) {
      console.error('Error verifying OTP token:', verifyError);
      return new Response(
        JSON.stringify({
          error: verifyError.message,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Set the session cookies using the verified session
    const session = verifyData.session;
    if (!session) {
      console.error('No session returned after successful OTP verification');
      return new Response(
        JSON.stringify({
          error: 'No session returned from verification',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    cookies.set('sb-access-token', session.access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies.set('sb-refresh-token', session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(
      JSON.stringify({
        user: session.user,
        message: 'Successfully verified token and created session!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in token verification:', error);
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
