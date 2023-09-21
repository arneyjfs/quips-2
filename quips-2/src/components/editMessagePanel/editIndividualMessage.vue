<script setup lang="ts">
import {useMessageStore} from "@/stores/message";
import EditControls from "@/components/editMessagePanel/editControls.vue";

const messageStore = useMessageStore()

const emit = defineEmits<{
  close,
  modify: [reponse: string, hint: string],
  send: [message: string]
}>()

function makeModification(hint: string) {
  emit('modify', messageStore.editingMessage, hint)
}

</script>

<template>
  <div>
    <div style="display:flex; align-items:center; margin-bottom: 20px">
      <div>
        <v-btn rounded @click="emit('close')"
               style="padding: 0; height: 35px; width: 35px; margin: 0; min-width: 0; background-color: #dedede">
          <v-icon style="width: 35px; height: 35px">mdi-close</v-icon>
        </v-btn>
      </div>
      <div style="width: 100%; margin-left: 20px">
        <v-text-field contenteditable="true" v-model="messageStore.editingMessage" hide-details="auto" variant="solo"
                      bg-color="#eeeeee" v-on:keydown.enter="emit('send', messageStore.editingMessage); emit('close')"
        >
          <template v-slot:append-inner>
            <v-icon @click="emit('send', messageStore.editingMessage); emit('close')" id="sendButton">mdi-send</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
    <edit-controls @modify="makeModification"/>
  </div>
</template>

<style scoped>

</style>