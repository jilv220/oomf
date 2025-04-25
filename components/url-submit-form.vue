<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod';

const schema = z.object({
    longUrl: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL"),
    customCode: z
        .string()
        .max(20, "Custom code must be less than 20 characters")
        .optional(),
});
type Schema = z.infer<typeof schema>;

const state = reactive({
    longUrl: '',
    customCode: '',
})

const toast = useToast()
const isLoading = ref(false)
const showCustomCodeInput = ref(false)
const shortUrl = ref('')
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
        state.customCode = ''
    }
}

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(shortUrl.value)
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

    try {
        const { shortCode } = await $fetch('/api/shorten', {
            method: 'POST',
            body: {
                longUrl: state.longUrl,
                customCode: state.customCode || undefined,
            }
        })

        // Show success message
        shortUrl.value = `${origin.value}/${shortCode}`
        success.value = true

    } catch (error) {
        console.error('Error shortening URL:', error)
        toast.add({
            title: 'Error',
            description: 'An unexpected error occurred. Please try again.',
            color: 'error',
            duration: 3000
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

        <!-- <div class="flex items-center">
            <UButton variant="ghost" color="neutral" size="sm" @click="toggleCustomCode" class="mb-2">
                {{ showCustomCodeInput ? 'Hide custom code' : 'Use custom code' }}
            </UButton>
        </div> -->

        <!-- <UFormField v-if="showCustomCodeInput" class="w-full" label="Custom code (optional)" name="customCode">
            <UInput class="w-full mt-2" v-model="state.customCode" placeholder="my-custom-code" />
            Use only letters, numbers, and hyphens
        </UFormField> -->

        <UButton class="w-full cursor-pointer" type="submit" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </UButton>

        <!-- Display shortened URL -->
        <UCard v-if="success" class="mt-6 bg-gray-50 dark:bg-gray-800">
            <div class="flex flex-col gap-2">
                <h3 class="text-lg font-medium">Your shortened URL:</h3>
                <div class="flex w-full">
                    <UInput class="flex-grow" readonly :model-value="shortUrl" />
                    <UButton color="primary" class="ml-2 cursor-pointer" icon="i-heroicons-clipboard"
                        @click="copyToClipboard" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Share this URL to redirect people to your original link
                </p>
            </div>
        </UCard>
    </UForm>
</template>
