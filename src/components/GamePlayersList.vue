<script setup lang="ts">
import Tag from 'primevue/tag'

defineProps<{
  yourId: string | undefined
  players: [{ playerId: string; name: string; alive: boolean }] | undefined
  visibleRoles:
    | {
        [key: string]: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
      }
    | undefined
}>()
</script>

<template>
  <div class="grid-container">
    <div v-for="item in players" :key="item.playerId" class="grid-item">
      <span :class="{ 'strikethrough-text': !item.alive }">{{ item.name }}</span>
      <div :hidden="item.playerId !== yourId"><Tag severity="success" value="YOU"></Tag></div>
      <div :hidden="item.alive"><Tag severity="danger" value="DEAD" /></div>
      <div v-if="visibleRoles !== undefined && visibleRoles[item.playerId] === 'MAFIA'">
        <Tag severity="warn" value="MAFIA" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: auto;
}

.grid-item {
  background-color: #efefef;
  padding: 1rem;
  text-align: center;
  color: #010101;
  border-radius: 5px;
}
.strikethrough-text {
  text-decoration: line-through;
}
</style>
