<script setup lang="ts">
import { AnimeTimelineAnimParams, AnimeTimelineInstance } from 'animejs';
import anime from 'animejs/lib/anime.es.js';
import { PlaybackSpeed } from '~~/composables/usePlaybackSpeed'

const playbackSpeed = usePlaybackSpeed()

const timeline = ref<AnimeTimelineInstance | null>(null)
const progress = ref(0)

const props = defineProps<{
  timelineParams?: AnimeTimelineAnimParams
}>();

const controlIconName = ref('mdi-play')

const onControlClick = () => {
  if (timeline.value?.paused) {
    timeline.value.play()
    controlIconName.value = 'mdi-pause'
  }
  else {
    timeline.value?.pause()
    controlIconName.value = 'mdi-play'
  }
}

const onSliderClick = (value: number) => {
  const preClickStatePaused = timeline.value?.paused ?? false
  timeline.value?.pause()

  const valueInMs = (value / 100) * (timeline.value?.duration ?? 0)
  timeline.value?.seek(valueInMs)

  if (!preClickStatePaused) timeline.value?.play()
}

const onPlaybackSpeedClick = (value: PlaybackSpeed | undefined) => {
  const preClickStatePaused = timeline.value?.paused ?? false
  timeline.value?.pause()

  playbackSpeed.setCurrentPlaybackSpeed(value)

  if (!preClickStatePaused) timeline.value?.play()
}

onMounted(() => {
  timeline.value = anime.timeline({
    ...props.timelineParams,
    autoplay: false,
    update: currentAnimeInstance => {
      progress.value = currentAnimeInstance.progress
    },
    complete: () => {
      controlIconName.value = 'mdi-restart'
    },
  })


})

const log = console.log

</script>

<template>
  <section class="aesAnimationFrame">
    <ClientOnly v-if="timeline !== null">
      <slot
        name="animation"
        :timeline="timeline"
      />
      <v-slider
        :model-value="progress"
        @update:model-value="onSliderClick"
        hide-details
        class="slider"
        color="#745CD0"
        :thumb-size="0"
      />
      <div class="controls">
        <v-btn
          class="playPauseButton"
          variant="plain"
          density="compact"
          :icon="controlIconName"
          @click="onControlClick"
        />
        <v-btn-toggle
          :model-value="playbackSpeed.currentPlaybackSpeed"
          @update:model-value="onPlaybackSpeedClick"
          class="playbackSpeedGroup"
          density="compact"
          selected-class="selectedPlaybackSpeed"
        >
          <v-btn
            icon
            density="compact"
            variant="plain"
          >
            <v-icon size="18">mdi-tortoise</v-icon>
          </v-btn>
          <v-btn
            icon
            density="compact"
            variant="plain"
          >
            <v-icon size="18">mdi-rabbit</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </ClientOnly>
  </section>
</template>

<style lang="scss">
.aesAnimationFrame {
  position: relative;
  padding: 20px;

  .slider {}

  .controls {
    display: grid;
    grid-template-columns: 100% min-content;
    align-items: center;

    .playbackSpeedGroup {
      margin-left: -120%;
    }

    .playPauseButton {
      justify-self: center;
    }
  }
}

.selectedPlaybackSpeed {
  color: #2C1D66;
  opacity: 1;
}
</style>