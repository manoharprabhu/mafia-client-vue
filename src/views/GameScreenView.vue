<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { type GetGameResponse, RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import PhaseText from '@/components/PhaseText.vue'
import TimerText from '@/components/TimerText.vue'
import GamePlayersList from '@/components/GamePlayersList.vue'
import RoleText from '@/components/RoleText.vue'

const gameState = ref<GetGameResponse>()
let timerHandle: number
onMounted(() => {
  timerHandle = setInterval(async () => {
    const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
    const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
    const response = await RestClient.getInstance().getGameState(lobbyId, playerId)
    if (response.success) {
      gameState.value = response.data
    }
  }, 1000)
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
      <div><PhaseText :phase="gameState?.phase" /></div>
      <div><TimerText :time="gameState?.timeRemainingSeconds" /></div>
      <div><RoleText :role="gameState?.you.role" /></div>
      <div>
        <GamePlayersList
          :your-id="gameState?.you.playerId"
          :players="gameState?.players"
          :visibleRoles="gameState?.visibleRoles"
        />
      </div>
    </div>
  </main>
</template>
