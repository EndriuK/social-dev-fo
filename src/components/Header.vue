<script>
import { useAuthStore } from '../stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const showDropdown = ref(false)

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
      showDropdown.value = false
    }

    return {
      authStore,
      showDropdown,
      handleLogout
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
              <router-link to="/" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</router-link>
            </li>
            <li>
              <router-link to="/profile" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Profilo</router-link>
            </li>
            <li>
              <router-link to="/services" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Servizi</router-link>
            </li>
            <li>
              <router-link to="/contacts" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Contatti</router-link>
            </li>
          </ul>
        </nav>

        <!-- Authentication Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Show these buttons when not authenticated -->
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/registration">
              <button class="bg-transparent text-gray-600 px-4 py-1.5 rounded-md text-sm font-medium hover:text-gray-900 transition-colors">
                Registrati
              </button>
            </router-link>
            <router-link to="/login">
              <button class="bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Accedi
              </button>
            </router-link>
          </template>

          <!-- Show profile dropdown when authenticated -->
          <div v-else class="relative">
            <button 
              @click="showDropdown = !showDropdown"
              class="flex items-center space-x-2 bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
              <span>Profilo</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <router-link 
                to="/profile/settings" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false">
                Impostazioni
              </router-link>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Add any additional styles here */
</style>
