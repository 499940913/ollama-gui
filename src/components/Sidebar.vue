<script setup lang="ts">
import { ref } from 'vue'
import {
  IconMoon,
  IconPlus,
  IconSettings2,
  IconSun,
  IconTrashX,
  IconUserCircle,
  IconMessageCode,
} from '@tabler/icons-vue'

import {
  isDarkMode,
  isSystemPromptOpen,
  toggleSettingsPanel,
  toggleSystemPromptPanel,
} from '../services/appConfig.ts'
import { useChats } from '../services/chat.ts'
import { onMounted, ref } from 'vue'
import testConnection from '../services/testConnection.ts'
import Confirm from './Dialogs/Confirm.vue';
const { sortedChats, activeChat, switchChat, deleteChat, startNewChat } =
  useChats()

const showConfirmDeleteAllChats = ref(false)

const onNewChat = () => {
  checkSystemPromptPanel()
  return startNewChat('New chat')
}
const isConnected = ref(true)
onMounted(async () => {
  if (!(await testConnection())) {
    isConnected.value = false
  }
})


const onSwitchChat = (chatId: number) => {
  checkSystemPromptPanel()
  return switchChat(chatId)
}

const checkSystemPromptPanel = () => {
  isSystemPromptOpen.value = false
}

const lang = navigator.language
const onConfirmDeleteAllChats = () => {
  wipeDatabase()
  showConfirmDeleteAllChats.value = false
}</script>

<template>
  <Confirm 
    v-model="showConfirmDeleteAllChats"
    title="Delete all chats" 
    message="Are you sure you want to proceed with this action? This cannot be undone."
    @confirm="onConfirmDeleteAllChats"
    @cancel="showConfirmDeleteAllChats = false"
  />
  <aside class="flex">
    <div
      class="flex h-screen w-60 flex-col overflow-y-auto border-r border-gray-200 bg-white pt-2 dark:border-gray-800 dark:bg-gray-900 sm:h-screen sm:w-64"
    >
      <div class="mx-2 mb-2">
        <button
        v-if="isConnected"
        @click="onNewChat"
        class=" flex w-full items-center justify-center gap-x-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
        >
          <IconPlus class="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div
        class="h-full space-y-4 overflow-y-auto border-b border-gray-200 px-2 py-4 dark:border-gray-800"
      >
        <button
          v-for="chat in sortedChats"
          @click="onSwitchChat(chat.id!)"
          @keyup.delete="deleteChat(chat.id!)"
          :class="{
            'bg-gray-100 dark:bg-gray-800': activeChat?.id == chat.id,
          }"
          class="flex w-full flex-col gap-y-1 rounded-md px-3 py-2 text-left transition-colors duration-100 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:placeholder-gray-300 dark:hover:bg-gray-700 dark:focus:ring-blue-500"
        >
          <span class="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
            {{ chat.name }}
          </span>
          <span class="text-xs leading-none text-gray-700 dark:text-gray-300">
            {{ chat.model }}
          </span>
          <span class="text-xs leading-none text-gray-700 dark:text-gray-300">
            {{
              chat.createdAt.toLocaleDateString(lang, {
                day: '2-digit',
                month: 'short',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            }}
          </span>
        </button>
      </div>

      <div class="mt-auto w-full space-y-2 px-2 py-4">
        <button
          @click="isDarkMode = !isDarkMode"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-900 transition-colors duration-100 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-300 dark:hover:bg-gray-700 dark:focus:ring-blue-500"
        >
          <IconSun v-if="isDarkMode" class="size-4 opacity-50 group-hover:opacity-80" />
          <IconMoon v-else class="size-4 opacity-50 group-hover:opacity-80" />

          Toggle dark mode
        </button>
        <button
    <button
          @click="showConfirmDeleteAllChats = true"
          class="flex w-full gap-x-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-200 dark:placeholder-zinc-400 dark:hover:bg-zinc-800 dark:focus:ring-blue-500"
        >
          <IconTrashX class="h-6 w-6" />

          Delete chats
        </button>
          v-if="false"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-900 transition-colors duration-100 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-300 dark:hover:bg-gray-700 dark:focus:ring-blue-500"
        >
          <IconUserCircle class="size-4 opacity-50 group-hover:opacity-80" />
          User
        </button>
        <button
          @click="toggleSystemPromptPanel"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-900 transition-colors duration-100 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-300 dark:hover:bg-gray-700 dark:focus:ring-blue-500"
        >
          <IconMessageCode class="size-4 opacity-50 group-hover:opacity-80" />

          System prompt
        </button>
        <button
          @click="toggleSettingsPanel"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-900 transition-colors duration-100 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-300 dark:hover:bg-gray-700 dark:focus:ring-blue-500"
        >
          <IconSettings2 class="size-4 opacity-50 group-hover:opacity-80" />

          Settings
        </button>
      </div>
    </div>
  </aside>
</template>
