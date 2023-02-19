<script setup lang="ts">
import { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import anime from 'animejs/lib/anime.es.js';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();


onMounted(() => {
  props.timeline.add({
    targets: '.testanimation',
    translateX: 250,
    duration: 4000,
  })
    .add({
      targets: '.testanimation1',
      rotate: '1turn',
      backgroundColor: '#292',
    })
})
</script>

<template>
  <div class="testanimation">
    Testing
  </div>
  <div class="testanimation1">Another one</div>
</template>