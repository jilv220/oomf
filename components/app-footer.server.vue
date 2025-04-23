<script setup lang="ts">
const { appName } = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
    <footer class="border-t bg-primary/95 py-6 md:px-8 md:py-0">
        <div
            class="container flex flex-col items-center justify-between gap-4 px-4 md:h-[var(--footer-height)] md:flex-row md:justify-end md:px-8">
            <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p class="text-center text-muted-foreground text-sm leading-loose md:text-right">
                    © {{ year }} {{ appName }}. The source code is available
                    on
                    <ULink to="https://github.com/jilv220/oomf" target="_blank" rel="noreferrer"
                        class="font-medium underline underline-offset-4">
                        GitHub</ULink>
                    .
                </p>
            </div>
        </div>
    </footer>
</template>