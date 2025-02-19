<!-- A modern signup form component using Svelte 5 runes -->
<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';

  export interface SignUpResponse {
    user: {
      id: string;
      email: string;
      // Add other user properties as needed
    };
    message: string;
    error?: string;
    isExistingAccount?: boolean;
  }

  interface Props extends HTMLFormAttributes {
    onSignUpSuccess?: (data: SignUpResponse) => void;
  }

  let { onSignUpSuccess, ...formProps }: Props = $props();

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state<string | null>(null);
  let isLoading = $state(false);
  let isSuccess = $state(false);
  let isExistingAccount = $state(false);

  // Derived validation states using the new $derived rune
  let isEmailValid = $derived(email.includes('@') && email.includes('.'));
  let isPasswordValid = $derived(password.length >= 6);
  let doPasswordsMatch = $derived(password === confirmPassword);
  let canSubmit = $derived(
    isEmailValid && isPasswordValid && doPasswordsMatch && !isLoading,
  );

  // Using the new event handler type
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = null;
    isLoading = true;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as SignUpResponse;

      if (!response.ok) {
        if (data.isExistingAccount) {
          isExistingAccount = true;
          throw new Error(
            'An account with this email already exists. Please try logging in instead.',
          );
        }
        throw new Error(data.error || 'Signup failed');
      }

      // Clear form and show success message
      email = '';
      password = '';
      confirmPassword = '';
      isSuccess = true;
      isExistingAccount = false;

      // Notify parent of success with proper typing
      onSignUpSuccess?.(data);
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
  <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>

  {#if error}
    <div
      class="mb-4 p-3 {isExistingAccount
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700'} rounded"
      role="alert"
    >
      {error}
    </div>
  {/if}

  {#if isSuccess}
    <div class="mb-4 p-3 bg-green-100 text-green-700 rounded" role="alert">
      <p class="font-medium">Account created successfully!</p>
      <p class="mt-1">
        Please check your email for a confirmation link to activate your
        account.
      </p>
    </div>
  {:else}
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

    <div class="mb-4">
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

    <div class="mb-6">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="confirm-password"
      >
        Confirm Password
      </label>
      <input
        type="password"
        id="confirm-password"
        bind:value={confirmPassword}
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="••••••••"
        required
        aria-invalid={confirmPassword ? !doPasswordsMatch : undefined}
        aria-describedby={confirmPassword && !doPasswordsMatch
          ? 'confirm-password-error'
          : undefined}
      />
      {#if confirmPassword && !doPasswordsMatch}
        <p
          id="confirm-password-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          Passwords do not match
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
        <span class="inline-block animate-spin mr-2" aria-hidden="true">⌛</span
        >
        Signing up...
      {:else}
        Sign Up
      {/if}
    </button>
  {/if}
</form>

<style>
  /* Any additional component-specific styles can go here */
</style>
