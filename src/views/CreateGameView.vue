<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'

const name = ref('')
const isDisabled = ref(false)
const errorMessage = ref('')
const ip = ref('http://localhost:8080')
const router = useRouter()

async function create() {
  try {
    isDisabled.value = true
    LocalData.getInstance().setData(LocalData.IP, ip.value)
    RestClient.overrideHost(ip.value)
    const response = await RestClient.getInstance().createGame(name.value)
    if (!response.success) {
      errorMessage.value = response.message
      return
    }
    const playerId = response.data.playerId
    const lobbyId = response.data.lobbyId
    LocalData.getInstance().setData(LocalData.PLAYERID, playerId)
    LocalData.getInstance().setData(LocalData.LOBBYID, lobbyId)
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
      <input v-model="ip" type="text" placeholder="Server IP address and port" />
    </div>
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
