<script setup lang="ts">
import Panel from 'primevue/panel'

defineProps<{
  info: 'VILLAGERS_WIN' | 'MAFIA_WIN' | 'HEADHUNTER_WIN' | 'FOOL_WIN' | 'NONE' | undefined
}>()
</script>

<template>
  <div v-if="info !== undefined">
    <Panel class="panel">
      <div v-if="info === 'VILLAGERS_WIN'">Villagers win</div>
      <div v-if="info === 'FOOL_WIN'">The fool wins</div>
      <div v-if="info === 'HEADHUNTER_WIN'">The headhunter wins</div>
      <div v-if="info === 'MAFIA_WIN'">Mafias win</div>
    </Panel>
    <br />
  </div>
</template>

<style scoped>
.panel {
  margin: 0 auto;
  min-height: 100px;
  text-align: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2em;
}
</style>
