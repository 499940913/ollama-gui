<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import { useChats } from '../services/chat.ts'
import { IconPlayerStopFilled, IconSend, IconWhirl, IconCameraUp } from '@tabler/icons-vue'
import testConnection from '../services/testConnection.ts'
import { showSystem } from '../services/appConfig.ts'
const { textarea, input: userInput } = useTextareaAutosize({ input: '' })
const { addSystemMessage, addUserMessage, abort, hasActiveChat, hasMessages, regenerateResponse } = useChats()

const isSystemMessage = ref(false)
const isInputValid = computed<boolean>(() => !!userInput.value.trim())
const isAiResponding = ref(false)
const flag = ref(true)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const base64Images = ref<string[]>([])

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    // Convert to base64
    const reader = new FileReader()
    reader.onload = () => {
      base64Images.value = [reader.result as string]
    }
    reader.readAsDataURL(selectedFile.value)
  }
}


const onSubmit = () => {
  if (isAiResponding.value) {
    abort()
    isAiResponding.value = false
    return
  }
  if (isInputValid.value) {
    if (isSystemMessage.value) {
      addSystemMessage(userInput.value.trim())
    } else {
   addUserMessage(userInput.value.trim(), base64Images.value).then(() => {
      isAiResponding.value = false
    })
    }
    userInput.value = ''
    if (!isSystemMessage.value) {
      isAiResponding.value = true
    }
 	base64Images.value = []
    selectedFile.value = null
  }
}

const shouldSubmit = ({ key, shiftKey }: KeyboardEvent): boolean => {
  return key === 'Enter' && !shiftKey
}

const onKeydown = (event: KeyboardEvent) => {
  if (shouldSubmit(event) && flag.value) {
    // Pressing enter while the ai is responding should not abort the request
    if (isAiResponding.value) {
      return
    }

    event.preventDefault()
    onSubmit()
  }
}
const isConnected = ref(true)
onMounted(async () => {
  if (!(await testConnection())) {
    isConnected.value = false
  }
})

const handleCompositionStart = () => {
  flag.value = false
}

const handleCompositionEnd = () => {
  flag.value = true
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="flex px-2 flex-col sm:flex-row items-center">
      <div class="text-gray-900 dark:text-gray-100 space-x-2 text-sm font-medium mb-2" v-if="showSystem">
        <label>
          <input type="radio" :value="false" v-model="isSystemMessage">
          User
        </label>
        <label>
          <input type="radio" :value="true" v-model="isSystemMessage">
          System
        </label>
      </div>
      <div class="ml-auto" v-if="hasMessages">
        <button
          type="button"
          @click="regenerateResponse"
          class="rounded-lg text-blue-700 text-sm font-medium transition duration-200 ease-in-out hover:text-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:text-gray-400 disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:ring-blue-800 dark:disabled:text-gray-600"
        >
          Regenerate response
        </button>
      </div>
    </div>
    <div class="relative">
      <textarea
        :disabled="!isConnected"
        ref="textarea"
        v-model="userInput"
        class="block max-h-[500px] w-full resize-none rounded-xl border-none bg-gray-50 p-4 pl-4 pr-20 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-50 dark:placeholder-gray-300 dark:focus:ring-blue-600 sm:text-base"
        placeholder="Enter your prompt"
        @keydown="onKeydown"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      ></textarea>
      <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*"
      @change="onFileChange"
    />

    <button
      type="button"
      @click="fileInput?.click()"
      :class="{
        'bg-green-600 hover:bg-green-700': selectedFile,
        'bg-blue-700 hover:bg-blue-800': !selectedFile
      }"
      class="group absolute bottom-2 right-14 flex size-10 items-center justify-center rounded-lg text-sm font-medium text-white transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
    >
      <IconCameraUp/>
    </button>

      <button
        type="submit"
        :disabled="isInputValid == false && isAiResponding == false"
        class="group absolute bottom-2 right-2.5 flex size-10 items-center justify-center rounded-lg bg-blue-700 text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-gray-600 sm:text-base"
      >
        <IconPlayerStopFilled
          v-if="isAiResponding"
          class="absolute opacity-0 transition duration-200 ease-in-out group-hover:opacity-100"
          :size="20"
        />
        <IconWhirl
          class="absolute animate-spin opacity-50 transition duration-200 ease-in-out group-hover:opacity-0"
          v-if="isAiResponding"
          :size="20"
        />

        <IconSend v-else :size="20" />
      </button>
    </div>
  </form>
</template>
