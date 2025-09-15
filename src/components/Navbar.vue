<script setup>
import logo from '@/assets/book-navbar.png'
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { jwtDecode } from "jwt-decode";
import router from '@/router';

const authStore = useAuthStore();
const route = useRoute();

const isLoggedIn = computed(() => !!authStore.accessKey);

const username = computed(() => {
    if (!authStore.accessKey) return null;
    try {
        const decoded = jwtDecode(authStore.accessKey);
        return decoded.username || decoded.sub || "User";
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
});

const isActiveLink = (routePath) => {
    return route.path === routePath;
};

const logout = () => {
    authStore.accessKey = null; 
    authStore.user = null;
    router.push("/");
};
</script>

<template>
    <nav class="fixed top-0 left-0 w-full bg-white border-b border-black z-50">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="flex h-20 items-center justify-between">

                <!-- Left Column: Logo -->
                <div class="flex flex-1 items-center">
                    <RouterLink class="flex flex-shrink-0 items-center" to="/">
                        <img class="h-14 w-14" :src="logo" alt="LetterBooks" />
                        <span class="hidden md:block text-black">
                            LetterBooks
                        </span>
                    </RouterLink>
                </div>

                <!-- Right Column: Buttons -->
                <div class="flex space-x-2">
                    <RouterLink to="/" :class="[isActiveLink('/') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Home
                    </RouterLink>

                    <!-- Login if not -->
                    <RouterLink v-if="!isLoggedIn" to="/auth/login" :class="[isActiveLink('/auth/login') || isActiveLink('/auth/signup') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Login
                    </RouterLink>

                    <!-- Username if logged in -->
                    <RouterLink v-if="isLoggedIn" to="/" :class="[isActiveLink('/auth') || isActiveLink('/auth/signup') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Hi, {{ username }}
                    </RouterLink>

                    <button v-if="isLoggedIn" @click="logout" :class="[isActiveLink('/auth') || isActiveLink('/auth/signup') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div class="pt-20">
        <slot />
    </div>
</template>
