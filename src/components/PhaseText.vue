<script setup lang="ts">
import Panel from 'primevue/panel'
import { computed } from 'vue'
import TimerText from '@/components/TimerText.vue'
import type { GetGameResponse } from '@/service/RestClient.ts'

const props = defineProps<{
  gameState: GetGameResponse | undefined
}>()

const panelStyle = computed(() => {
  switch (props.gameState?.phase) {
    case 'WAITING_FOR_PLAYERS':
      return {
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
        color: '#2d3748',
        borderColor: '#a0aec0',
      }

    case 'START':
      return {
        background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
        color: '#ffffff',
        borderColor: '#2b6cb0',
      }

    case 'NIGHT':
    case 'RESOLVE_NIGHT':
      return {
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: '#f7fafc',
        borderColor: '#4a5568',
      }

    case 'DAY_DISCUSSION':
      return {
        background: 'linear-gradient(135deg, #fbd38d 0%, #f6ad55 100%)',
        color: '#744210',
        borderColor: '#dd6b20',
      }

    case 'DAY_VOTING':
    case 'RESOLVE_DAY':
      return {
        background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
        color: '#ffffff',
        borderColor: '#e53e3e',
      }

    default:
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        color: '#2d3748',
        borderColor: '#e2e8f0',
      }
  }
})

const phaseIcon = computed(() => {
  switch (props.gameState?.phase) {
    case 'NIGHT':
    case 'RESOLVE_NIGHT':
      return '🌙'
    case 'DAY_DISCUSSION':
      return '☀️'
    case 'DAY_VOTING':
    case 'RESOLVE_DAY':
      return '🗳️'
    case 'START':
      return '🎮'
    default:
      return '⏳'
  }
})
</script>

<template>
  <div 
    class="phase-container" 
    :style="{
      background: panelStyle.background,
      color: panelStyle.color,
      borderColor: panelStyle.borderColor
    }"
  >
    <div class="phase-content">
      <span class="phase-icon">{{ phaseIcon }}</span>
      <div class="phase-text">
        <span class="phase-label" v-if="gameState === undefined">Loading...</span>
        <span class="phase-label" v-if="gameState?.phase === 'WAITING_FOR_PLAYERS'">Waiting for players to join</span>
        <span class="phase-label" v-if="gameState?.phase === 'START'">Assigning roles</span>
        <span class="phase-label" v-if="gameState?.phase === 'NIGHT'">Night Phase</span>
        <span class="phase-label" v-if="gameState?.phase === 'RESOLVE_NIGHT'">Night Phase</span>
        <span class="phase-label" v-if="gameState?.phase === 'DAY_DISCUSSION'">Day Discussion</span>
        <span class="phase-label" v-if="gameState?.phase === 'DAY_VOTING'">Voting Time</span>
        <span class="phase-label" v-if="gameState?.phase === 'RESOLVE_DAY'">Voting Time</span>
        <div class="timer-section">
          <TimerText :time="gameState?.timeRemainingSeconds" />
          <span class="timer-label">seconds remaining</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.phase-container {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid;
  transition: all 0.3s ease;
}

.phase-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-start;
}

.phase-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.phase-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.phase-label {
  font-size: 1rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.timer-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.timer-label {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
}

@media (max-width: 600px) {
  .phase-container {
    padding: 0.5rem 0.75rem;
  }
  
  .phase-icon {
    font-size: 1.25rem;
  }
  
  .phase-label {
    font-size: 0.875rem;
  }
  
  .timer-section {
    font-size: 0.75rem;
  }
}
</style>