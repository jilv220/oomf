<script setup lang="ts">
const page = ref(1);
const origin = useOrigin();

const { data, refresh } = await useFetch('/api/shorten', {
    query: { page, limit: 4 },
    lazy: true,
    server: false,
    key: "url-history",
});

const onPageChange = (newPage: number) => {
    page.value = newPage;
};

const onDrawerClose = () => {
    page.value = 1
    refresh()
}

</script>

<template>
    <UDrawer :ui="{
        body: 'min-w-[40svw]'
    }" direction="right" :handle="false" :handle-only="true" title="Your Recent Shortens" @close="onDrawerClose">
        <UButton color="neutral" variant="ghost">
            My URLs
        </UButton>
        <template #description></template>
        <template #body>
            <div v-if="!data?.urls.length" class="p-4 text-center">
                No shortened URLs yet
            </div>

            <div v-else class="space-y-2">
                <div v-for="url in data.urls" :key="url.shortCode">
                    <UrlHistoryItem :url="url" :origin="origin" />
                </div>
            </div>

            <div v-if="data && data.pagination.totalPages > 1" class="p-4 justify-items-center">
                <UPagination v-model:page="page" :items-per-page="data.pagination.limit" :total="data.pagination.total"
                    :ui="{ wrapper: 'flex justify-center' }" @update:page="onPageChange" />
            </div>
        </template>
    </UDrawer>
</template>