<script setup lang="ts">
const route = useRoute();
const shortCode = route.params.shortCode as string;
const toast = useToast();
const origin = ref(''); // Store the origin

useHead({
    title: `Stats for ${shortCode}`,
    meta: [
        { name: 'description', content: 'View statistics for your shortened URL' },
        { name: 'robots', content: 'noindex' },
    ],
});

// Determine origin based on environment (SSR or client-side)
if (import.meta.client) {
    origin.value = window.location.origin;
} else {
    const requestUrl = useRequestURL();
    origin.value = requestUrl.origin;
}

const { data: url, error } = await useFetch(`/api/stats/${shortCode}`, {
    key: `stats-${shortCode}`,
    lazy: true
})

// Format date for display
function formatDate(timestamp: Date | string) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

// Copy URL to clipboard
async function copyUrl(url: string) {
    try {
        await navigator.clipboard.writeText(url);
        toast.add({
            title: 'Copied!',
            description: 'URL copied to clipboard',
            color: 'success',
            duration: 2000,
        });
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Failed to copy URL',
            color: 'error',
        });
    }
}
</script>

<template>
    <main>
        <div
            class="flex flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center">
            <h1 class="text-2xl font-bold mb-6">URL Statistics</h1>

            <div v-if="error?.statusCode === 404" class="text-center py-8">
                <p class="mb-6">The shortened URL you're looking for doesn't exist.</p>
                <UButton to="/" color="primary">Create a New Short URL</UButton>
            </div>

            <div v-else-if="url">
                <UCard class="mb-6">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-semibold">Shortened URL</h2>
                            <UButton color="primary" variant="ghost" icon="i-heroicons-clipboard"
                                @click="copyUrl(`${origin}/${url.shortCode}`)" />
                        </div>
                    </template>

                    <div class="grid gap-4">
                        <div class="flex flex-col">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Short URL</span>
                            <div class="flex items-center mt-1">
                                <ULink :to="`/${url.shortCode}`" target="_blank"
                                    class="text-white hover:text-primary-400">
                                    {{ origin }}/{{ url.shortCode }}
                                </ULink>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Original URL</span>
                            <div class="flex items-center mt-1">
                                <ULink :to="url.longUrl" target="_blank" class="break-all" external>
                                    {{ url.longUrl }}
                                </ULink>
                                <UButton size="xs" variant="ghost" icon="i-heroicons-clipboard" class="ml-2"
                                    @click="copyUrl(url.longUrl)" />
                            </div>
                        </div>
                    </div>
                </UCard>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <UCard>
                        <div class="text-center">
                            <div class="text-3xl font-bold">{{ url.clicks }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Total Clicks</div>
                        </div>
                    </UCard>

                    <UCard>
                        <div class="text-center">
                            <div class="text-sm">Created</div>
                            <div class="text-sm mt-1">{{ formatDate(url.createdAt) }}</div>
                        </div>
                    </UCard>

                    <UCard>
                        <div class="text-center">
                            <div class="text-sm">Last Click</div>
                            <div class="text-sm mt-1">{{ formatDate(url.updatedAt) }}</div>
                        </div>
                    </UCard>
                </div>

                <div class="flex justify-center">
                    <UButton to="/" color="primary">Create Another URL</UButton>
                </div>
            </div>
        </div>
    </main>
</template>