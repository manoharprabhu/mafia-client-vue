<script setup lang="ts">
import Panel from 'primevue/panel'
import { computed } from 'vue'

const props = defineProps<{
  you:
    | {
        playerId: string
        name: string
        role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
        alive: boolean
      }
    | undefined
  hhTarget: string | undefined
}>()

const roleInfo = computed(() => {
  if (!props.you) return null
  
  const roles = {
    VILLAGER: {
      icon: '👨‍🌾',
      color: '#48bb78',
      bgColor: 'rgba(72, 187, 120, 0.1)',
      title: 'Villager',
      description: 'You do not have any special powers. Help identify the mafia during discussions and vote wisely.'
    },
    MAFIA: {
      icon: '🔪',
      color: '#f56565',
      bgColor: 'rgba(245, 101, 101, 0.1)',
      title: 'Mafia',
      description: 'You can vote to eliminate players at night. Work with other mafia members to eliminate villagers.'
    },
    DOCTOR: {
      icon: '⚕️',
      color: '#4299e1',
      bgColor: 'rgba(66, 153, 225, 0.1)',
      title: 'Doctor',
      description: 'You can choose to protect someone from mafia attacks at night. Choose wisely to save lives.'
    },
    POLICE: {
      icon: '👮',
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      title: 'Police',
      description: 'You can inspect one player each night. Results show as Good (Villager/Police/Doctor), Bad (Mafia), or Unknown (Fool/Headhunter).'
    },
    FOOL: {
      icon: '🤡',
      color: '#ed8936',
      bgColor: 'rgba(237, 137, 54, 0.1)',
      title: 'Fool',
      description: 'You win if you get voted out by the villagers during the day. Convince them to vote for you!'
    },
    HEADHUNTER: {
      icon: '🎯',
      color: '#9f7aea',
      bgColor: 'rgba(159, 122, 234, 0.1)',
      title: 'Headhunter',
      description: `Your target is ${props.hhTarget}. You win if the villagers vote out your target during the day.`
    }
  }
  
  return roles[props.you.role]
})
</script>

<template>
  <div v-if="you" class="role-container">
    <div v-if="you.alive" class="role-card" :style="{ backgroundColor: roleInfo?.bgColor, borderColor: roleInfo?.color }">
      <div class="role-header">
        <span class="role-icon">{{ roleInfo?.icon }}</span>
        <div class="role-title-section">
          <span class="role-label">Your Role</span>
          <h3 class="role-title" :style="{ color: roleInfo?.color }">{{ roleInfo?.title }}</h3>
        </div>
      </div>
      <p class="role-description">{{ roleInfo?.description }}</p>
    </div>
    <div v-else class="death-card">
      <span class="death-icon">⚰️</span>
      <div class="death-text">
        <h3 class="death-title">You are Dead</h3>
        <p class="death-subtitle">You can no longer participate in the game</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-container {
  margin-bottom: 1.5rem;
}

.role-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid;
  transition: all 0.3s ease;
  animation: roleReveal 0.6s ease;
}

@keyframes roleReveal {
  from {
    opacity: 0;
    transform: rotateY(-10deg);
  }
  to {
    opacity: 1;
    transform: rotateY(0);
  }
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.role-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.role-icon {
  font-size: 3rem;
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

.role-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.role-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #718096;
  font-weight: 600;
}

.role-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.role-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.death-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid #4a5568;
}

.death-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.death-text {
  flex: 1;
}

.death-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fc8181;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.death-subtitle {
  font-size: 0.875rem;
  color: #cbd5e0;
  margin: 0;
}

@media (max-width: 600px) {
  .role-card,
  .death-card {
    padding: 1rem;
  }
  
  .role-icon,
  .death-icon {
    font-size: 2rem;
  }
  
  .role-title {
    font-size: 1.25rem;
  }
  
  .death-title {
    font-size: 1.25rem;
  }
}
</style>
