<script setup lang="ts">
import Panel from 'primevue/panel'

defineProps<{
  time: number | undefined
}>()
</script>

<template>
  <Panel>
    <main>
      <div v-if="time === undefined">-</div>
      <div v-if="time !== undefined" class="time">{{ time }}</div>
    </main>
  </Panel>
  <br />
</template>
<style scoped>
.time {
  font-size: 2em;
  font-weight: bold;
}
</style>
