<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
type Player = {
  playerId: string
  playerName: string
}

const players = ref<Player[]>([])
const lobbyId = ref<string>('')
const playerId = ref<string>('')
const canStartGame = ref<boolean>(false)
const isNotCreator = ref<boolean>(true)
let refreshHandle: number

onUnmounted(async () => {
  clearInterval(refreshHandle)
})

onMounted(async () => {
  const lId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  const pId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
  lobbyId.value = lId
  playerId.value = pId
  refreshHandle = setInterval(() => {
    refreshList()
  }, 1000)
})

async function refreshList() {
  try {
    const response = await RestClient.getInstance().getLobby(lobbyId.value, playerId.value)
    players.value = response.data.players
    if (players.value.length >= 10) {
      canStartGame.value = true
    }
    isNotCreator.value = playerId.value !== response.data.lobbyCreatorId
    if(response.data.currentPhase !== 'WAITING_FOR_PLAYERS') {
      // goto game view here
    }
  } catch (error) {
    console.error(error)
  }
}

function startGame() {

}
</script>
<template>
  <header>
    <h1>Lobby</h1>
  </header>
  <main>
    <div>
      Players waiting in the lobby: <span style="font-size: 1.5rem">{{ lobbyId }}</span>
    </div>
    <br />
    <div v-for="item in players" :key="item.playerId">
      {{ item.playerName }}
      <span style="font-weight: bold" :hidden="item.playerId !== playerId">(YOU)</span>
    </div>
    <div :hidden="isNotCreator">
      <button :disabled="!canStartGame" @click="startGame">Start the game</button>
      <span style="font-size: 0.6em">(Requires atleast 10 players)</span>
    </div>
  </main>
</template>