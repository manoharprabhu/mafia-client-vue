<script setup lang="ts">
import Panel from 'primevue/panel'

defineProps<{
  you:
    | {
        playerId: string
        name: string
        role: 'VILLAGER' | 'MAFIA' | 'DOCTOR' | 'POLICE' | 'FOOL' | 'HEADHUNTER'
        alive: boolean
      }
    | undefined
  hhTarget: string | undefined
}>()
</script>

<template>
  <Panel>
    <main>
      <div v-if="you?.alive">
        <div v-if="you?.role === 'VILLAGER'">
          Your role is Villager. You do not have any special powers.
        </div>
        <div v-if="you?.role === 'MAFIA'">
          Your role is Mafia. You can vote to kill players at night.
        </div>
        <div v-if="you?.role === 'DOCTOR'">
          Your role is Doctor. You can choose to protect someone from mafia at night.
        </div>
        <div v-if="you?.role === 'POLICE'">
          Your role is Police. You can inspect anyone's role at night. It will be revealed as either
          Good, Bad or Unknown. Mafia are bad, fool and headhunter are unknown, villagers, police
          and doctor are good.
        </div>
        <div v-if="you?.role === 'FOOL'">
          Your role is Fool. You win if you get voted and killed by the villagers during the day.
        </div>
        <div v-if="you?.role === 'HEADHUNTER'">
          Your role is Headhunter. Your target is
          <span style="font-weight: bold">{{ hhTarget }}</span
          >. If the villagers vote and kill
          <span style="font-weight: bold">{{ hhTarget }}</span> during the day, you win.
        </div>
      </div>
      <div v-if="!(you?.alive)">
        <span style="color: red; font-weight: bold">You are dead</span>
      </div>
    </main>
  </Panel>
  <br />
</template>

<style scoped></style>
