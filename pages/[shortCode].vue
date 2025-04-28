<script setup lang="ts">
definePageMeta({
    middleware: 'redirect',
});

const route = useRoute();
const shortCode = route.params.shortCode as string;
const origin = useOrigin()

// Is this actually doing anything??
useSeoMeta({
    title: 'Shortened URL',
    description: 'A shortened URL created with our service.',
    ogTitle: 'Shortened URL',
    ogDescription: 'A shortened URL created with our service.',
    ogUrl: `https://${origin}/${shortCode}`,
    ogType: 'website',
    robots: "noindex"
})

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