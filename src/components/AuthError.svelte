<!-- A component for displaying authentication errors from URL parameters -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    message?: string;
  }

  let { message }: Props = $props();

  interface AuthErrorMapping {
    [key: string]: {
      title: string;
      description: string;
    };
  }

  // Error mappings for known error codes
  const ERROR_MAPPINGS: AuthErrorMapping = {
    otp_expired: {
      title: 'Link Expired',
      description:
        'The email confirmation link has expired. Please request a new one.',
    },
    access_denied: {
      title: 'Access Denied',
      description: "You don't have permission to access this resource.",
    },
    // Add more error mappings as needed
  };

  let error = $state<string | null>(null);
  let errorCode = $state<string | null>(null);
  let errorDescription = $state<string | null>(null);
  let isVisible = $state(false);

  function parseUrlErrors() {
    const searchParams = new URLSearchParams(window.location.search);
    error = searchParams.get('error');
    errorCode = searchParams.get('error_code');
    const rawDescription = searchParams.get('error_description');
    errorDescription = rawDescription
      ? rawDescription.replace(/\+/g, ' ')
      : null;

    // Only show if there are actual errors
    isVisible = !!(error || errorCode || errorDescription || message);

    // Clean up URL if there are errors
    if (isVisible && !message) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  function dismiss() {
    isVisible = false;
  }

  // Get error details based on error code
  let errorDetails = $derived(
    errorCode
      ? ERROR_MAPPINGS[errorCode] || {
          title: 'Error',
          description: errorDescription || 'An unknown error occurred',
        }
      : null,
  );

  onMount(() => {
    parseUrlErrors();
  });
</script>

{#if isVisible}
  <div
    class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg relative"
    role="alert"
  >
    <button
      onclick={dismiss}
      class="absolute top-4 right-4 text-red-400 hover:text-red-600"
      aria-label="Dismiss error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    {#if message}
      <p class="text-red-700">{message}</p>
    {:else if errorDetails}
      <h3 class="text-red-800 font-semibold mb-2">{errorDetails.title}</h3>
      <p class="text-red-700">{errorDetails.description}</p>
    {:else}
      <p class="text-red-700">
        {errorDescription || 'An unknown error occurred'}
      </p>
    {/if}
  </div>
{/if}
