<script lang="ts">
  import {onMount} from "svelte";
  import AuthError from "./AuthError.svelte";
  import type {HTMLAttributes} from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    accessToken: string;
    type: string;
    onAuthSuccess: (data: {user: any; message: string}) => void;
  }

  let {accessToken, type, onAuthSuccess}: Props = $props();

  let error = $state<string | null>(null);
  let isLoading = $state(true);

  async function verifyToken() {
    try {
      const response = await fetch("/api/auth/token-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
          type: type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify token");
      }

      onAuthSuccess(data);
      window.location.href = "/";
    } catch (e) {
      error =
        e instanceof Error
          ? e.message
          : "An error occurred during authentication";
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    verifyToken();
  });
</script>

{#if isLoading}
  <div class="flex justify-center items-center p-4">
    <p class="text-lg">Signing you in...</p>
  </div>
{:else if error}
  <AuthError message={error} />
{/if}
