<!-- A modern signin form component using Svelte 5 runes -->
<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';

  export interface SignInResponse {
    user: {
      id: string;
      email: string;
      // Add other user properties as needed
    };
    message: string;
    error?: string;
  }

  interface Props extends HTMLFormAttributes {
    onSignInSuccess?: (data: SignInResponse) => void;
  }

  let { onSignInSuccess, ...formProps }: Props = $props();

  let email = $state('');
  let password = $state('');
  let error = $state<string | null>(null);
  let isLoading = $state(false);

  // Derived validation states using the new $derived rune
  let isEmailValid = $derived(email.includes('@') && email.includes('.'));
  let isPasswordValid = $derived(password.length >= 6);
  let canSubmit = $derived(isEmailValid && isPasswordValid && !isLoading);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = null;
    isLoading = true;

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as SignInResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // Clear form
      email = '';
      password = '';

      // Notify parent of success with proper typing
      onSignInSuccess?.(data);

      // Redirect to home page
      window.location.href = '/home';
    } catch (e) {
      error = e instanceof Error ? e.message : 'An unknown error occurred';
    } finally {
      isLoading = false;
    }
  }
</script>

<form
  {...formProps}
  class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md {formProps.class ??
    ''}"
  onsubmit={handleSubmit}
>
  <h2 class="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

  {#if error}
    <div class="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert">
      {error}
    </div>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
      Email
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="you@example.com"
      required
      aria-invalid={email ? !isEmailValid : undefined}
      aria-describedby={email && !isEmailValid ? 'email-error' : undefined}
    />
    {#if email && !isEmailValid}
      <p id="email-error" class="mt-1 text-sm text-red-600" role="alert">
        Please enter a valid email address
      </p>
    {/if}
  </div>

  <div class="mb-6">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
      Password
    </label>
    <input
      type="password"
      id="password"
      bind:value={password}
      class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="••••••••"
      required
      aria-invalid={password ? !isPasswordValid : undefined}
      aria-describedby={password && !isPasswordValid
        ? 'password-error'
        : undefined}
    />
    {#if password && !isPasswordValid}
      <p id="password-error" class="mt-1 text-sm text-red-600" role="alert">
        Password must be at least 6 characters
      </p>
    {/if}
  </div>

  <button
    type="submit"
    disabled={!canSubmit}
    class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
    aria-busy={isLoading}
  >
    {#if isLoading}
      <span class="inline-block animate-spin mr-2" aria-hidden="true">⌛</span>
      Signing in...
    {:else}
      Sign In
    {/if}
  </button>
</form>

<style>
  /* Any additional component-specific styles can go here */
</style>
