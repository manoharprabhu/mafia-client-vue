<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'
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
const router = useRouter()
import Card from 'primevue/card'
import Divider from 'primevue/divider';
import Button from 'primevue/button';

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
    if (response.data.currentPhase !== 'WAITING_FOR_PLAYERS') {
      await router.push('/gamescreen')
    }
  } catch (error) {
    console.error(error)
  }
}

async function startGame() {
  const lId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
  const pId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
  var response = await RestClient.getInstance().startGame(lId, pId)
  await router.push('/gamescreen')
}
</script>
<template>
  <main class="lobby-container">
    <div class="lobby-content">
      <div class="lobby-header">
        <h1 class="lobby-title">Game Lobby</h1>
        <div class="lobby-code-section">
          <span class="lobby-code-label">Lobby Code</span>
          <div class="lobby-code">{{ lobbyId }}</div>
          <span class="lobby-code-hint">Share this code with your friends</span>
        </div>
      </div>

      <div class="players-card">
        <div class="players-header">
          <h2 class="players-title">Players</h2>
          <div class="player-count">
            <span class="count-number">{{ players.length }}</span>
            <span class="count-separator">/</span>
            <span class="count-total">10+</span>
          </div>
        </div>
        
        <div class="players-list">
          <div 
            v-for="(item, index) in players" 
            :key="item.playerId" 
            class="player-item"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="player-info">
              <span class="player-name">{{ item.playerName }}</span>
              <span v-if="item.playerId === playerId" class="you-badge">YOU</span>
            </div>
            <div v-if="!isNotCreator && item.playerId === playerId" class="crown-icon">👑</div>
          </div>
        </div>

        <div class="waiting-message" v-if="players.length < 10">
          <div class="pulse-dot"></div>
          <span>Waiting for {{ 10 - players.length }} more player{{ 10 - players.length !== 1 ? 's' : '' }}...</span>
        </div>
      </div>

      <div class="action-section" v-if="!isNotCreator">
        <Button 
          :disabled="!canStartGame" 
          @click="startGame"
          class="start-button"
          size="large"
        >
          <span v-if="canStartGame">Start Game</span>
          <span v-else>Waiting for Players</span>
        </Button>
        <p class="requirement-text" v-if="!canStartGame">
          Need at least 10 players to start
        </p>
      </div>

      <div class="waiting-host" v-else>
        <div class="pulse-dot"></div>
        <span>Waiting for host to start the game...</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.lobby-container {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lobby-content {
  max-width: 600px;
  width: 100%;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lobby-header {
  text-align: center;
  margin-bottom: 2rem;
}

.lobby-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.lobby-code-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.lobby-code-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lobby-code {
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: 4px;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.lobby-code-hint {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
}

.players-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.players-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.player-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 700;
}

.count-number {
  font-size: 1.875rem;
  color: #667eea;
}

.count-separator {
  font-size: 1.25rem;
  color: #a0aec0;
}

.count-total {
  font-size: 1.25rem;
  color: #718096;
}

.players-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  animation: slideInLeft 0.4s ease-out both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.player-item:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.player-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-emoji {
  font-size: 1.5rem;
}

.player-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.you-badge {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.crown-icon {
  font-size: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.waiting-message,
.waiting-host {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff8e1;
  border-radius: 12px;
  color: #8b6914;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ed8936;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.action-section {
  text-align: center;
}

.start-button {
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
}

.start-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
}

.requirement-text {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.waiting-host {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1.25rem;
  border-radius: 12px;
}

@media (max-width: 600px) {
  .lobby-title {
    font-size: 2rem;
  }
  
  .lobby-code {
    font-size: 1.5rem;
  }
  
  .players-card {
    padding: 1.5rem;
  }
}
</style>