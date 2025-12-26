<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'

const name = ref('')
const isDisabled = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function create() {
  try {
    isDisabled.value = true
    const response = await RestClient.getInstance().createGame(name.value)
    if (!response.success) {
      errorMessage.value = response.message
      return
    }
    const playerId = response.data.playerId
    LocalData.getInstance().setData(LocalData.PLAYERID, playerId)
    await router.push('/lobby')
  } catch (error: any) {
    errorMessage.value = error.message
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
    <div>
      <label style="color: red">{{ errorMessage }}</label>
    </div>
  </main>
</template>
