<script setup lang="ts">
import Panel from 'primevue/panel'

defineProps<{
  role: string | undefined
  hhTarget: string | undefined
}>()
</script>

<template>
  <Panel>
    <main>
      <div v-if="role === 'VILLAGER'">
        Your role is Villager. You do not have any special powers.
      </div>
      <div v-if="role === 'MAFIA'">Your role is Mafia. You can vote to kill players at night.</div>
      <div v-if="role === 'DOCTOR'">
        Your role is Doctor. You can choose to protect someone from mafia at night.
      </div>
      <div v-if="role === 'POLICE'">
        Your role is Police. You can inspect anyone's role at night. It will be revealed as either
        Good, Bad or Unknown. Mafia are bad, fool and headhunter are unknown, villagers, police and
        doctor are good.
      </div>
      <div v-if="role === 'FOOL'">
        Your role is Fool. You win if you get voted and killed by the villagers during the day.
      </div>
      <div v-if="role === 'HEADHUNTER'">
        Your role is Headhunter. Your target is <span style="font-weight: bold">{{hhTarget}}</span>. If the villagers vote and kill
        <span style="font-weight: bold">{{ hhTarget }}</span> during the day, you win.
      </div>
    </main>
  </Panel>
  <br />
</template>

<style scoped></style>
