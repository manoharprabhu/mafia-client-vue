<script setup lang="ts">
import { ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'

const name = ref<string>('')
const lobbyId = ref<string>('')
const errorMessage = ref<string>('')
const isDisabled = ref<boolean>(false)
const router = useRouter()

async function join() {
  isDisabled.value = true
  try {
    const response = await RestClient.getInstance().joinGame(lobbyId.value, name.value)
    if (!response.success) {
      errorMessage.value = response.message
      return
    }
    const playerId = response.data.playerId
    LocalData.getInstance().setData(LocalData.PLAYERID, playerId)
    LocalData.getInstance().setData(LocalData.LOBBYID, lobbyId.value)
    await router.push('/lobby')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isDisabled.value = false
  }
}
</script>

<template>
  <main>
    <header>
      <h1>Join a game</h1>
    </header>
    <div>
      <input v-model="name" type="text" placeholder="Enter your name" />
    </div>
    <div>
      <input v-model="lobbyId" type="text" placeholder="Enter the lobby ID" />
    </div>
    <br />
    <div>
      <button :disabled="isDisabled" @click="join">Join</button>
    </div>
    <div>
      <label style="color: red">{{ errorMessage }}</label>
    </div>
  </main>
</template>
