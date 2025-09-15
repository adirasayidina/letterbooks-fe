import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import BookDetailView from "@/views/BookDetailView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/auth/:type',
            name: 'auth',
            component: AuthView,
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore();
                if (authStore.accessKey) {
                    next('/');
                } else {
                    next();
                }
            }
        },
        {
            path: '/book/:isbn',
            name: 'book-detail',
            component: BookDetailView,
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView,
        },
    ]
})

export default router;
