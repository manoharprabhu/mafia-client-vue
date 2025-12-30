<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { type GetGameResponse, RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'

const gameState = ref<GetGameResponse>()
let timerHandle: number
onMounted(() => {
  timerHandle = setInterval(async () => {
    const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
    const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
    const response = await RestClient.getInstance().getGameState(lobbyId, playerId)
    if(response.success) {
      gameState.value = response.data
    }
  })
})

onUnmounted(() => {
  clearInterval(timerHandle)
})

</script>

<template>
  <main>
    <header>
      <h1>Game</h1>
    </header>
    <div>
      <div>{{gameState?.phase}}</div>
      <div>Time remaining: {{gameState?.timeRemainingSeconds}}</div>
    </div>
  </main>
</template>
