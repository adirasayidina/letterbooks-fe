<script setup>
import { reactive, onMounted, ref, onUnmounted } from "vue";
import axios from "axios";
import { useToast } from 'vue-toastification';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import BookCard from "./BookCard.vue";

const toast = useToast();

const state = reactive({
    books: [],
    isLoading: true,
    currentPage: 1,
    pageSize: 40,
    totalPages: 0,
});

const input = reactive({
    title: '',
    author: ''
})

const handleSubmit = async () => {
    if (input.title.replaceAll(" ", "") !== '' || input.author.replaceAll(" ", "") !== '') {
        fetchBooksFuzzy();
    } else {
        fetchBooks();
    }
}

const fetchBooksFuzzy = async (page = 1) => {
    const inputSearch = {
        page: page,
        limit: state.pageSize,
    }

    if (input.title.replaceAll(" ", "") !== "") {
        inputSearch.title = input.title;
    }

    if (input.author.replaceAll(" ", "") !== "") {
        inputSearch.author = input.author;
    }

    console.log(inputSearch)

    try {
        state.isLoading = true;

        const response = await axios.post('/api/books/search', inputSearch);

        console.log(response)
        state.books = response.data.books;
        state.currentPage = page;
        state.totalPages = response.data.total_pages;
    } catch (error) {
        console.error("Error fetching books", error);
        const errDetail = error.response?.data?.detail || 'Error occurred. Please try again.';
        toast.error(errDetail);
    } finally {
        state.isLoading = false;
    }
}

const fetchBooks = async (page = 1) => {
    try {
        state.isLoading = true;

        const response = await axios.get("/api/books", {
            params: {
                page: page,
                limit: state.pageSize,
            },
        });

        state.books = response.data.books;
        state.currentPage = page;
        state.totalPages = response.data.total_pages;
    } catch (error) {
        console.error("Error fetching books", error);
        const errDetail = error.response?.data?.detail || 'Error occurred. Please try again.';
        toast.error(errDetail);
    } finally {
        state.isLoading = false;
    }
};

const handleNext = async () => {
    if (input.title.trim() !== '' || input.author.trim() !== '') {
        fetchBooksFuzzy(state.currentPage + 1);
    } else {
        fetchBooks(state.currentPage + 1);
    }
}

const showScrollTop = ref(false);

const handleScroll = () => {
    showScrollTop.value = window.scrollY > 300; // show after 300px scroll
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
    fetchBooks(state.currentPage);
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
    <div class="m-10">
        <!-- Loading State -->
        <div v-if="state.isLoading" class="text-center text-black">
            <PulseLoader color="#000000" />
            <p class="mt-2">Loading books</p>
        </div>

        <!-- Books Grid -->
        <div v-else>
            <form>
                <div class="bg-white mb-10">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div class="grid grid-cols-[1fr_1fr_auto] gap-8">

                            <!-- 1st Column -->
                            <div class="flex items-center">
                                <input v-model="input.title" type="text" id="title" name="title"
                                    class="border rounded w-full py-2 px-3" placeholder="title" required />
                            </div>

                            <!-- 2nd Column -->
                            <div class="flex items-center">
                                <input v-model="input.author" type="text" id="author" name="author"
                                    class="border rounded w-full py-2 px-3" placeholder="author" required />
                            </div>

                            <!-- 3rd Column -->
                            <div class="flex items-center">
                                <button @click="handleSubmit" type="submit"
                                    class="bg-black text-white px-4 py-2 rounded">
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>



            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <BookCard v-for="book in state.books" :key="book.ISBN" :book="book" />
            </div>

            <button v-if="showScrollTop" @click="scrollToTop"
                class="pi pi-angle-up fixed bottom-16 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition">
            </button>

            <div
                class="fixed bottom-0 inset-x-0 bg-white border-t border-gray-300 py-3 flex justify-center space-x-3 z-50">
                <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="state.currentPage === 1"
                    @click="fetchBooks(state.currentPage - 1)">
                    Prev
                </button>

                <span class="px-3 py-1">Page {{ state.currentPage }} of {{ state.totalPages }}</span>

                <button class="px-3 py-1 border rounded disabled:opacity-50"
                    :disabled="state.currentPage === state.totalPages" @click="handleNext"> Next
                </button>

            </div>
        </div>
    </div>
</template>
