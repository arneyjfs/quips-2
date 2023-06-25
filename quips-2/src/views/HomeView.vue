<script setup>
import repositoryFactory from "@/repositories/RepositoryFactory";
import {useMessageStore} from '@/stores/message'
import ResizablePane from "@/components/resizablePane.vue";
import {nextTick, onMounted, ref} from "vue";

let mediaRecorder;
const options = {mimeType: 'audio/webm'};
let recordedChunks = [];
const whisperRepo = repositoryFactory.get('whisper')
const chatGPTRepo = repositoryFactory.get('chatGPT')
const messageStore = useMessageStore()
let player
let messageWindow

let isRecording = ref(false)


function intialiseRecorder(stream) {
  let recorder = new MediaRecorder(stream, options);
  recorder.addEventListener('stop', function () {
    player.src = URL.createObjectURL(new Blob(recordedChunks));
  });

  recorder.addEventListener('dataavailable', function (e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
    console.info('saved')
    getTranscription().then(
        (result) => {
          console.log(`Transciption: ${result.data.text}`)
          let message_json = `{\n\t"type":  "utterance",\n\t "text":  "${result.data.text}"\n}`
          messageStore.addMessage(message_json, 'user')
          nextTick(() => {
            messageWindow.scrollTop = messageWindow.scrollHeight;
          })
          getQuips()
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

async function getQuips() {
  return await chatGPTRepo.post(messageStore.messages).then(
      (result) => {
        const text = result.data.choices[0].message.content
        console.log('chatGPT: ' + text)
        console.log('formatted: ')
        const formatted = text.replace(/^[^{]*/, '')
        console.log(formatted)
        console.log('json: ')
        const json_parsed = JSON.parse(formatted)
        console.log(json_parsed)
        messageStore.quips = json_parsed.quips
      }
  )
}

function talk(e) {
  let message = e.target.innerText
  console.log(messageWindow.scrollHeight)
  let message_json = `{\n\t"type":  "utterance",\n\t "text":  "${message}"\n}`
  messageStore.addMessage(message_json, 'assistant')
  nextTick(() => {
    messageWindow.scrollTop = messageWindow.scrollHeight;
  })
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
  console.log(messageWindow.scrollHeight)
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
                 style="box-shadow: inset 0 0 15px #dedcdc; width: 100%; height: 60vh; margin: auto; overflow: scroll">
              <div v-for="(message, index) in messageStore.messages" :key="index">
                <div :class="{ message: true,
                  messageOther: message.role === 'user',
                  messageSystem: message.role === 'system',
                  messageSelf: message.role === 'assistant'
                }">
                  {{ message.content }}
                </div>
              </div>
            </div>
            <div class="centred-box" style="flex-wrap: wrap; padding: 20px">
              <button @click="talk" class="quipButton" v-for="(quip, index) in messageStore.quips" :key="index">
                {{ quip }}
              </button>
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
//position: relative; //top: 50%; //transform: translateY(-50%); background-color: blue; padding: 0;
  color: white;
  border: #2f57f6 solid 3px;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  margin: 5px;
  display: inline-block
}

.quipButton {
  background-color: mediumseagreen;
  color: white;
  border: mediumseagreen solid 2px;
  border-radius: 20px;
//height: 40px; min-width: 100px; max-width: 300px;
  margin: 10px;
  padding: 5px 10px 5px 10px;
}

.message {
  max-width: 70%;
  padding: 13px;
  border-radius: 20px;
  margin: 20px;
}

.messageOther {
  background-color: rgba(203, 190, 204, 0.24);
  color: #090909;
  margin-left: 10px;
  margin-right: auto;
}

.messageSystem {
  background-color: rgba(203, 190, 204, 0.24);
  color: #090909;
  margin-left: auto;
  margin-right: auto;
}

.messageSelf {
  background-color: mediumseagreen;
  color: white;
  margin-left: auto;
  margin-right: 10px;
}

</style>