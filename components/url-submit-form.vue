<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { H3Error } from "h3"
import { P, match } from 'ts-pattern';
import { z } from 'zod';

const schema = z.object({
    longUrl: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL"),
    customCode: z
        .string()
        .max(20, "Custom code must be less than 20 characters")
        .regex(/^[a-zA-Z0-9-_]+$/, "Only letters, numbers, hyphens and underscores are allowed")
        .optional(),
});
type Schema = z.infer<typeof schema>;

const state = reactive({
    longUrl: '',
    customCode: undefined,
})

const toast = useToast()
const isLoading = ref(false)
const showCustomCodeInput = ref(false)
const shortUrl = ref('')
const statsUrl = ref('')
const success = ref(false)
const origin = ref('');

// Get the origin in a way that works for SSR
if (import.meta.client) {
    // Client-side: Use window.location.origin
    origin.value = window.location.origin;
} else {
    // Server-side: Use useRequestURL to get the origin
    const requestUrl = useRequestURL();
    origin.value = requestUrl.origin;
}

function toggleCustomCode() {
    showCustomCodeInput.value = !showCustomCodeInput.value
    if (!showCustomCodeInput.value) {
        state.customCode = undefined
    }
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        toast.add({
            title: 'Copied!',
            description: 'URL copied to clipboard',
            color: 'success',
            duration: 3000
        })
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Failed to copy URL',
            color: 'error',
            duration: 2000
        })
    }
}

// Submit form to create short URL
async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    success.value = false
    shortUrl.value = ''
    statsUrl.value = ''

    try {
        const { shortCode } = await $fetch('/api/shorten', {
            method: 'POST',
            body: {
                longUrl: state.longUrl,
                customCode: state.customCode,
            }
        })

        // Create URLs
        shortUrl.value = `${origin.value}/${shortCode}`
        statsUrl.value = `${origin.value}/stats/${shortCode}`
        success.value = true

    } catch (error) {
        console.error('Error shortening URL:', error)

        match(error)
            .with(P.instanceOf(H3Error), (e) => e.statusCode === 409, () => {
                toast.add({
                    title: 'Custom code unavailable',
                    description: 'This custom code is already in use. Please try another one.',
                    color: 'error',
                    duration: 3000
                })
            })
            .with(P.instanceOf(Error), () => {
                toast.add({
                    title: 'Error',
                    description: 'An unexpected error occurred. Please try again.',
                    color: 'error',
                    duration: 3000
                })
            })
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField size="xl" :ui="{
            error: 'text-sm'
        }" label="Enter a long URL to shorten" name="longUrl">
            <UInput size="lg" class="w-full mt-2" v-model="state.longUrl" placeholder="Enter long link here" />
        </UFormField>

        <div class="flex items-center">
            <UButton variant="ghost" color="neutral" size="sm" @click="toggleCustomCode" class="mb-2">
                {{ showCustomCodeInput ? 'Hide custom code' : 'Use custom code' }}
            </UButton>
        </div>

        <UFormField v-if="showCustomCodeInput" class="w-full" label="Custom code (optional)" name="customCode">
            <UInput class="w-full mt-2" v-model="state.customCode" placeholder="my-custom-code" />
            <span class="text-xs text-gray-500">Use only letters, numbers, hyphens and underscores</span>
        </UFormField>

        <UButton class="w-full" type="submit" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </UButton>

        <!-- Display shortened URL and stats link -->
        <UCard v-if="success" class="mt-6">
            <div class="flex flex-col gap-4">
                <div>
                    <h3 class="text-lg font-medium">Your shortened URL:</h3>
                    <div class="flex w-full mt-2">
                        <UInput class="flex-grow" readonly :model-value="shortUrl" />
                        <UButton color="primary" class="ml-2" icon="i-heroicons-clipboard"
                            @click="copyToClipboard(shortUrl)" />
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-medium">Statistics link:</h3>
                    <div class="flex w-full mt-2">
                        <UInput class="flex-grow" readonly :model-value="statsUrl" />
                        <UButton color="primary" class="ml-2" icon="i-heroicons-clipboard"
                            @click="copyToClipboard(statsUrl)" />
                    </div>
                    <p class="text-sm text-dimmed mt-1">
                        Use this link to track clicks and view statistics
                    </p>
                </div>

                <div class="flex gap-2 mt-2">
                    <UButton to="/" color="primary" variant="outline" block
                        @click="success = false; state.longUrl = ''">
                        Create Another URL
                    </UButton>
                    <UButton :to="statsUrl" color="primary" block>
                        View Stats
                    </UButton>
                </div>
            </div>
        </UCard>
    </UForm>
</template>
