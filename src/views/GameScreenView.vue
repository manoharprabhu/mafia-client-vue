<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { type GetGameResponse, RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import PhaseText from '@/components/PhaseText.vue'
import TimerText from '@/components/TimerText.vue'
import GamePlayersList from '@/components/GamePlayersList.vue'
import RoleText from '@/components/RoleText.vue'

const gameState = ref<GetGameResponse>()
const scrollContainerRef = ref<HTMLElement | null>(null)

let timerHandle: number
onMounted(() => {
  timerHandle = setInterval(async () => {
    const playerId = LocalData.getInstance().getData<string>(LocalData.PLAYERID)!
    const lobbyId = LocalData.getInstance().getData<string>(LocalData.LOBBYID)!
    const response = await RestClient.getInstance().getGameState(lobbyId, playerId)
    if (response.success) {
      gameState.value = response.data
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerHandle)
})

watch(
  () => gameState.value?.messages?.length,
  async () => {
    await nextTick()
    const el = scrollContainerRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  },
)

function formatMsToHHMMsss(timestamp: number) {
  const date = new Date(timestamp)

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0')

  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}
</script>

<template>
  <main>
    <div>
      <div><PhaseText :gameState="gameState" /></div>
      <div><RoleText :role="gameState?.you.role" /></div>
      <div>
        <GamePlayersList
          :players="gameState?.players"
          :visibleRoles="gameState?.visibleRoles"
          :phase="gameState?.phase"
          :voteMap="gameState?.voteMap"
          :inspectionResults="gameState?.inspectionResults"
          :you="gameState?.you!"
        />
      </div>
      <div>
        <div class="scroll-container" ref="scrollContainerRef">
          <div v-for="(item, index) in gameState?.messages" :key="index" class="list-item">
            {{ formatMsToHHMMsss(item.timestamp) }} {{ item.message }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.scroll-container {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.list-item {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
