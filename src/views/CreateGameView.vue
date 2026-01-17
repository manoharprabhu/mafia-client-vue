<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RestClient } from '@/service/RestClient.ts'
import { LocalData } from '@/service/LocalData.ts'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
const name = ref('')
const isDisabled = ref(false)
const errorMessage = ref('')
const ip = ref(RestClient.root)
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
  <main class="form-container">
    <div class="form-card">
      <div class="form-header">
        <button @click="$router.push('/')" class="back-button">←</button>
        <div>
          <h1 class="form-title">Create a Game</h1>
          <p class="form-subtitle">Set up a new Mafia game lobby</p>
        </div>
      </div>

      <div class="form-content">
        <div class="input-group">
          <label class="input-label">Server IP Address</label>
          <InputText
            id="ip"
            v-model="ip"
            type="text"
            class="custom-input"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Your Name</label>
          <InputText
            id="name"
            v-model="name"
            type="text"
            class="custom-input"
            placeholder="Enter your name"
            @keyup.enter="create"
          />
        </div>

        <Button
          :disabled="isDisabled || !name"
          @click="create"
          class="submit-button"
          size="large"
        >
          <span v-if="!isDisabled">✨ Create Lobby</span>
          <span v-else>⏳ Creating...</span>
        </Button>

        <div v-if="errorMessage" class="error-container">
          <Message severity="error" class="error-message">{{ errorMessage }}</Message>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.form-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
}

.form-content {
  padding: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.custom-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-button {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-container {
  margin-top: 1.5rem;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  border-radius: 10px;
}

@media (max-width: 600px) {
  .form-card {
    border-radius: 0;
  }

  .form-header {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }
}
</style>
