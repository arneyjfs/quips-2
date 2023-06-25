<script setup lang="ts">
const props = defineProps({
  leftMin: Number,
  rightMin: Number,
  initialPos: Number,
})

import {ref} from "vue";

let dividerPosition = ref(props.initialPos)

function handleDragging(e) {

  const percentage = (e.pageX / window.innerWidth) * 100

  if (percentage >= props.leftMin && percentage <= 100 - props.rightMin) {
    dividerPosition.value = Number(percentage.toFixed(2))
  }
}

function startDragging() {
  document.addEventListener('mousemove', handleDragging)
}

function endDragging() {
  document.removeEventListener('mousemove', handleDragging)
}


</script>

<template>
  <div class="wrapper" @mouseup="endDragging()" @mouseleave="endDragging">
    <div
        class="left"
        :style="{
        width: `${dividerPosition}%`
      }"
    >
      <slot name="left"></slot>
    </div>
    <div
        class="divider"
        :style="{
        left: `${dividerPosition}%`,
        // background: `${dividerColor}`,
        }"
        @mousedown="startDragging()"
    >
    </div>
    <div
        class="right"
        :style="{
        width: `${100 - dividerPosition}%`
      }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;

  .left {
    background-color: rgba(255, 255, 255, 0.93);
    display: initial
  }

  .divider {
    height: 100%;
    width: 6px;
    transform: translateX(-3px);
    position: absolute;
    top: 0;
    z-index: 1;
    cursor: ew-resize;
  }

  .right {
    background-color: #f3f3f3;
    border-left: lightgray 1px solid;
    display: initial;
  }

}

</style>