<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center h-96">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-7xl mb-5"></i>
        <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
        <p class="text-xl mb-5">This page does not exist</p>
        <RouterLink to="/"
            class="w-50 bg-white text-black py-2 px-3 rounded-md border border-black hover:bg-gray-400 hover:text-white transition">
            Go Back
        </RouterLink>
    </section>
</template>