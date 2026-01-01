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
        backgroundColor: '#f5f5f5',
        color: '#333333',
      }

    case 'START':
      return {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
      }

    case 'NIGHT':
    case 'RESOLVE_NIGHT':
      return {
        backgroundColor: '#1a1a2e',
        color: '#eaeaea',
      }

    case 'DAY_DISCUSSION':
      return {
        backgroundColor: '#fff8e1',
        color: '#5d4037',
      }

    case 'DAY_VOTING':
    case 'RESOLVE_DAY':
      return {
        backgroundColor: '#ffebee',
        color: '#b71c1c',
      }

    default:
      return {
        backgroundColor: '#ffffff',
        color: '#000000',
      }
  }
})
</script>

<template>
  <Panel :style="panelStyle">
    <div class="phase">
      <span v-if="gameState === undefined">-</span>
      <span v-if="gameState?.phase === 'WAITING_FOR_PLAYERS'">Waiting for players to join</span>
      <span v-if="gameState?.phase === 'START'">Assigning roles</span>
      <span v-if="gameState?.phase === 'NIGHT'">Night</span>
      <span v-if="gameState?.phase === 'RESOLVE_NIGHT'">Night</span>
      <span v-if="gameState?.phase === 'DAY_DISCUSSION'">Day</span>
      <span v-if="gameState?.phase === 'DAY_VOTING'">Day - Vote someone out of the village</span>
      <span v-if="gameState?.phase === 'RESOLVE_DAY'">Day - Vote someone out of the village</span>
      (<TimerText :time="gameState?.timeRemainingSeconds" /> seconds left)
    </div>
  </Panel>
  <br />
</template>
<style scoped>
.phase {
  font-size: 1.5em;
}
</style>