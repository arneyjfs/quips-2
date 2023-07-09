<script setup lang="ts">
import {useMessageStore} from "@/stores/message";

const messageStore = useMessageStore()


const emit = defineEmits<{
  selected: [message: string] // named tuple syntax
  edit: [message: string] // named tuple syntax
}>()

function edit(quip) {
  messageStore.changeEditMessage(quip)
  emit('edit')
  event.stopPropagation()
}

</script>

<template>
  <div class="centred-box" style="flex-wrap: wrap">
    <div
        v-on:click="emit('selected', quip)" class="quipButton" v-for="(quip, index) in messageStore.response"
        :key="index"
    >
      <div style="margin: 10px">{{ quip }}</div>
      <v-btn v-on:click="edit(quip)"
             style="float: right; padding: 10px; border-radius: 20px; min-width: 0;background-color: #4fde53;"
      >
        <v-icon color="white">mdi-pencil</v-icon>
      </v-btn>
    </div>
  </div>

</template>

<style scoped>

.quipButton {
  cursor: pointer;
  background-color: #43CC47;
  color: white;
  border-radius: 20px;
  box-shadow: 0 2px 3px rgba(38, 38, 38, 0.7);
  text-align: center;
  display: flex;
  margin: 10px;
  min-width: 100px;
  max-width: 300px;
}

</style>