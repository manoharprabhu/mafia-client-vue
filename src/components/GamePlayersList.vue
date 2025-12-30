<script setup lang="ts">
defineProps<{
  yourId: string | undefined
  players: [{ playerId: string; name: string; alive: boolean }] | undefined
}>()
</script>

<template>
  <div v-for="item in players" :key="item.playerId">
    <span :class="{ 'strikethrough-text': !item.alive }">{{ item.name }}</span>
    <span style="font-weight: bold" :hidden="item.playerId !== yourId">(YOU)</span>
    <span style="font-weight: bold" :hidden="item.alive">(DEAD)</span>
  </div>
</template>

<style scoped>
.strikethrough-text {
  text-decoration: line-through;
}
</style>
