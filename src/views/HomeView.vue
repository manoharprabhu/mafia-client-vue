<script setup lang="ts">
import Button from 'primevue/button'
import Panel from 'primevue/panel'
</script>
<template>
  <main class="container">
    <Panel class="panel">
      <header>
        <h1>Mafia</h1>
      </header>

      <div>
        <Button @click="$router.push('/creategame')">Create a game</Button>
      </div>
      <br />
      <div>
        <Button @click="$router.push('/joingame')">Join a game</Button>
      </div>
    </Panel>
  </main>
</template>
<style scoped>
.container {
  display: grid;
  place-items: center; /* Centers both horizontally and vertically */
  height: 100vh; /* Example: Centers in the full viewport height */
}
.panel {
  margin-left: auto;
  margin-right: auto;
  width: 25%;
}
</style>
