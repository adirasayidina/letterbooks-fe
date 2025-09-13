<script setup>
import logo from '@/assets/books-login.png'
import logo2 from '@/assets/books.png'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { reactive, onMounted, computed } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import AuthForm from '@/components/AuthForm.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const type = computed(() => route.params.type)

console.log(type)
</script>

<template>
    <div class="min-h-[calc(100vh-5rem)] bg-white flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                <!-- Left Column -->
                <div>
                    <div class="flex flex-1 items-center">
                        <img class="h-85 w-auto" :src="[type === 'login' ? logo : logo2]" alt="LetterBooks" />
                    </div>
                </div>

                <!-- Right Column -->
                <div>
                    <AuthForm :type="type"/>
                </div>

            </div>
        </div>
    </div>
</template>
