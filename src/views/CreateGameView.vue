<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import IftaLabel from 'primevue/iftalabel'

const name = ref('')
const isDisabled = ref(false)
const errorMessage = ref('')
const ip = ref('http://localhost:8080')
const router = useRouter()

async function create() {
  try {
    isDisabled.value = true
    LocalData.getInstance().setData(LocalData.IP, ip.value)
    RestClient.overrideHost(ip.value)
    const response = await RestClient.getInstance().createGame(name.value)
    if (!response.success) {
      errorMessage.value = response.message
      return
    }
    const playerId = response.data.playerId
    const lobbyId = response.data.lobbyId
    LocalData.getInstance().setData(LocalData.PLAYERID, playerId)
    LocalData.getInstance().setData(LocalData.LOBBYID, lobbyId)
    await router.push('/lobby')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isDisabled.value = false
  }
}

onMounted(() => {})
</script>

<template>
  <main>
    <header>
      <h1>Create a game</h1>
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
      <Button :disabled="isDisabled" @click="create">Create</Button>
    </div>
    <br />
    <div :hidden="errorMessage === ''">
      <Message severity="error">{{ errorMessage }}</Message>
    </div>
  </main>
</template>
