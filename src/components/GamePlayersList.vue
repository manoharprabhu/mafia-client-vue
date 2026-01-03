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
    | 'WIN'
    | undefined
  voteMap: { [key: string]: string } | undefined
  you:
    | {
        playerId: string
        name: string
        role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
        alive: boolean
      }
    | undefined
  inspectionResults: [{ playerId: string; roleOrientation: 'GOOD' | 'BAD' | 'UNKNOWN' }] | undefined
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

async function voteNightDoctor(sourcePlayerID: string, targetPlayerID: string) {
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().votePlayer(lobbyId, sourcePlayerID, targetPlayerID, 'doctor')
}

async function policeInspect(sourcePlayerID: string, targetPlayerID: string) {
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().policeInspect(lobbyId, sourcePlayerID, targetPlayerID)
}
</script>

<template>
  <div class="grid-container">
    <div v-for="item in players" :key="item.playerId" class="grid-item">
      <span :class="{ 'strikethrough-text': !item.alive }" style="font-size: 2.5em">{{
        item.name
      }}</span>
      <div :hidden="item.playerId !== you?.playerId">
        <Tag severity="success" value="YOU"></Tag>
      </div>
      <div :hidden="item.alive"><Tag severity="danger" value="DEAD" /></div>
      <div v-if="visibleRoles !== undefined && visibleRoles[item.playerId] !== undefined">
        <Tag v-if="visibleRoles[item.playerId] === 'MAFIA'" severity="danger"
          >{{ visibleRoles[item.playerId] }}
        </Tag>
        <Tag
          v-if="
            visibleRoles[item.playerId] === 'HEADHUNTER' || visibleRoles[item.playerId] === 'FOOL'
          "
          severity="warn"
        >
          {{ visibleRoles[item.playerId] }}
        </Tag>
        <Tag
          v-if="
            visibleRoles[item.playerId] === 'VILLAGER' ||
            visibleRoles[item.playerId] === 'POLICE' ||
            visibleRoles[item.playerId] === 'DOCTOR'
          "
          severity="info"
        >
          {{ visibleRoles[item.playerId] }}
        </Tag>
      </div>
      <div
        v-if="
          inspectionResults !== undefined &&
          inspectionResults.find((v) => v.playerId === item.playerId) !== undefined
        "
      >
        <Tag severity="info">{{
          inspectionResults.find((v) => v.playerId === item.playerId)?.roleOrientation
        }}</Tag>
      </div>
      <div
        v-if="you?.alive && phase === 'DAY_VOTING' && item.alive && item.playerId !== you?.playerId"
      >
        <Button @click="voteDay(you?.playerId, item.playerId)">Vote</Button>
      </div>
      <div
        v-if="
          you?.alive &&
          phase === 'NIGHT' &&
          you?.role === 'MAFIA' &&
          item.alive &&
          item.playerId !== you.playerId &&
          visibleRoles !== undefined &&
          visibleRoles[item.playerId] !== 'MAFIA'
        "
      >
        <Button @click="voteNight(you.playerId, item.playerId)" severity="danger">Vote</Button>
      </div>
      <div
        v-if="
          you?.alive &&
          phase === 'NIGHT' &&
          you?.role === 'DOCTOR' &&
          item.alive &&
          item.playerId !== you.playerId
        "
      >
        <Button @click="voteNightDoctor(you.playerId, item.playerId)" severity="info"
          >Protect</Button
        >
      </div>
      <div
        v-if="
          you?.alive &&
          phase === 'NIGHT' &&
          you?.role === 'POLICE' &&
          item.alive &&
          item.playerId !== you.playerId
        "
      >
        <Button @click="policeInspect(you.playerId, item.playerId)" severity="help"
          >Inspect player</Button
        >
      </div>
      <div
        v-if="voteMap !== undefined && voteMap[item.playerId] !== undefined"
        class="vote-performed"
      >
        <div>I'm voting {{ getNameById(voteMap[item.playerId]) }}</div>
      </div>
      <div v-if="voteMap !== undefined && Object.keys(voteMap).length > 0" class="vote-received">
        {{ Object.values(voteMap).filter((x) => x === item.playerId).length || '' }}
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
  aspect-ratio: 1/1; /* Maintain square shape */
}

@media (max-width: 600px) {
  .grid-container {
    gap: 0.5rem;
  }
}

.grid-item {
  background-color: #efefef;
  padding: 1rem;
  text-align: center;
  color: #010101;
  border-radius: 5px;
  position: relative; /* Needed for absolute positioning of vote count */

  /* Flex centering for content */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .grid-item {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
.strikethrough-text {
  text-decoration: line-through;
}
.vote-performed {
  font-size: 1.1em;
  font-weight: bold;
}
.vote-received {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: red;
  font-weight: bold;
  font-size: 1.2em;
}
</style>
