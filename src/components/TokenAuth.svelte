<script lang="ts">
  import {onMount} from "svelte";
  import AuthError from "./AuthError.svelte";

  export let accessToken: string;
  export let refreshToken: string;
  export let expiresIn: number;
  export let expiresAt: number;
  export let tokenType: string;
  export let type: string;
  export let onAuthSuccess: (data: {user: any; message: string}) => void;

  let error: string | null = null;
  let isLoading = true;

  async function verifyToken() {
    try {
      const response = await fetch("/api/auth/token-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
          expires_at: expiresAt,
          token_type: tokenType,
          type: type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify token");
      }

      onAuthSuccess(data);
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
