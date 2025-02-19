<script lang="ts">
  let pathname = $state('');

  // Update pathname on mount and when navigation occurs
  $effect(() => {
    pathname = window.location.pathname;

    // Update pathname when navigation occurs
    const handleNavigation = () => {
      pathname = window.location.pathname;
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  });
</script>

<nav class="bg-gray-800">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <span class="text-white text-xl font-bold">🧠 Second Brain</span>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a
              href="/home"
              class={`${
                pathname === '/home'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } rounded-md px-3 py-2 text-sm font-medium`}
            >
              Dashboard
            </a>
            <a
              href="/admin"
              class={`${
                pathname === '/admin'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } rounded-md px-3 py-2 text-sm font-medium`}
            >
              Users
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  <div class="md:hidden">
    <div class="space-y-1 px-2 pb-3 pt-2">
      <a
        href="/home"
        class={`${
          pathname === '/home'
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        } block rounded-md px-3 py-2 text-base font-medium`}
      >
        Dashboard
      </a>
      <a
        href="/admin"
        class={`${
          pathname === '/admin'
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        } block rounded-md px-3 py-2 text-base font-medium`}
      >
        Users
      </a>
    </div>
  </div>
</nav>
