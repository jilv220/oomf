<script setup lang="ts">
const { appName } = useAppConfig()

</script>

<template>
    <header class="sticky top-0 z-50 w-full border-border border-b bg-primary/95 h-[var(--header-height)]">
        <div class="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
            <div class="flex-grow">
                <nav class="flex items-center space-x-2 font-medium text-3xl text-muted-foreground md:justify-start">
                    {{ appName }}
                </nav>
            </div>
        </div>
    </header>
</template>
