<script setup lang="ts">
useHead({
    title: "Free URL Shortener",
    titleTemplate: '%s - OomF',
    meta: [
        { name: 'description', content: 'OomF is a simple, fast, and privacy-friendly URL shortener built with modern web technologies. Create short, memorable links instantly.' },
        { name: 'keywords', content: 'URL shortener, link shortening, OomF, short links, custom URLs' },
        { property: 'og:title', content: 'OomF - Fast & Privacy-Friendly URL Shortener' },
        { property: 'og:description', content: 'Create short, memorable links instantly with OomF - a privacy-focused URL shortener built with modern web technologies.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'OomF - Fast & Privacy-Friendly URL Shortener' },
        { name: 'twitter:description', content: 'Create short, memorable links instantly with OomF - a privacy-focused URL shortener built with modern web technologies.' },
    ]
})
</script>

<template>
    <main class="py-8">
        <div class="container mx-auto px-4 max-w-4xl">
            <!-- Hero Section -->
            <section class="mb-12">
                <div class="text-center">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">Free URL Shortener</h1>
                    <p class="text-lg mb-8">Share links with your oomf(ies)</p>
                </div>

                <!-- URL Shortener Form -->
                <UCard variant="soft" class="w-full md:w-[80%] mx-auto">
                    <UrlSubmitForm />
                </UCard>
            </section>

            <!-- Features Section -->
            <section class="mb-12">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UCard variant="soft" class="text-center">
                        <div class="p-4">
                            <div class="text-4xl mb-4 flex justify-center">
                                <UIcon name="i-heroicons-bolt" class="text-jade-600 h-12 w-12" />
                            </div>
                            <h3 class="text-xl font-bold mb-2">Lightning Fast</h3>
                            <p>Minimal delay when redirecting to your destination URL</p>
                        </div>
                    </UCard>

                    <UCard variant="soft" class="text-center">
                        <div class="p-4">
                            <div class="text-4xl mb-4 flex justify-center">
                                <UIcon name="i-heroicons-chart-bar" class="text-jade-600 h-12 w-12" />
                            </div>
                            <h3 class="text-xl font-bold mb-2">Track Clicks</h3>
                            <p>See how many times your shortened link has been clicked</p>
                        </div>
                    </UCard>

                    <UCard variant="soft" class="text-center">
                        <div class="p-4">
                            <div class="text-4xl mb-4 flex justify-center">
                                <UIcon name="i-heroicons-shield-check" class="text-jade-600 h-12 w-12" />
                            </div>
                            <h3 class="text-xl font-bold mb-2">Privacy-Focused</h3>
                            <p>We don't sell your data or track users beyond basic analytics</p>
                        </div>
                    </UCard>
                </div>
            </section>

            <!-- FAQ Section -->
            <section>
                <UCard variant="soft" class="mb-8">
                    <article class="prose prose-lg prose-pol max-w-none 
                        prose-a:text-muted prose-a:hover:text-default
                        prose-strong:text-muted
                        ">
                        <h2>Frequently Asked Questions</h2>

                        <h4>How does OomF work?</h4>
                        <ul>
                            <li>Enter a long URL, and OomF generates a short link using base62 encoding.</li>
                            <li>Click the short link, and it takes you to the original URL real quick.</li>
                            <li>OomF tracks clicks, and you can check stats with a special link.</li>
                        </ul>

                        <h4>Is it fast or what?</h4>
                        <ul>
                            <li>Redirects happen so fast you barely notice.</li>
                            <li>Uses Cloudflare Workers, so it’s solid and works everywhere.</li>
                        </ul>

                        <h4>Can I use it a ton?</h4>
                        <ul>
                            <li>No limits, fren—shorten all the URLs you want.</li>
                        </ul>

                        <h4>Do my links disappear?</h4>
                        <ul>
                            <li>Anon links get wiped after <strong>2 weeks</strong> of no action.</li>
                        </ul>

                        <h4>Can I use the API?</h4>
                        <ul>
                            <li>Yeah, coders can use OomF’s API to make short links.</li>
                            <li>Check <a href="#">API docs</a> for the how-to.</li>
                        </ul>

                        <h4>What’s up with my data?</h4>
                        <ul>
                            <li>We only store click counts, no selling your info.</li>
                        </ul>
                    </article>
                </UCard>
            </section>
        </div>
    </main>
</template>

<style scoped>
.prose ul {
    list-style-type: ">";
    padding-left: 0.75rem;
}

.prose ul li {
    color: var(--color-primary);
}
</style>