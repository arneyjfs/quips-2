<script setup lang="ts">
import EditControls from "@/components/editMessagePanel/editControls.vue";
const emit = defineEmits<{
  close,
  newConvo: [hint: string],
}>()

function triggerNewConvo(hint: string) {
  emit('newConvo', hint)
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
      <div style="margin: 0 auto; justify-items: center">
        <span style="font-style: italic">Editing all messages</span>
      </div>
    </div>
    <edit-controls @modify="triggerNewConvo"/>
  </div>
</template>

<style scoped>

</style>