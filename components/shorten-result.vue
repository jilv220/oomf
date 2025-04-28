<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
    url: string
}>()

const { copy, copied } = useClipboard({ source: props.url, copiedDuring: 2000 })

</script>

<template>
    <UInput class="flex-grow" :ui="{ trailing: 'pr-0.5' }" name="shortUrl" :model-value="url">
        <template #trailing>
            <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                    @click="copy(url)" />
            </UTooltip>
        </template>
    </UInput>
</template>
