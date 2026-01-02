<script setup lang="ts">
import { ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import IftaLabel from 'primevue/iftalabel'

const name = ref<string>('')
const lobbyId = ref<string>('')
const errorMessage = ref<string>('')
const isDisabled = ref<boolean>(false)
const ip = ref('http://192.168.0.110:8080')
const router = useRouter()

async function join() {
  LocalData.getInstance().setData(LocalData.IP, ip.value)
  RestClient.overrideHost(ip.value)
  isDisabled.value = true
  try {
    const response = await RestClient.getInstance().joinGame(lobbyId.value, name.value)
    if (!response.success) {
      errorMessage.value = response.message
      return
    }
    const playerId = response.data.playerId
    LocalData.getInstance().setData(LocalData.PLAYERID, playerId)
    LocalData.getInstance().setData(LocalData.LOBBYID, lobbyId.value)
    await router.push('/lobby')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isDisabled.value = false
  }
}
</script>

<template>
  <main>
    <header>
      <h1>Join a game</h1>
    </header>
    <div>
      <IftaLabel>
        <InputText id="ip" v-model="ip" type="text" />
        <label for="ip">Server IP address and port</label>
      </IftaLabel>
    </div>
    <br />
    <div>
      <IftaLabel>
        <InputText id="name" v-model="name" type="text" />
        <label for="name">Your name</label>
      </IftaLabel>
    </div>
    <br />
    <div>
      <IftaLabel>
        <InputText id="lobbyId" v-model="lobbyId" type="text" />
        <label for="lobbyId">Lobby ID</label>
      </IftaLabel>
    </div>
    <br />
    <div>
      <Button :disabled="isDisabled" @click="join">Join</Button>
    </div>
    <div :hidden="errorMessage === ''">
      <Message severity="error">{{ errorMessage }}</Message>
    </div>
  </main>
</template>
