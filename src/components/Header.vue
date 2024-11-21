<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      // dati qui
    }
  }
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <span class="text-lg font-medium text-gray-800">Social Dev</span>
        </div>

        <!-- Menu di navigazione -->
        <nav class="hidden md:block">
          <ul class="flex space-x-8">
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Chi Siamo</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Servizi</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Contatti</a>
            </li>
          </ul>
        </nav>

        <!-- Pulsante di azione -->
        <div class="flex items-center space-x-2">
          <button class="bg-transparent text-gray-600 px-4 py-1.5 rounded-md text-sm font-medium hover:text-gray-900 transition-colors">
            Registrati
          </button>
          <button class="bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Accedi
          </button>
        </div>
      </div>
    </div>
  </header>
</template> 