<script lang="ts">
  interface User {
    id: string;
    email: string;
    created_at: string;
  }

  interface Props {
    currentUserEmail: string;
  }

  let { currentUserEmail }: Props = $props();
  let users = $state<User[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  async function fetchUsers() {
    try {
      loading = true;
      error = null;
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      users = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to fetch users';
    } finally {
      loading = false;
    }
  }

  async function deleteUser(id: string) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      // Remove user from the list
      users = users.filter((user) => user.id !== id);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to delete user';
    }
  }

  // Initial fetch
  fetchUsers();
</script>

<div class="w-full max-w-4xl mx-auto">
  {#if loading}
    <div class="flex justify-center p-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>
  {:else if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <span class="block sm:inline">{error}</span>
    </div>
  {:else if users.length === 0}
    <div class="text-center py-8 text-gray-600">No users found</div>
  {:else}
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Email</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Created At</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Actions</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each users as user (user.id)}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{user.email}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  onclick={() => deleteUser(user.id)}
                  class="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={user.email === currentUserEmail}
                  title={user.email === currentUserEmail
                    ? 'You cannot delete your own account'
                    : 'Delete user'}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
