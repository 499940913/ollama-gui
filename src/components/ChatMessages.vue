<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChats } from '../services/chat.ts'
import { showSystem } from '../services/appConfig.ts'

const { messages } = useChats()
const chatElement = ref<HTMLElement>()

const scrollToBottom = () => {
    if (chatElement.value) {
      chatElement.value.scrollTop = chatElement.value.scrollHeight
    }
}

onMounted(() => {
  scrollToBottom()
  
})

onUpdated(() => scrollToBottom())

watch(messages, () => {
})

const visibleMessages = computed(() =>
  showSystem.value ? messages?.value : messages?.value.filter((m) => m.role != 'system'),
)
</script>

<template>
  <div
  ref="chatElement"
  class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900 scroll-smooth rounded-xl mx-auto-full p-4 text-sm leading-6 text-gray-900 dark:text-gray-100 sm:text-base sm:leading-7"
>

    <ChatMessage v-for="message in visibleMessages" :message="message" />
  </div>
</template>
