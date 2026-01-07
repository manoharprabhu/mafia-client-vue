<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  time: number | undefined
}>()

const isUrgent = computed(() => {
  return props.time !== undefined && props.time <= 10
})

const isWarning = computed(() => {
  return props.time !== undefined && props.time > 10 && props.time <= 30
})
</script>

<template>
  <span 
    class="timer-display"
    :class="{ 'urgent': isUrgent, 'warning': isWarning }"
  >
    <span v-if="time === undefined" class="timer-value">-</span>
    <span v-else class="timer-value">{{ time }}</span>
  </span>
</template>

<style scoped>
.timer-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timer-value {
  font-family: 'Courier New', monospace;
  font-size: 1.75rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
  min-width: 3rem;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease;
}

.timer-display.warning .timer-value {
  background: rgba(237, 137, 54, 0.2);
  color: #c05621;
  animation: pulse-warning 1.5s ease-in-out infinite;
}

.timer-display.urgent .timer-value {
  background: rgba(245, 101, 101, 0.3);
  color: #c53030;
  animation: pulse-urgent 0.8s ease-in-out infinite;
  font-size: 2rem;
}

@keyframes pulse-warning {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(237, 137, 54, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(237, 137, 54, 0);
  }
}

@keyframes pulse-urgent {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 101, 101, 0.6);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(245, 101, 101, 0);
  }
}
</style>
