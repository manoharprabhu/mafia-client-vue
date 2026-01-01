<script setup lang="ts">
import Panel from 'primevue/panel'

defineProps<{
  time: number | undefined
}>()
</script>

<template>
  <span v-if="time === undefined">-</span>
  <span v-if="time !== undefined">{{ time }}</span>
</template>
<style scoped></style>
