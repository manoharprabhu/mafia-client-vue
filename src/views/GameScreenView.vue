<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { type GetGameResponse, RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import PhaseText from '@/components/PhaseText.vue'
import GamePlayersList from '@/components/GamePlayersList.vue'
import RoleText from '@/components/RoleText.vue'
import WinText from '@/components/WinText.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Fluid from 'primevue/fluid'

const gameState = ref<GetGameResponse>()
const message = ref<string>('')
const scrollContainerRef = ref<HTMLElement | null>(null)
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

watch(
  () => gameState.value?.messages?.length,
  async () => {
    await nextTick()
    const el = scrollContainerRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  },
)

function formatMsToHHMMsss(timestamp: number) {
  const date = new Date(timestamp)

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0')

  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

function getHeadhunterTargetName(): string | undefined {
  const targetId = gameState.value?.yourHeadhunterTarget
  if (targetId === undefined || targetId === null) {
    return undefined
  }

  return gameState.value?.players.find((item) => item.playerId === targetId)?.name
}

async function sendMessage() {
  const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().sendMessage(lobbyId, playerId, message.value)
  message.value = ''
}

async function skipPhase() {
  const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  await RestClient.getInstance().skipDiscussion(lobbyId, playerId)
}
</script>

<template>
  <main class="game-screen">
    <div class="game-layout">
      <div class="players-section">
        <GamePlayersList
          :players="gameState?.players"
          :visibleRoles="gameState?.visibleRoles"
          :phase="gameState?.phase"
          :voteMap="gameState?.voteMap"
          :inspectionResults="gameState?.inspectionResults"
          :hasInspectedAlready="gameState?.hasInspectedAlready"
          :you="gameState?.you!"
        />
      </div>

      <div class="game-header">
        <WinText :info="gameState?.winner" />
        <PhaseText :gameState="gameState" />
        <RoleText :you="gameState?.you" :hhTarget="getHeadhunterTargetName()" />
        <Button @click="skipPhase" v-if="!gameState?.you.hasSkippedDiscussion && gameState?.phase === 'DAY_DISCUSSION'" severity="help">Vote to skip discussion</Button
        >
      </div>

      <div class="chat-section">
        <div class="chat-header">Game Log</div>
        <div class="scroll-container" ref="scrollContainerRef">
          <div
            v-for="(item, index) in gameState?.messages"
            :key="index"
            :class="{ 'list-item': item.type === 0, 'list-item-chat': item.type === 1 }"
          >
            <span class="timestamp">{{ formatMsToHHMMsss(item.timestamp) }}</span>
            <span class="message-text">{{ item.message }}</span>
          </div>
        </div>
        <Fluid>
          <InputText type="text" style="width: 100%; height: 100px" v-model="message" />
          <Button @click="sendMessage">Send</Button>
        </Fluid>
        <br />
      </div>
    </div>
  </main>
</template>

<style scoped>
.game-screen {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  margin-bottom: 2rem;
  text-align: center;
}

.game-layout {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
}

.players-section {
  flex: 2;
  display: flex;
  justify-content: center;
}

.chat-section {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: fit-content;
}

.chat-header {
  background-color: #2c3e50;
  color: white;
  padding: 12px 16px;
  font-weight: bold;
  font-size: 1.1rem;
}

.scroll-container {
  height: 300px;
  overflow-y: auto;
  padding: 0;
  background-color: #f8f9fa;
}

.list-item {
  padding: 10px 16px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-item-chat {
  padding: 10px 16px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: antiquewhite;
}

.timestamp {
  font-size: 0.75rem;
  color: #888;
  font-family: monospace;
}

.message-text {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .game-layout {
    flex-direction: column;
    align-items: center;
  }

  .players-section,
  .chat-section {
    width: 100%;
    max-width: 100%;
  }

  .chat-section {
    max-width: 600px; /* Keep chat readable on tablets but not too wide */
  }
}
</style>
