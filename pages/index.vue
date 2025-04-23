<script lang="ts">
useHead({
    title: "URL Shortener",
    titleTemplate: '%s - OomF',
    meta: [
        { name: 'description', content: 'Learn about OomF, a simple, fast and privacy-friendly URL shortener' }
    ]
})
</script>

<template>
    <main>
        <div class="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center">
            <UCard class="w-[85svw] md:w-[40svw]" variant="subtle">
                <UrlSubmitForm />
            </UCard>
        </div>
    </main>
</template>