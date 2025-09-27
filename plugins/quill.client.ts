import { defineNuxtPlugin } from '#app'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('quill', Quill)
})

declare module '#app' {
  interface NuxtApp {
    $quill: typeof Quill
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $quill: typeof Quill
  }
}
