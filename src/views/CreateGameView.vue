<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
const name = ref('')
const isDisabled = ref(false)

async function create() {
  try {
    isDisabled.value = true
    const response = await RestClient.getInstance().createGame(name.value)
    console.log(response.data.playerId)
  } catch (error) {
    console.log(error)
  } finally {
    isDisabled.value = false
  }
}

onMounted(() => {})
</script>

<template>
  <main>
    <header>
      <h1>Create a game</h1>
    </header>
    <div>
      <input v-model="name" type="text" placeholder="Enter your name" />
    </div>
    <br />
    <div>
      <button :disabled="isDisabled" @click="create">Create</button>
    </div>
  </main>
</template>
