<script setup>
import repositoryFactory from "@/repositories/RepositoryFactory";
import {useMessageStore} from '@/stores/message'
import ResizablePane from "@/components/resizablePane.vue";
import {ref} from "vue";

let mediaRecorder;
const options = {mimeType: 'audio/webm'};
let recordedChunks = [];
const whisperRepo = repositoryFactory.get('whisper')
const chatGPTRepo = repositoryFactory.get('chatGPT')
const messageStore = useMessageStore()

let isRecording = ref(false)


function intialiseRecorder(stream) {
  let recorder = new MediaRecorder(stream, options);
  recorder.addEventListener('stop', function () {
    const player = document.getElementById('player');
    player.src = URL.createObjectURL(new Blob(recordedChunks));
  });

  recorder.addEventListener('dataavailable', function (e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
  });
  return recorder
}

async function toggleRecording() {
  if (isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false
    const transcription = await getTranscription()
    console.log(transcription)
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

async function getQuips() {
  return await chatGPTRepo.post(messageStore.messages)
}

function talk() {
  let utterance = new SpeechSynthesisUtterance("Hello world!");
  speechSynthesis.speak(utterance);
}

</script>

<template>
  <main>
    <resizable-pane
        :left-min=10
        :right-min=25
    >
      <template
          v-slot:left
      >
        <div style="background-color: white">
          <audio id="player" controls/>
          <button @click="getTranscription" id="transcribe">Transcribe</button>
          <button @click="getQuips" id="submit">Submit</button>
          <button @click="talk" id="talk">Talk</button>
        </div>
      </template>

      <template
          v-slot:right
      >
        <div style="display: grid; grid-template-rows: auto auto; padding-top: 150px">
          <div class="centred-box" >
            <button @click="toggleRecording" id="start" :class="{ recordButtonPressed: isRecording, recordButton: !isRecording }">
              <v-icon icon="mdi:mdi-microphone-outline" />
            </button>
          </div>
          <div class="centred-box" style="flex-wrap: wrap; padding: 20px">
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon"><v-icon icon="mdi:mdi-account-outline" /></button>
            <button class="personaIcon" style="background-color: grey; border: grey 3px"><v-icon icon="mdi:mdi-account-plus-outline" /></button>
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
  border: mediumseagreen solid 2px;
  border-radius: 50%;
  height: 100px;
  width: 100px;
}

.recordButton {
  background-color: mediumseagreen;
  color: white;
  border: mediumseagreen solid 2px;
  border-radius: 50%;
  height: 100px;
  width: 100px;
}

.personaIcon {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  background-color: blue;
  padding: 0;
  color: white;
  border: blue solid 3px;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  margin: 5px;
  display: inline-block
}


</style>