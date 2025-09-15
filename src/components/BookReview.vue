<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";
import StarRating from "@/components/StarRating.vue";
import { useAuthStore } from "@/stores/auth";
import { jwtDecode } from "jwt-decode";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const state = reactive({
    reviews: [],
    isLoading: true,
    page: 1,
    limit: 3,
    totalPages: 1,
});

const isLoggedIn = () => {
    return !!authStore.accessKey;
};

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

const openReviewForm = () => {
    if (isLoggedIn()) {
        showReviewForm.value = true;
    } else {
        showLoginPopup.value = true;
    }
};

const openEditForm = (rating, comment, reviewId) => {
    if (isLoggedIn()) {
        reviewForm.rating = rating;
        reviewForm.comment = comment;
        reviewForm.reviewId = reviewId;
        showReviewForm.value = true;
    } else {
        showLoginPopup.value = true;
    }
};

// submit review
const submitReview = async () => {
    try {
        if (!authStore.accessKey) {
            toast.error("You must be logged in.");
            return;
        }

        await axios.post(
            `/api/reviews/create`,
            {
                book_id: route.params.isbn,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            },
            {
                headers: { Authorization: `Bearer ${authStore.accessKey}` },
            }
        );

        toast.success("Review submitted!");
        showReviewForm.value = false;
        reviewForm.rating = 0;
        reviewForm.comment = "";
        fetchReviews(state.page);
    } catch (error) {
        console.error("Error submitting review", error);
        const errDetail = error.response?.data?.detail || "Failed to submit review.";
        toast.error(errDetail);
    }
};

const fetchReviews = async (page = 1) => {
    try {
        state.isLoading = true;
        const response = await axios.get(`/api/reviews/book/${route.params.isbn}`, {
            params: { page, limit: state.limit },
        });
        state.reviews = response.data.reviews;
        state.page = response.data.page;
        state.totalPages = response.data.total_pages;
    } catch (error) {
        console.error("Error fetching reviews", error);
        const errDetail = error.response?.data?.detail || "Error loading reviews.";
        toast.error(errDetail);
    } finally {
        state.isLoading = false;
    }
};

const editReview = async (reviewId) => {
    try {
        if (!authStore.accessKey) {
            toast.error("You must be logged in.");
            return;
        }

        await axios.put(
            `/api/reviews/edit/${reviewId}`,
            {
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            },
            {
                headers: { Authorization: `Bearer ${authStore.accessKey}` }, // ✅ from store
            }
        );

        toast.success("Review updated!");
        showReviewForm.value = false;
        reviewForm.rating = 0;
        reviewForm.comment = "";
        fetchReviews(state.page);
    } catch (error) {
        console.error("Error updating review", error);
        const errDetail = error.response?.data?.detail || "Failed to submit review.";
        toast.error(errDetail);
    }
};


const nextPage = () => {
    if (state.page < state.totalPages) {
        fetchReviews(state.page + 1);
    }
};

const prevPage = () => {
    if (state.page > 1) {
        fetchReviews(state.page - 1);
    }
};

const showReviewForm = ref(false);
const showLoginPopup = ref(false);

const reviewForm = reactive({
    rating: 0,
    comment: "",
    reviewId: ""
});

onMounted(() => {
    fetchReviews();
});
</script>

<template>
    <div class="mt-8">
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-2xl font-semibold">Reviews</h2>
            <button @click="openReviewForm"
                class="px-4 py-2 hover:bg-gray-400 hover:text-white text-black border border-black rounded-md">
                Write a Review
            </button>
        </div>

        <div v-if="state.isLoading" class="text-center text-gray-500">
            <PulseLoader color="#000000" />
            Loading review...
        </div>

        <div v-else>
            <div v-if="state.reviews.length === 0" class="text-gray-500">
                No reviews yet.
            </div>

            <ul v-else class="space-y-4">
                <li v-for="review in state.reviews" :key="review.id" class="border p-4 rounded shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold">{{ review.user_id }}</span>
                        <StarRating :rating="review.rating" />
                    </div>
                    <p>{{ review.comment }}</p>
                    <div class="flex justify-between items-center mb-2">
                        <p class="text-xs text-gray-400 mt-1">
                            {{ new Date(review.created_at).toLocaleString() }}
                        </p>
                        <button v-if="isLoggedIn() && review.user_id === username" @click="openEditForm(review.rating, review.comment, review.id)"
                            class="text-gray-700 hover:text-gray-400 underline">Edit</button>
                    </div>
                </li>
            </ul>

            <!-- Pagination -->
            <div v-if="state.totalPages > 1" class="flex justify-center space-x-2 mt-6">
                <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="state.page === 1"
                    @click="prevPage">
                    Prev
                </button>

                <span class="px-3 py-1">Page {{ state.page }} of {{ state.totalPages }}</span>

                <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="state.page === state.totalPages"
                    @click="nextPage">
                    Next
                </button>
            </div>
        </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded p-6 w-full max-w-md shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Write a Review</h3>
            <div class="mb-4">
                <label class="block mb-1">Rating:</label>
                <StarRating v-model:rating="reviewForm.rating" />
            </div>
            <div class="mb-4">
                <label class="block mb-1">Comment:</label>
                <textarea v-model="reviewForm.comment" rows="3" class="w-full border rounded p-2"></textarea>
            </div>
            <div class="flex justify-end space-x-2">
                <button @click="showReviewForm = false"
                    class="px-4 py-2 hover:bg-gray-400 hover:text-white text-black border border-black rounded-md">Cancel</button>
                <button @click="reviewForm.reviewId === '' ? submitReview() : editReview(reviewForm.reviewId)"
                    class="px-4 py-2 hover:bg-gray-400 hover:text-white text-black border border-black rounded-md">
                    {{ reviewForm.reviewId === '' ? 'Post' : 'Update' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded p-6 w-full max-w-sm shadow-lg text-center">
            <h3 class="text-lg font-semibold mb-2">Login Required</h3>
            <p class="mb-4">You must be logged in to write a review.</p>
            <div class="flex justify-center space-x-2">
                <button @click="showLoginPopup = false" class="px-4 py-2 border rounded">Close</button>
                <button @click="router.push('/auth/login')"
                    class="px-4 py-2 hover:bg-gray-400 hover:text-white text-black border border-black rounded-md">Login</button>
            </div>
        </div>
    </div>
</template>