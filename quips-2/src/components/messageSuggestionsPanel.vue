<script setup lang="ts">
import {useMessageStore} from "@/stores/message";
import {ref} from "vue";

const messageStore = useMessageStore()
const quickEdit = ref('')

const emit = defineEmits<{
  selected: [message: string] // named tuple syntax
  edit
  editAll
  newConversation
  newConvoMode
  quickEditAll: [response: null, hint: string]
}>()

function edit(quip) {
  messageStore.changeEditMessage(quip)
  emit('edit')
  event.stopPropagation()
}

</script>

<template>
  <div>
    <div style="display:flex; gap: 5px; width: 100%; margin-bottom: 10px">
      <v-text-field @keydown.enter="" variant="solo" hide-details="auto"
                    style="min-width: 100px"
                    density="compact" v-model="quickEdit">
        <template v-slot:append-inner>
          <v-icon @click="emit('quickEditAll', null, quickEdit)" style="margin-right: 5px">mdi-auto-fix</v-icon>
          <v-icon @click="emit('selected', quickEdit)">mdi-send</v-icon>
        </template>
      </v-text-field>
      <v-divider vertical style="margin: 0 10px"/>
      <v-btn class="button" style="margin-left: auto;" disabled>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn @click="emit('editAll')" class="button">
        <v-icon>mdi-pencil-box-multiple</v-icon>
        <span style="font-size: 10px">all</span>
      </v-btn>
      <v-divider vertical style="margin: 0 10px"/>
      <v-btn @click="emit('newConversation')" class="button">
        <v-icon>mdi-new-box</v-icon>
      </v-btn>
      <v-btn @click="emit('newConvoMode')" class="button">
        <v-icon>mdi-new-box</v-icon>
        <span style="font-size: 10px">+ Hint</span>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <div class="centred-box" style="flex-wrap: wrap">
      <div
          @click="emit('selected', quip)" class="quipButton" v-for="(quip, index) in messageStore.response"
          :key="index"
      >
        <div style="margin: 10px">{{ quip }}</div>
        <v-btn @click="edit(quip)"
               style="float: right; padding: 10px; border-radius: 20px; min-width: 0;background-color: #4fde53;"
        >
          <v-icon color="white">mdi-pencil</v-icon>
        </v-btn>
      </div>
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

.button {
  min-width: 0;
  font-size: 20px;
  min-height: 40px;
}

</style>