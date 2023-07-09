<script setup lang="ts">
import {useMessageStore} from "@/stores/message";

const messageStore = useMessageStore()
let customEdit: string = ''

const emit = defineEmits<{
  close,
  modify: [reponse: string, hint: string]
}>()

function makeModification(hint: string) {
  emit('modify', messageStore.editingMessage, hint)
}

</script>

<template>
  <div style="display:flex; align-items:center; margin-bottom: 20px">
    <div>
      <v-btn rounded @click="emit('close')"
             style="padding: 0; height: 35px; width: 35px; margin: 0; min-width: 0; background-color: #dedede">
        <v-icon style="width: 35px; height: 35px">mdi-close</v-icon>
      </v-btn>
    </div>
    <div style="width: 100%; margin-left: 20px">
      <v-text-field contenteditable="true" v-model="messageStore.editingMessage" hide-details="auto" variant="solo"
                    bg-color="#eeeeee"
      >
        <template v-slot:append-inner>
          <v-icon @click="" id="sendButton">mdi-send</v-icon>
        </template>
      </v-text-field>
    </div>
  </div>
  <div class="centred-box" style="flex-wrap: wrap">
    <div class="editChip" style="background-color: #c800ff">
      <v-btn icon class="buttonArrStart" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response happier')">😁
      </v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response sadder')">😔
      </v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response angrier')">😡
      </v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response seem more surprised')">😮</v-btn>
      <v-btn icon class="buttonArrEnd" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response more nervous')">🫣</v-btn>
    </div>
    <div class="editChip" style="background-color: #00aeff">
      <v-btn icon style="background-color: #62d0ff; color: white"
             @click="makeModification('make the tone more casual')">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <div style="margin: 10px; color: white">Formality</div>
      <v-btn icon style="background-color: #62d0ff; color: white"
             @click="makeModification('make the tone more formal')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="editChip" style="background-color: #00aeff">
      <v-btn icon style="background-color: #62d0ff; color: white"
             @click="makeModification('make the response more generic')">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <div style="margin: 10px; color: white">Detail</div>
      <v-btn icon style="background-color: #62d0ff; color: white"
             @click="makeModification('make the response more detailed')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="editChip" style="background-color: #6cd35b">
      <v-btn class="buttonArrStart" rounded="xl" style="background-color: #8de881; color: #4d4d4d; height: 48px;"
             @click="makeModification('make the response past tense')">
        <v-icon>mdi-step-backward</v-icon>
        Past
      </v-btn>
      <v-btn class="buttonArr" rounded="xl" style="background-color: #8de881; color: #4d4d4d; height: 48px;"
             @click="makeModification('make the response present tense')">Present
      </v-btn>
      <v-btn class="buttonArrEnd" rounded="xl" style="background-color: #8de881; color: #4d4d4d; height: 48px;"
             @click="makeModification('make the response in the future tense')">Future
        <v-icon>mdi-step-forward</v-icon>
      </v-btn>
    </div>
    <div class="editChip" style="background-color: #ffdd00">
      <div style="margin: 10px; display:flex; align-items:center">Hint</div>
      <div>
        <v-text-field variant="solo" rounded hide-details="auto" style="width: 200px" bg-color="#ffe970"
                      density="comfortable" v-model="customEdit">
          <template v-slot:append-inner>
            <v-icon @click="makeModification(customEdit)" id="sendButton">mdi-send</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="editChip" style="background-color: #c800ff">
      <v-btn icon class="buttonArrStart" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response about football')">⚽️</v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response about food')">🧑‍🍳</v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response about family')">👨‍👩‍👧</v-btn>
      <v-btn icon class="buttonArr" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response about the news')">🗞️</v-btn>
      <v-btn icon class="buttonArrEnd" style="font-size: 25px; background-color: #db74f8"
             @click="makeModification('make the response about health')">🏥</v-btn>
    </div>
  </div>
</template>

<style scoped>

.editChip {
  border-radius: 30px;
  padding: 5px;
  margin: 10px;
  display: flex;
  justify-content: center;
}

.buttonArr {
  margin: 0 3px 0 3px;
}

.buttonArrStart {
  margin: 0 3px 0 0;
  height: 70px;
}

.buttonArrEnd {
  margin: 0 0 0 3px;
  height: 70px;
}

</style>