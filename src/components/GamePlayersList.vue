<script setup lang="ts">
import Tag from 'primevue/tag'

defineProps<{
  yourId: string | undefined
  players: [{ playerId: string; name: string; alive: boolean }] | undefined
}>()
</script>

<template>
  <div v-for="item in players" :key="item.playerId">
    <span :class="{ 'strikethrough-text': !item.alive }">{{ item.name }}</span>
    <span :hidden="item.playerId !== yourId"><Tag severity="success" value="YOU"></Tag></span>
    <span :hidden="item.alive"><Tag severity="danger" value="DEAD"></Tag></span>
  </div>
</template>
