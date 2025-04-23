<script setup lang="ts">
const route = useRoute();
const shortCode = route.params.shortCode as string;
const toast = useToast();
const isLoading = ref(true);
const urlData = ref(null);
const notFound = ref(false);
const origin = ref(''); // Store the origin

useHead({
    title: `Stats for ${shortCode}`,
    meta: [
        { name: 'description', content: 'View statistics for your shortened URL' },
        { name: 'robots', content: 'noindex' }
    ]
});

// Get the origin in a way that works for SSR
if (import.meta.client) {
    // Client-side: Use window.location.origin
    origin.value = window.location.origin;
} else {
    // Server-side: Use useRequestURL to get the origin
    const requestUrl = useRequestURL();
    origin.value = requestUrl.origin;
}

// Fetch URL stats
async function fetchUrlStats() {
    isLoading.value = true;
    try {
        const response = await $fetch(`/api/stats/${shortCode}`);

        if (!response.success || !response.data) {
            console.log('Invalid response structure:', response);
            notFound.value = true;
            return;
        }

        urlData.value = response.data;
    } catch (error) {
        console.error('Error fetching URL stats:', error);
        toast.add({
            title: 'Error',
            description: 'Failed to load URL statistics',
            color: 'error'
        });
        notFound.value = true;
    } finally {
        isLoading.value = false;
        console.log('State:', { isLoading: isLoading.value, notFound: notFound.value, shortCode });
    }
}

// Format date for display
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Copy URL to clipboard
async function copyUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        toast.add({
            title: 'Copied!',
            description: 'URL copied to clipboard',
            color: 'success',
            duration: 2000
        });
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Failed to copy URL',
            color: 'error'
        });
    }
}

// Load data on page mount
onMounted(() => {
    fetchUrlStats();
});
</script>

<template>
    <main>
        <div
            class="flex flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center">
            <h1 class="text-2xl font-bold mb-6">URL Statistics</h1>

            <UCard v-if="isLoading" class="p-6">
                <p class="text-center mt-4">Loading URL statistics...</p>
            </UCard>

            <div v-else-if="notFound" class="text-center py-8">
                <p class="mb-6">The shortened URL you're looking for doesn't exist.</p>
                <UButton to="/" color="primary">Create a New Short URL</UButton>
            </div>

            <div v-else-if="urlData">
                <UCard class="mb-6">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-semibold">Shortened URL</h2>
                            <UButton color="primary" variant="ghost" icon="i-heroicons-clipboard"
                                @click="copyUrl(`${origin}/${urlData.shortCode}`)" />
                        </div>
                    </template>

                    <div class="grid gap-4">
                        <div class="flex flex-col">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Short URL</span>
                            <div class="flex items-center mt-1">
                                <ULink :to="`/${urlData.shortCode}`" target="_blank" class="text-primary">
                                    {{ origin }}/{{ urlData.shortCode }}
                                </ULink>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Original URL</span>
                            <div class="flex items-center mt-1">
                                <ULink :to="urlData.longUrl" target="_blank" class="break-all" external>
                                    {{ urlData.longUrl }}
                                </ULink>
                                <UButton size="xs" variant="ghost" icon="i-heroicons-clipboard" class="ml-2"
                                    @click="copyUrl(urlData.longUrl)" />
                            </div>
                        </div>
                    </div>
                </UCard>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <UCard>
                        <div class="text-center">
                            <div class="text-3xl font-bold">{{ urlData.clicks }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Total Clicks</div>
                        </div>
                    </UCard>

                    <UCard>
                        <div class="text-center">
                            <div class="text-sm">Created</div>
                            <div class="text-sm mt-1">{{ formatDate(urlData.createdAt) }}</div>
                        </div>
                    </UCard>

                    <UCard>
                        <div class="text-center">
                            <div class="text-sm">Last Click</div>
                            <div class="text-sm mt-1">{{ formatDate(urlData.updatedAt) }}</div>
                        </div>
                    </UCard>
                </div>

                <div class="flex justify-center">
                    <UButton to="/" color="primary">Create Another URL</UButton>
                </div>
            </div>
        </div>
    </main>
</template>/template>