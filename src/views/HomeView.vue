<script setup lang="ts">
import Button from 'primevue/button'
</script>
<template>
  <main>
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
  </main>
</template>
