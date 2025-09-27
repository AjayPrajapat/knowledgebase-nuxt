import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      title: 'Knowledge Base + Document Generator',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    // Private keys here
    docTemplateDir: 'server/data/templates',
    public: {
      uploadsDir: '/uploads',
      generatedDir: '/generated'
    }
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  tailwindcss: {
    exposeConfig: true
  }
})
