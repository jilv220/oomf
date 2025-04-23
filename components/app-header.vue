<script setup lang="ts">
const { appName } = useAppConfig()
</script>

<template>
    <header class="sticky top-0 z-50 w-full border-border border-b h-[var(--header-height)]">
        <div class="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
            <div class="flex-grow">
                <nav class="flex items-center font-medium text-3xl md:justify-start">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <span>{{ appName }}</span>
                    </NuxtLink>
                </nav>
            </div>

            <div class="flex items-center space-x-4">
                <UButton variant="ghost" color="neutral" to="/about" class="flex">
                    About
                </UButton>
            </div>
        </div>
    </header>
</template>
