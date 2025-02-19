<!-- A container component for authentication forms -->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import SignInForm from './SignInForm.svelte';
  import SignUpForm from './SignUpForm.svelte';
  import AuthError from './AuthError.svelte';
  import type { SignInResponse } from './SignInForm.svelte';
  import type { SignUpResponse } from './SignUpForm.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    onAuthSuccess?: (data: SignInResponse | SignUpResponse) => void;
  }

  let { onAuthSuccess, ...containerProps }: Props = $props();

  let isSignIn = $state(true);

  function toggleAuthMode() {
    isSignIn = !isSignIn;
  }
</script>

<div {...containerProps} class="auth-container {containerProps.class ?? ''}">
  <AuthError />

  {#if isSignIn}
    <SignInForm onSignInSuccess={onAuthSuccess} />
  {:else}
    <SignUpForm onSignUpSuccess={onAuthSuccess} />
  {/if}

  <p class="text-center mt-4 text-gray-600">
    {isSignIn ? "Don't have an account?" : 'Already have an account?'}
    <button
      class="text-blue-500 hover:text-blue-600 font-medium ml-1"
      onclick={toggleAuthMode}
    >
      {isSignIn ? 'Sign up' : 'Sign in'}
    </button>
  </p>
</div>
