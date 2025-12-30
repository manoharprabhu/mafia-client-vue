<script setup lang="ts">
defineProps<{
  time: number | undefined
}>()
</script>

<template>
  <div v-if="time === undefined">Time left: 0</div>
  <div v-if="time !== undefined">Time left: {{ time }}</div>
</template>
