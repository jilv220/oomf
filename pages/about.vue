<!-- pages/about.vue -->
<script setup>
useHead({
    title: 'About',
})
</script>

<template>
    <main class="py-12">
        <div class="container max-w-4xl px-4 mx-auto">
            <h1 class="text-3xl font-bold mb-6">About OomF</h1>

            <UCard variant="subtle" class="mb-8">
                <div class="prose dark:prose-invert max-w-none">
                    <h2>What is OomF?</h2>
                    <p>
                        OomF is a simple, fast, and privacy-friendly URL shortener built with modern web technologies.
                        Our service allows you to create shortened links that are easy to share and remember.
                    </p>

                    <h2>How It Works</h2>
                    <p>
                        When you submit a long URL, our system generates a unique short code using base62 encoding.
                        This process ensures that each URL gets a short, unique identifier that redirects to your
                        original link.
                    </p>

                    <h3>Base62 Encoding</h3>
                    <p>
                        We use base62 encoding (using characters a-z, A-Z, and 0-9) to create concise, readable short
                        codes.
                        This method allows us to represent large numbers as short strings, perfect for URL shortening.
                    </p>

                    <h2>Features</h2>
                    <ul>
                        <li><strong>Custom codes:</strong> Create your own memorable short codes</li>
                        <li><strong>Click tracking:</strong> See how many times your shortened link has been clicked
                        </li>
                        <li><strong>Fast redirects:</strong> Minimal delay when redirecting to your destination URL</li>
                        <li><strong>Privacy-focused:</strong> We don't sell your data or track users beyond basic
                            analytics</li>
                        <li><strong>Open-source:</strong> Our codebase is available on GitHub</li>
                    </ul>

                    <h2>Technologies</h2>
                    <p>
                        OomF is built using:
                    </p>
                    <ul>
                        <li>Nuxt 3 - Vue.js framework</li>
                        <li>Cloudflare Workers - Serverless computing platform</li>
                        <li>D1 Database - Cloudflare's SQL database</li>
                        <li>Drizzle ORM - TypeScript ORM</li>
                        <li>Nuxt UI - Component library with Tailwind CSS</li>
                    </ul>

                    <h2>Terms of Service</h2>
                    <p>
                        By using OomF, you agree not to use our service for:
                    </p>
                    <ul>
                        <li>Spamming or phishing attempts</li>
                        <li>Malware distribution</li>
                        <li>Illegal content</li>
                        <li>Content that violates third-party terms of service</li>
                    </ul>
                    <p>
                        We reserve the right to disable any shortened URL without notice.
                    </p>
                </div>
            </UCard>

            <div class="flex justify-center">
                <UButton to="/" color="primary">Create a Short URL</UButton>
            </div>
        </div>
    </main>
</template>

<style scoped>
li {
    list-style-type: ">";
    color: var(--color-primary)
}

li>strong {
    color: var(--color-primary)
}

li::marker {
    color: var(--color-primary)
}
</style>