<script setup lang="ts">
defineProps<{
  phase: string | undefined
}>()
</script>

<template>
  <div v-if="phase === undefined">-</div>
  <div v-if="phase === 'WAITING_FOR_PLAYERS'">Waiting for players to join</div>
  <div v-if="phase === 'START'">Assigning roles</div>
  <div v-if="phase === 'NIGHT'">Night</div>
  <div v-if="phase === 'RESOLVE_NIGHT'">Night</div>
  <div v-if="phase === 'DAY_DISCUSSION'">Day</div>
  <div v-if="phase === 'DAY_VOTING'">Vote someone out of the village</div>
  <div v-if="phase === 'RESOLVE_DAY'">Vote someone out of the village</div>
</template>
