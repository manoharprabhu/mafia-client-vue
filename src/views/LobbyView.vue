<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
type Player = {
  playerId: string
  playerName: string
}

const players = ref<Player[]>([])

onMounted(async () => {
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
  const response = await RestClient.getInstance().getLobby(lobbyId, playerId)
  players.value = response.data.players
})

</script>
<template>
<header>
  <h1>Lobby</h1>
</header>
  <main>
    <div>
      Players waiting in the lobby:
    </div>
    <div v-for="item in players" :key="item.playerId">
      {{item.playerName}}
    </div>
  </main>
</template>