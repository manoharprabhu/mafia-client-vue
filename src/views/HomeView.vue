<script setup lang="ts">
import Button from 'primevue/button'
import { LocalData } from '@/service/LocalData.ts'
import { onMounted } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)
  const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)
  if (playerId && lobbyId) {
    const gameState = await RestClient.getInstance().getGameState(lobbyId, playerId)
    if (gameState.success && gameState.data !== null) {
      await router.push('/gamescreen')
    }
  }
})

</script>
<template>
  <main class="home-container">
    <div class="home-content">
      <div class="logo-section">
        <h1 class="game-title">Mafia</h1>
      </div>

      <div class="button-group">
        <Button @click="$router.push('/creategame')" class="main-button create-button" size="large">
          Create a Game
        </Button>

        <Button
          @click="$router.push('/joingame')"
          class="main-button join-button"
          severity="secondary"
          size="large"
        >
          Join a Game
        </Button>
      </div>
    </div>
  </main>
</template>
<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #efefef;
}

.home-content {
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  margin-bottom: 3rem;
}

.logo-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-emoji {
  font-size: 4rem;
}

.game-title {
  font-size: 4rem;
  font-weight: 800;
  color: #121212;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
}

.game-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.main-button {
  width: 100%;
  height: 60px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.main-button:active {
  transform: translateY(0);
}

.create-button {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.create-button:hover {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
}

.join-button {
  background: white;
  color: #667eea;
}

.join-button:hover {
  background: #f7fafc;
  color: #5568d3;
}

.button-icon {
  font-size: 1.5rem;
}

.info-cards {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.info-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.info-icon {
  font-size: 1.5rem;
}

.info-text {
  font-size: 0.875rem;
  color: white;
  font-weight: 500;
}

@media (max-width: 600px) {
  .game-title {
    font-size: 3rem;
  }

  .info-cards {
    flex-direction: column;
  }

  .info-card {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
