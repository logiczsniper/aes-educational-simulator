<script setup lang="ts">
import { AnimeInstance } from 'animejs';
import anime from 'animejs/lib/anime.es.js';

const animationInstance = ref<AnimeInstance | null>(null)


const hello = ref(0)

const test = () => console.log(animationInstance.value?.currentTime)

onMounted(() => {
  animationInstance.value = anime({
    targets: '.testanimation',
    translateX: 250,
    rotate: '1turn',
    backgroundColor: '#FFF',
    duration: 8000,
    loop: true,
    update: () => {
      hello.value = animationInstance.value?.currentTime ?? hello.value
    }
  })
})
</script>

<template>
  <div
    class="testanimation"
    @click="test"
  >
    Testing
    {{ hello }}
  </div>
  <div class="testanimation">Another one</div>
</template>