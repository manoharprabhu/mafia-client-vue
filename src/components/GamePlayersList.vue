<script setup lang="ts">
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { LocalData } from '@/service/LocalData.ts'
import { RestClient } from '@/service/RestClient.ts'
import { ref } from 'vue'

const props = defineProps<{
  players: [{ playerId: string; name: string; alive: boolean }] | undefined
  visibleRoles:
    | {
        [key: string]: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
      }
    | undefined
  phase:
    | 'WAITING_FOR_PLAYERS'
    | 'START'
    | 'NIGHT'
    | 'RESOLVE_NIGHT'
    | 'DAY_DISCUSSION'
    | 'DAY_VOTING'
    | 'RESOLVE_DAY'
    | undefined
  voteMap: { [key: string]: string } | undefined
  you: {
    playerId: string
    name: string
    role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
    alive: boolean
  }
}>()

function getNameById(playerId: string | undefined): string {
  if (props.players === undefined) {
    return ''
  }
  for (let i = 0; i < props.players?.length; i++) {
    if (props.players[i]?.playerId === playerId) {
      return props.players[i]?.name!
    }
  }
  return ''
}

async function voteDay(sourcePlayerID: string, targetPlayerID: string) {
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().votePlayer(lobbyId, sourcePlayerID, targetPlayerID, 'villager')
}

async function voteNight(sourcePlayerID: string, targetPlayerID: string) {
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().votePlayer(lobbyId, sourcePlayerID, targetPlayerID, 'mafia')
}
</script>

<template>
  <div class="grid-container">
    <div v-for="item in players" :key="item.playerId" class="grid-item">
      <span :class="{ 'strikethrough-text': !item.alive, }" style="font-size: 2.5em">{{ item.name }}</span>
      <div :hidden="item.playerId !== you.playerId"><Tag severity="success" value="YOU"></Tag></div>
      <div :hidden="item.alive"><Tag severity="danger" value="DEAD" /></div>
      <div v-if="visibleRoles !== undefined && visibleRoles[item.playerId] === 'MAFIA'">
        <Tag severity="warn" value="MAFIA" />
      </div>
      <div
        v-if="you.alive && phase === 'DAY_VOTING' && item.alive && item.playerId !== you.playerId"
      >
        <Button @click="voteDay(you.playerId, item.playerId)">Vote</Button>
      </div>
      <div
        v-if="
          you.alive &&
          phase === 'NIGHT' &&
          you.role === 'MAFIA' &&
          item.alive &&
          item.playerId !== you.playerId &&
          visibleRoles !== undefined &&
          visibleRoles[item.playerId] !== 'MAFIA'
        "
      >
        <Button @click="voteNight(you.playerId, item.playerId)">Vote</Button>
      </div>
      <div
        v-if="voteMap !== undefined && voteMap[item.playerId] !== undefined"
        class="vote-performed"
      >
        <div>I'm voting {{ getNameById(voteMap[item.playerId]) }}</div>
      </div>
      <div v-if="voteMap !== undefined && Object.keys(voteMap).length > 0" class="vote-received">
        {{ Object.values(voteMap).filter((x) => x === item.playerId).length }} votes received
      </div>
    </div>
  </div>
</template>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  min-width: 800px;
  max-height: 800px;
  min-height: 800px;
  margin: auto;
}

.grid-item {
  background-color: #efefef;
  padding: 1rem;
  text-align: center;
  color: #010101;
  border-radius: 5px;
}
.strikethrough-text {
  text-decoration: line-through;
}
.vote-performed {
  font-size: 1.1em;
  font-weight: bold;
}
.vote-received {
  font-size: 0.8em;
}
</style>
