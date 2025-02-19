<!-- A modern OTP verification form component using Svelte 5 runes -->
<script lang="ts">
  import type {HTMLFormAttributes} from "svelte/elements";

  export interface OTPVerifyResponse {
    user: {
      id: string;
      email: string;
      // Add other user properties as needed
    };
    message: string;
    error?: string;
  }

  interface Props extends HTMLFormAttributes {
    onVerifySuccess?: (data: OTPVerifyResponse) => void;
    email?: string;
  }

  let {onVerifySuccess, email, ...formProps}: Props = $props();

  let otp = $state("");
  let error = $state<string | null>(null);
  let isLoading = $state(false);
  let isSuccess = $state(false);

  // Derived validation state using the new $derived rune
  let isOTPValid = $derived(otp.length === 6 && /^\d+$/.test(otp));
  let canSubmit = $derived(isOTPValid && !isLoading);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = null;
    isLoading = true;

    try {
      const response = await fetch("/api/auth/token-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token: otp, email}),
      });

      const data = (await response.json()) as OTPVerifyResponse;

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Clear form and show success message
      otp = "";
      isSuccess = true;

      // Notify parent of success with proper typing
      onVerifySuccess?.(data);
    } catch (e) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
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
  <h2 class="text-2xl font-bold mb-6 text-gray-800">Verify Your Email</h2>

  {#if error}
    <div class="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert">
      {error}
    </div>
  {/if}

  {#if isSuccess}
    <div class="mb-4 p-3 bg-green-100 text-green-700 rounded" role="alert">
      <p class="font-medium">Email verified successfully!</p>
      <p class="mt-1">You will be redirected to your account shortly.</p>
    </div>
  {:else}
    {#if email}
      <div class="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
        <p>Please enter the verification code sent to:</p>
        <p class="font-medium">{email}</p>
      </div>
    {/if}

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="otp">
        Verification Code
      </label>
      <input
        type="text"
        id="otp"
        bind:value={otp}
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-mono text-lg"
        placeholder="000000"
        maxlength="6"
        pattern="\d{6}"
        inputmode="numeric"
        required
        aria-invalid={otp ? !isOTPValid : undefined}
        aria-describedby={otp && !isOTPValid ? "otp-error" : undefined}
      />
      {#if otp && !isOTPValid}
        <p id="otp-error" class="mt-1 text-sm text-red-600" role="alert">
          Please enter a valid 6-digit verification code
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
        Verifying...
      {:else}
        Verify Email
      {/if}
    </button>
  {/if}
</form>
