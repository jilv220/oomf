<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

interface Props {
    shortUrl: string
    statsUrl: string
    qrDataUrl: string
    socialItems: DropdownMenuItem[]
    downloadQR: () => void
}

defineProps<Props>()
</script>

<template>
    <div class="flex gap-1">
        <UButton icon="i-lucide-external-link" size="md" class="w-fit" :to="shortUrl" :external="true"
            target="_blank" />

        <UButton icon="i-lucide-chart-line" size="md" class="w-fit" :to="statsUrl" :external="true" target="_blank" />

        <UPopover :content="{ align: 'center', side: 'bottom', sideOffset: 8 }" arrow>
            <UButton icon="i-lucide-qr-code" size="md" class="w-fit">
                QR
            </UButton>

            <template #content>
                <div class="flex flex-col items-center gap-2 p-2">
                    <NuxtImg width="110px" height="110px" :src="qrDataUrl" alt="QR Code to shortened URL" />
                    <UButton size="sm" icon="i-lucide-download" class="w-full" @click="downloadQR">
                        Download
                    </UButton>
                </div>
            </template>
        </UPopover>

        <UDropdownMenu :content="{ align: 'center', side: 'bottom', sideOffset: 8 }" arrow :items="socialItems">
            <UButton icon="i-lucide-share-2" size="md" class="w-fit">
                Share
            </UButton>
        </UDropdownMenu>

        <slot name="trailing"></slot>
    </div>
</template>