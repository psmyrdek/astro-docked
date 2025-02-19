<script lang="ts">
  import {onMount} from "svelte";
  import AuthError from "./AuthError.svelte";
  import type {HTMLAttributes} from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    onAuthSuccess: (data: {user: any; message: string}) => void;
  }

  let {onAuthSuccess}: Props = $props();

  let error = $state<string | null>(null);
  let isLoading = $state(true);
  let accessToken = $state<string | null>(null);

  function getHashParams() {
    const hashParams = new URLSearchParams(
      window.location.hash ? window.location.hash.substring(1) : ""
    );
    accessToken = hashParams.get("access_token");
  }

  async function verifyToken() {
    try {
      const response = await fetch("/api/auth/token-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify token");
      }

      onAuthSuccess(data);
      window.location.href = "/home";
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
    getHashParams();
    if (accessToken) {
      verifyToken();
    } else {
      isLoading = false;
    }
  });
</script>

{#if accessToken}
  {#if isLoading}
    <div class="flex justify-center items-center p-4">
      <p class="text-lg">Signing you in...</p>
    </div>
  {:else if error}
    <AuthError message={error} />
  {/if}
{/if}
