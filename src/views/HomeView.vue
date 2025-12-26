<script setup lang="ts"></script>
<template>
  <main>
    <header>
      <h1>Mafia</h1>
    </header>
    <div>
      <button @click="$router.push('/creategame')">Create a game</button>
    </div>
    <br />
    <div>
      <button>Join a game</button>
    </div>
  </main>
</template>
