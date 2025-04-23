<script setup lang="ts">
definePageMeta({
    middleware: 'redirect',
});

const route = useRoute();
const shortCode = route.params.shortCode as string;

// Set SEO metadata
useSeoMeta({
    title: 'Redirecting...',
    robots: 'noindex, nofollow',
});

// This page doesn't actually render - the middleware handles the redirect
</script>

<template>
    <div class="flex min-h-screen items-center justify-center">
        <UCard class="w-[85svw] md:w-[40svw]" variant="subtle">
            <p class="text-center text-xl">Redirecting...</p>
            <UProgress class="mt-4" indeterminate />
        </UCard>
    </div>
</template>