<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
const props = defineProps({
    book: Object
});
</script>

<template>
    <RouterLink :to="`/book/${book.ISBN}`"
        class="border rounded-lg p-4 shadow hover:shadow-lg w-[300px] flex flex-col items-center cursor-pointer">
        <!-- Image -->
        <img :src="book['Image-URL-L']" :alt="book['Book-Title']" class="h-80 w-auto object-cover mb-2" />

        <!-- Text -->
        <h3 class="font-semibold break-words text-center">{{ book["Book-Title"] }}</h3>
        <p class="text-sm text-gray-600 text-center">{{ book["Book-Author"] }}</p>
        <p class="text-xs text-gray-400 text-center">{{ book["Year-Of-Publication"] }}</p>
    </RouterLink>
</template>
