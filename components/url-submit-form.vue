<script setup lang="ts">
import type { DropdownMenuItem, FormSubmitEvent } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
import { P, match } from 'ts-pattern';
import { generateQR } from '~/shared/generateQR';
import { type ShortenForm, shortenFormSchema } from '~/shared/shorten';
import { UDropdownMenu } from '#components';

const initialState = {
    longUrl: '',
    customCode: undefined,
}
const state = reactive({ ...initialState })

const toast = useToast()
const isLoading = ref(false)

const origin = useOrigin();
const shortUrl = ref('')
const { copy, copied } = useClipboard({ source: shortUrl, copiedDuring: 2000 })

const statsUrl = ref('')
const qrDataUrl = ref('')
const success = ref(false)

const appConfg = useAppConfig()
const { items: socialItems } = useSocialShare({
    url: shortUrl,
    text: `Share this link with ${appConfg.appName}`
})

const resetForm = () => {
    Object.assign(state, initialState)
}

// Submit form to create short URL
async function onSubmit(event: FormSubmitEvent<ShortenForm>) {
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
        qrDataUrl.value = await generateQR(shortUrl.value)

        statsUrl.value = `${origin.value}/stats/${shortCode}`
        success.value = true

    } catch (error) {
        console.error('Error shortening URL:', error)

        match(error)
            .with(P.shape({ statusCode: 409 }),
                () => {
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

        resetForm()
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <UForm :schema="shortenFormSchema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField size="xl" :ui="{
            error: 'text-sm'
        }" label="Enter a long URL to shorten" name="longUrl">
            <UInput size="lg" class="w-full mt-2" v-model="state.longUrl" placeholder="Enter long link here" />
        </UFormField>

        <UCollapsible>
            <UButton variant="link" size="sm" color="neutral" trailing-icon="i-lucide-chevron-down"
                class="mb-2 pl-0 group" :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }">
                Use custom code
            </UButton>

            <template #content>
                <UFormField class="w-full" :ui="{
                    help: 'text-xs'
                }" label="Custom code (optional)" name="customCode"
                    help="Use only letters, numbers, hyphens and underscores">
                    <UInput class="w-full mt-2" v-model="state.customCode" placeholder="my-custom-code" />
                </UFormField>
            </template>
        </UCollapsible>

        <UButton class="w-full" type="submit" :loading="isLoading" :disabled="isLoading">
            {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </UButton>

        <!-- Display shortened URL and stats link -->
        <UCard v-if="success" class="mt-6">
            <div class="flex flex-col gap-4">
                <div>
                    <h3 class="text-lg font-medium">Your shortened URL:</h3>
                    <div class="flex w-full mt-2">
                        <UInput class="flex-grow" readonly v-model="shortUrl" :ui="{ trailing: 'pr-0.5' }">
                            <template #trailing>
                                <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                                    <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                                        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                                        aria-label="Copy to clipboard" @click="copy(shortUrl)" />
                                </UTooltip>
                            </template>
                        </UInput>
                    </div>
                </div>

                <div class="flex gap-1">
                    <UButton icon="i-lucide-external-link" size="md" class="w-fit" :to="shortUrl" :external="true"
                        target="_blank" />
                    <UPopover :content="{
                        align: 'center',
                        side: 'bottom',
                        sideOffset: 8,
                    }" arrow :ui="{
                        content: 'ring-0',
                        arrow: 'fill-white'
                    }">
                        <UButton icon="i-lucide-qr-code" size="md" class="w-fit">
                            QR
                        </UButton>

                        <template #content>
                            <div class="h-[110px] w-[110px]">
                                <NuxtImg class="h-full w-full" :src="qrDataUrl" alt="QR Code to shortened URL" />
                            </div>
                        </template>
                    </UPopover>

                    <!-- Social share -->
                    <UDropdownMenu :content="{
                        align: 'center',
                        side: 'bottom',
                        sideOffset: 8,
                    }" arrow :items="socialItems">
                        <UButton icon="i-lucide-share-2" size="md" class="w-fit">
                            Share
                        </UButton>
                    </UDropdownMenu>
                </div>

                <div class="flex gap-2 mt-2">
                    <UButton to="/" color="primary" variant="outline" block @click="success = false; resetForm()">
                        Shorten Another
                    </UButton>
                    <UButton :to="statsUrl" color="primary" block>
                        View Stats
                    </UButton>
                </div>
            </div>
        </UCard>
    </UForm>
</template>
