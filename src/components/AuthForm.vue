<script setup>
import { RouterLink } from 'vue-router';
import { reactive, defineProps, onMounted, ref } from 'vue';
import axios from 'axios';

defineProps({
    type: String
});

const user = reactive({
    username: '',
    password: ''
})

const errors = reactive({
    username: ''
})

const showPassword = ref(false)

const validateUsername = () => {
    const regex = /^[a-zA-Z0-9_]*$/
    if (!regex.test(user.username)) {
        user.username = event.target.value.replace(/[^a-zA-Z0-9_]/g, '')
        errors.username = 'Username can only contain letters, numbers, and underscores (no spaces or special characters).'
    } else {
        errors.username = ''
    }
}

</script>

<template>
    <div v-if="type === 'login'">
        <h2 class="text-xl font-bold mb-4">Log In</h2>
        <p>
            Welcome Back
        </p>
    </div>

    <div v-if="type === 'signup'">
        <h2 class="text-xl font-bold mb-4">Sign Up</h2>
        <p>
            Create an Account
        </p>
    </div>

    <br />
    <form>
        <!-- Username -->
        <div class="mb-4">
            <label for="name" class="block text-gray-700 mb-2">Username</label>
            <input @input="validateUsername" v-model="user.username" type="text" id="name" name="name"
                class="border rounded w-full py-2 px-3 mb-2" placeholder="eg. calista" required />
            <p v-if="errors.username" class="text-red-500 text-sm">
                {{ errors.username }}
            </p>
        </div>

        <!-- Password -->
        <div class="mb-4 relative">
            <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-gray-700">Password</label>
                <button type="button" @mousedown="showPassword = true" @mouseup="showPassword = false"
                    @mouseleave="showPassword = false" @touchstart.prevent="showPassword = true"
                    @touchend.prevent="showPassword = false" class="text-sm text-gray-700 hover:underline">
                    {{ showPassword ? 'Hide' : 'Show' }}
                </button>
            </div>
            <input v-model="user.password" :type="showPassword ? 'text' : 'password'" id="password" name="password"
                class="border rounded w-full py-2 px-3 mb-2 pr-10" placeholder="Enter your password" required />
            <p class="text-gray-400 text-sm">
                Use 8 or more characters with a mix of letters and numbers
            </p>
        </div>
    </form>
    <br />
    
    <!-- button -->
    <button type="submit" class="w-50 bg-black text-white py-2 px-3 rounded-md hover:bg-gray-800 transition">
        {{ type === 'login' ? 'Log In' : 'Sign Up' }}
    </button>
</template>