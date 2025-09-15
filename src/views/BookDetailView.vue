<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";
import StarRating from "@/components/StarRating.vue";
import BookReview from "@/components/BookReview.vue";

const route = useRoute();
const toast = useToast();

const state = reactive({
    book: null,
    isLoading: true,
});

const fetchBook = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get(`/api/books/${route.params.isbn}`);
        state.book = response.data;
    } catch (error) {
        console.error("Error fetching book", error);
        const errDetail = error.response?.data?.detail || "Error occurred.";
        toast.error(errDetail);
    } finally {
        state.isLoading = false;
    }
};

onMounted(() => {
    fetchBook();
});
</script>


<template>
    <div class="p-8">
        <div v-if="state.isLoading" class="text-center">Loading book...</div>

        <div v-else-if="state.book" class="flex justify-center">
            <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8 mb-12 items-center md:items-start p-4">

                <img :src="state.book['Image-URL-L']" :alt="state.book['Book-Title']"
                    class="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto rounded shadow object-contain" />

                <div class="flex-1 text-center md:text-left">
                    <h1 class="text-3xl font-bold mb-2">{{ state.book["Book-Title"] }}</h1>
                    <p class="text-lg text-gray-700 mb-1">
                        <strong>ISBN:</strong> {{ state.book["ISBN"] }}
                    </p>
                    <p class="text-lg text-gray-700 mb-1">
                        <strong>Author:</strong> {{ state.book["Book-Author"] }}
                    </p>
                    <p class="text-lg text-gray-700 mb-1">
                        <strong>Publisher:</strong> {{ state.book["Publisher"] }}
                    </p>
                    <p class="text-lg text-gray-700 mb-1">
                        <strong>Year:</strong> {{ state.book["Year-Of-Publication"] }}
                    </p>

                    <BookReview :isbn="`state.book.isbn`"></BookReview>
                </div>
            </div>
        </div>
    </div>
</template>
