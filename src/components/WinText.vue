<script setup lang="ts">
import Panel from 'primevue/panel'
import { computed } from 'vue'

const props = defineProps<{
  info: 'VILLAGERS_WIN' | 'MAFIA_WIN' | 'HEADHUNTER_WIN' | 'FOOL_WIN' | 'NONE' | undefined
}>()

const winnerInfo = computed(() => {
  const winners = {
    VILLAGERS_WIN: {
      icon: '🎉',
      title: 'Villagers Win!',
      subtitle: 'The village has been saved from the mafia',
      gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
    },
    MAFIA_WIN: {
      icon: '🔪',
      title: 'Mafia Wins!',
      subtitle: 'The mafia has taken over the village',
      gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
    },
    HEADHUNTER_WIN: {
      icon: '🎯',
      title: 'Headhunter Wins!',
      subtitle: 'The headhunter has eliminated their target',
      gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)'
    },
    FOOL_WIN: {
      icon: '🤡',
      title: 'The Fool Wins!',
      subtitle: 'The fool has successfully deceived everyone',
      gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
    }
  }
  
  return props.info && props.info !== 'NONE' ? winners[props.info] : null
})
</script>

<template>
  <div v-if="winnerInfo" class="win-overlay">
    <div class="win-card">
      <div class="confetti">
        <span class="confetti-piece" v-for="i in 20" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></span>
      </div>
      <div class="win-content" :style="{ background: winnerInfo.gradient }">
        <div class="win-icon">{{ winnerInfo.icon }}</div>
        <h1 class="win-title">{{ winnerInfo.title }}</h1>
        <p class="win-subtitle">{{ winnerInfo.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: overlayAppear 0.5s ease;
}

@keyframes overlayAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.win-card {
  position: relative;
  max-width: 600px;
  width: 90%;
  animation: winCardAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes winCardAppear {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.win-content {
  padding: 4rem 3rem;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.win-icon {
  font-size: 6rem;
  margin-bottom: 1.5rem;
  animation: iconBounce 1s ease infinite;
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.win-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.win-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
}

.confetti {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.8);
  top: -10px;
  animation: confettiFall 3s linear infinite;
}

.confetti-piece:nth-child(odd) {
  background: rgba(255, 215, 0, 0.8);
}

.confetti-piece:nth-child(3n) {
  background: rgba(255, 105, 180, 0.8);
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.confetti-piece:nth-child(1) { left: 10%; }
.confetti-piece:nth-child(2) { left: 20%; }
.confetti-piece:nth-child(3) { left: 30%; }
.confetti-piece:nth-child(4) { left: 40%; }
.confetti-piece:nth-child(5) { left: 50%; }
.confetti-piece:nth-child(6) { left: 60%; }
.confetti-piece:nth-child(7) { left: 70%; }
.confetti-piece:nth-child(8) { left: 80%; }
.confetti-piece:nth-child(9) { left: 90%; }
.confetti-piece:nth-child(10) { left: 15%; }
.confetti-piece:nth-child(11) { left: 25%; }
.confetti-piece:nth-child(12) { left: 35%; }
.confetti-piece:nth-child(13) { left: 45%; }
.confetti-piece:nth-child(14) { left: 55%; }
.confetti-piece:nth-child(15) { left: 65%; }
.confetti-piece:nth-child(16) { left: 75%; }
.confetti-piece:nth-child(17) { left: 85%; }
.confetti-piece:nth-child(18) { left: 95%; }
.confetti-piece:nth-child(19) { left: 5%; }
.confetti-piece:nth-child(20) { left: 50%; }

@media (max-width: 600px) {
  .win-content {
    padding: 3rem 2rem;
  }
  
  .win-icon {
    font-size: 4rem;
  }
  
  .win-title {
    font-size: 2.5rem;
  }
  
  .win-subtitle {
    font-size: 1rem;
  }
}
</style>
