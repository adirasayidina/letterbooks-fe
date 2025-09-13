<script setup>
// import logo from '@/assets/logo.png'
import logo from '@/assets/book-navbar.png'
import { RouterLink, useRoute } from 'vue-router';

const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
}
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
                    <RouterLink to="/auth/login" :class="[isActiveLink('/auth/login') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Login
                    </RouterLink>
                    <RouterLink to="/auth/signup" :class="[isActiveLink('/auth/signup') ? 'bg-black text-white' : 'hover:bg-gray-400 hover:text-white text-black',
                        'px-3', 'py-2', 'rounded-md', 'border border-black']">
                        Sign Up
                    </RouterLink>
                </div>

            </div>
        </div>
    </nav>

    <div class="pt-20">
        <slot />
    </div>
</template>
