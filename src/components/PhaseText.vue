<script setup lang="ts">
import Panel from 'primevue/panel'
import { computed } from 'vue'

const props = defineProps<{
  phase: string | undefined
}>()

const panelStyle = computed(() => {
  switch (props.phase) {
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
      <div v-if="phase === undefined">-</div>
      <div v-if="phase === 'WAITING_FOR_PLAYERS'">Waiting for players to join</div>
      <div v-if="phase === 'START'">Assigning roles</div>
      <div v-if="phase === 'NIGHT'">Night</div>
      <div v-if="phase === 'RESOLVE_NIGHT'">Night</div>
      <div v-if="phase === 'DAY_DISCUSSION'">Day</div>
      <div v-if="phase === 'DAY_VOTING'">Vote someone out of the village</div>
      <div v-if="phase === 'RESOLVE_DAY'">Vote someone out of the village</div>
    </div>
  </Panel>
  <br />
</template>
<style scoped>
.phase {
  font-size: 1.5em;
}
</style>