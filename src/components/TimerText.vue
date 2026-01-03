<script setup lang="ts">
defineProps<{
  time: number | undefined
}>()
</script>

<template>
  <span v-if="time === undefined">-</span>
  <span v-if="time !== undefined">{{ time }}</span>
</template>
<style scoped></style>
