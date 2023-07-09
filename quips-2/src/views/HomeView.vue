<script setup>
import repositoryFactory from "@/repositories/RepositoryFactory";
import {useMessageStore} from '@/stores/message'
import ResizablePane from "@/components/resizablePane.vue";
import {nextTick, onMounted, ref} from "vue";
import MessageBubble from "@/components/messageBubble.vue";
import MessageSuggestionsPanel from "@/components/messageSuggestionsPanel.vue";
import EditMessagePanel from "@/components/editMessagePanel.vue";

let mediaRecorder;
const options = {mimeType: 'audio/webm'};
let recordedChunks = [];
const whisperRepo = repositoryFactory.get('whisper')
const chatGPTRepo = repositoryFactory.get('chatGPT')
const messageStore = useMessageStore()
let player
let messageWindow

const isRecording = ref(false)
let mode = ref('suggest') // todo: make string literal, suggest, edit, manual


function intialiseRecorder(stream) {
  let recorder = new MediaRecorder(stream, options);
  recorder.addEventListener('stop', function () {
    player.src = URL.createObjectURL(new Blob(recordedChunks));
  });

  recorder.addEventListener('dataavailable', function (e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
    console.info('saved')
    getTranscription().then(
        async (result) => {
          console.log(`Transciption: ${result.data.text}`)
          await getQuips(result.data.text)
        }
    )
  });
  return recorder
}

async function toggleRecording() {
  if (isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false

    // messageStore.addmessage(transcription)
  } else {
    if (!mediaRecorder) {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
      } catch (err) {
        alert('Website cannot function without microphone. Head to the site settings to give permission, then refresh.')
      }
      mediaRecorder = intialiseRecorder(stream);
    }
    mediaRecorder.start();
    isRecording.value = true
  }
}

async function getTranscription() {
  if (recordedChunks.length > 0) {
    console.log('transcribing')
    const file = new File(recordedChunks, 'audio.webm', {
      type: 'audio/webm',
      lastModified: Date.now()
    });
    const response = await whisperRepo.post(file)
    recordedChunks = []
    return response
  }
  console.log('not transcribing')
}

async function getQuips(utterance) {
  await commitMessage(utterance, 'user')
  return await chatGPTRepo.generate_repsonse(messageStore.messages).then(
      (result) => {
        const text = result.data.choices[0].message.content
        console.log('chatGPT: ' + text)
        console.log('formatted: ')
        const formatted = text.replace(/^[^{]*/, '')
        console.log(formatted)
        console.log('json: ')
        const json_parsed = JSON.parse(formatted)
        console.log(json_parsed)
        messageStore.response = json_parsed.suggestions
      }
  )
}

async function modifyResponse(response, hint) {
  mode.value = 'suggest'
  await chatGPTRepo.modify_repsonse(messageStore.messages, response, hint).then(
      (result) => {
        const text = result.data.choices[0].message.content
        console.log('chatGPT: ' + text)
        console.log('formatted: ')
        const formatted = text.replace(/^[^{]*/, '')
        console.log(formatted)
        console.log('json: ')
        const json_parsed = JSON.parse(formatted)
        console.log(json_parsed)
        messageStore.response = json_parsed.suggestions
      }
  )
}

async function commitMessage(message, role) {
  messageStore.addMessage(message, role)
  await nextTick(() => {
    messageWindow.scrollTop = messageWindow.scrollHeight;
  })
}

async function talk(message) {
  await commitMessage(message, 'assistant')
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
  console.log(messageWindow.scrollHeight)
}

function enterEditMode() {
  mode.value = 'edit'
}

onMounted(
    () => {
      player = document.getElementById('player');
      messageWindow = document.getElementById("messageWindow");
      messageWindow.scrollTop = messageWindow.scrollHeight;
    }
)

</script>

<template>
  <main>
    <resizable-pane
        :left-min=10
        :right-min=25
        :initial-pos=75
    >
      <template
          v-slot:left
      >
        <div style="background-color: white">
          <div>
            <div id="messageWindow"
                 style="box-shadow: inset 0 0 15px #dedcdc; width: 100%; height: 60vh; margin: auto; overflow: scroll;
padding: 10px 20px">
              <div v-for="(message, index) in messageStore.messages" :key="index">
                <message-bubble :message="message"/>
              </div>
            </div>
            <div style="padding: 20px">
              <message-suggestions-panel v-if="mode === 'suggest'" v-on:selected="talk" v-on:edit="enterEditMode"/>
              <edit-message-panel v-else-if="mode === 'edit'" @close="mode='suggest'" @modify="modifyResponse"/>
<!--              <message-suggestions-panel v-if="false" v-on:selected="talk" v-on:edit="enterEditMode"/>-->
<!--              <edit-message-panel v-else-if="true" v-model="editingMessage"/>-->
            </div>

          </div>
        </div>
      </template>

      <template
          v-slot:right
      >
        <div style="display: flex; flex-direction: column; padding-top: 150px">
          <div class="centred-box">
            <button @click="toggleRecording" id="start"
                    :class="{ recordButtonPressed: isRecording, recordButton: !isRecording }">
              <v-icon icon="mdi:mdi-microphone-outline"/>
            </button>
          </div>
          <div class="centred-box" style="margin: 10px">
            <v-text-field
                ref="typed_message"
                v-on:keydown.enter="getQuips(this.$refs.typed_message.modelValue); this.$refs.typed_message.reset()"
                variant="solo"
                hide-details="auto"
            >
              <template v-slot:append-inner>
                <v-icon @click="getQuips(this.$refs.typed_message.modelValue); this.$refs.typed_message.reset()"
                        id="sendButton">mdi-send
                </v-icon>
              </template>
            </v-text-field>
          </div>
          <div style="height: 100%; padding: 20px; display: flex; flex-wrap: wrap; justify-content:center;">
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon">
              <v-icon icon="mdi:mdi-account-outline"/>
            </button>
            <button class="personaIcon" style="background-color: grey; border: grey 3px">
              <v-icon icon="mdi:mdi-account-plus-outline"/>
            </button>
          </div>
          <div style="margin: auto;">
            <audio id="player" controls/>
          </div>
        </div>
      </template>
    </resizable-pane>

  </main>
</template>

<style scoped>
.recordButtonPressed {
  background-color: #2d8655;
  color: white;
  border: mediumseagreen solid 1px;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  box-shadow: 0 2px 3px rgba(38, 38, 38, 0.7);;
}

.recordButton {
  background-color: #43CC47;
  color: white;
  border: #43CC47 solid 1px;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  box-shadow: 0 2px 3px rgba(38, 38, 38, 0.7);;
}

.personaIcon {
//position: relative; //top: 50%; //transform: translateY(-50%); background-color: blue; padding: 0; color: white; border: #2f57f6 solid 3px; border-radius: 50%; background-color: #2f57f6; height: 50px; width: 50px; margin: 5px;
  background-color: #1982FC;
  border: 0;
  display: inline-block;
  box-shadow: 0 2px 3px rgba(38, 38, 38, 0.7);
}

#sendButton {
  color: rgba(59, 59, 59, 0.93);
}

#sendButton:hover {
  color: #0da952;
}

</style>