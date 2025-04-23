<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod';

const schema = z.object({
    longUrl: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL"),
});
type Schema = z.infer<typeof schema>;

const state = reactive({
    longUrl: '',
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
    const { data } = await $fetch('/api/hello')
    console.log(data)
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField class="w-full" label="Shorten a long URL" name="longUrl">
            <UInput class="w-full mt-2" v-model="state.longUrl" />
        </UFormField>

        <UButton class="w-full" type="submit">
            Submit
        </UButton>
    </UForm>
</template>
