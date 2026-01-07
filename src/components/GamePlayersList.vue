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
  hasInspectedAlready: boolean | undefined
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
      <span :class="{ 'strikethrough-text': !item.alive }" style="font-size: 1.5em">{{
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
          !hasInspectedAlready &&
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
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  padding: 1rem;
}

@media (max-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.grid-item {
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  padding: 1.25rem;
  text-align: center;
  color: #2d3748;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 140px;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

@media (max-width: 600px) {
  .grid-item {
    padding: 0.75rem;
    font-size: 0.8rem;
    min-height: 120px;
  }
}

.strikethrough-text {
  text-decoration: line-through;
  opacity: 0.5;
}

.vote-performed {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  margin-top: 0.25rem;
}

.vote-received {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  font-weight: 800;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(245, 101, 101, 0.4);
  animation: voteAppear 0.3s ease;
}

@keyframes voteAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
