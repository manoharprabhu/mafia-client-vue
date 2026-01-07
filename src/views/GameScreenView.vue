<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { type GetGameResponse, RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import PhaseText from '@/components/PhaseText.vue'
import GamePlayersList from '@/components/GamePlayersList.vue'
import RoleText from '@/components/RoleText.vue'
import WinText from '@/components/WinText.vue'
import Button from 'primevue/button'

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
    <div class="game-header">
      <WinText :info="gameState?.winner" />
      <PhaseText :gameState="gameState" />
      <RoleText :you="gameState?.you" :hhTarget="getHeadhunterTargetName()" />
      <div
        v-if="!gameState?.you.hasSkippedDiscussion && gameState?.phase === 'DAY_DISCUSSION'"
        style="text-align: center"
      >
        <Button
          @click="skipPhase"
          severity="help"
          size="large"
          style="padding: 0.75rem 2rem; border-radius: 12px; font-weight: 600"
        >
          ⏩ Vote to Skip Discussion
        </Button>
      </div>
    </div>

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
        <div class="chat-input-section">
          <div class="chat-input-wrapper">
            <textarea
              class="chat-input"
              v-model="message"
              placeholder="Type your message..."
              rows="2"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>
            <button @click="sendMessage" class="send-button">Send</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.game-screen {
  min-height: 100vh;
  padding: 2rem;
  background-color: #efefef;
}

.game-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.game-layout {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.players-section {
  flex: 2;
  display: flex;
  justify-content: center;
}

.chat-section {
  flex: 1;
  min-width: 320px;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  height: fit-content;
  animation: slideInRight 0.5s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.chat-header {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-header::before {
  content: '💬';
  font-size: 1.5rem;
}

.scroll-container {
  height: 400px;
  overflow-y: auto;
  padding: 0;
  background: #f7fafc;
}

.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #edf2f7;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.list-item,
.list-item-chat {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  transition: background 0.2s ease;
  animation: messageAppear 0.3s ease;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-item:hover {
  background: #edf2f7;
}

.list-item-chat {
  background: linear-gradient(to right, #fef5e7 0%, #fef9f3 100%);
  border-left: 3px solid #ed8936;
}

.list-item-chat:hover {
  background: linear-gradient(to right, #fdebd0 0%, #fef5e7 100%);
}

.timestamp {
  font-size: 0.75rem;
  color: #a0aec0;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.message-text {
  font-size: 0.9375rem;
  color: #2d3748;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-input-section {
  padding: 1rem;
  background: white;
  border-top: 2px solid #e2e8f0;
}

.chat-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.chat-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  resize: none;
  font-family: inherit;
}

.chat-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-button:active {
  transform: translateY(0);
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
    max-width: 600px;
  }
}

@media (max-width: 600px) {
  .game-screen {
    padding: 1rem;
  }

  .scroll-container {
    height: 300px;
  }
}
</style>
