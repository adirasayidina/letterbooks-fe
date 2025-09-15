<script setup>
import { computed } from "vue";

const props = defineProps({
    rating: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        default: 5
    }
});

const emit = defineEmits(["update:rating"]);

const setRating = (value) => {
    emit("update:rating", value);
};

const stars = computed(() => {
    const full = Math.floor(props.rating);
    const half = props.rating % 1 >= 0.5 ? 1 : 0;
    const empty = props.max - full - half;
    return { full, half, empty };
});
</script>

<template>
    <div class="flex items-center space-x-1 text-yellow-600">
        <!-- Full stars -->
        <i v-for="n in stars.full" :key="'full-' + n" class="pi pi-star-fill cursor-pointer" @click="setRating(n)"></i>

        <!-- Half star -->
        <i v-if="stars.half" class="pi pi-star-half cursor-pointer" @click="setRating(stars.full + 0.5)"></i>

        <!-- Empty stars -->
        <i v-for="n in stars.empty" :key="'empty-' + n" class="pi pi-star cursor-pointer"
            @click="setRating(stars.full + stars.half + n)"></i>
    </div>
</template>
