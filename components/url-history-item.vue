<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import type { Url } from '~/server/utils/drizzle';

const props = defineProps<{
    origin: string
    url: Omit<Url, "id" | "updatedAt" | "userId" | "createdAt" | "expiresAt"> & {
        createdAt: string,
        expiresAt: string | null
    }
}>()

const shortUrl = ref(`${props.origin}/${props.url.shortCode}`)
const statsUrl = ref(`${props.origin}/stats/${props.url.shortCode}`)
const toast = useToast()
const { items: socialItems } = useSocialShare({
    url: shortUrl,
    text: 'Share this link with OomF!',
})

const { qrDataUrl, downloadQR } =
    await useQR(
        shortUrl,
        toRef(() => `${props.url.shortCode}-qr.png`)
    )

const copyUrl = async () => {
    const url = `${props.origin}/${props.url.shortCode}`;
    await navigator.clipboard.writeText(url);
    toast.add({
        title: 'Copied!',
        description: 'URL copied to clipboard',
        color: 'success',
        duration: 2000,
    });
};

const formatTimeAgo = (date: Date | string | null) => {
    if (!date) return "permanent"
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

</script>

<template>
    <UCard>
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="text-base">
                    {{ origin }}/{{ url.shortCode }}
                </div>

                <div class="text-sm text-primary">
                    {{ url.longUrl }}
                </div>

                <div class="text-sm text-gray-500 mt-0.5">
                    {{ formatTimeAgo(url.createdAt) }} |
                    <span class="text-sm text-error">expires {{ formatTimeAgo(url.expiresAt) }}</span>
                </div>
            </div>

            <div class="text-base">
                Total Clicks: {{ url.clicks }}
            </div>
        </div>

        <ShortenActions class="mt-2" :short-url="shortUrl" :stats-url="statsUrl" :qr-data-url="qrDataUrl"
            :social-items="socialItems" :download-q-r="downloadQR">
            <template #trailing>
                <UButton size="md" class="w-fit" icon="i-lucide-copy" aria-label="Copy to clipboard" @click="copyUrl()">
                    Copy</UButton>
            </template>
        </ShortenActions>
    </UCard>
</template>
