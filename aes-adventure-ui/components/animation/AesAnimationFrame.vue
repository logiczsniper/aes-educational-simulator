<script setup lang="ts">
import { AnimeTimelineAnimParams, AnimeTimelineInstance } from 'animejs';
import anime from 'animejs/lib/anime.es.js';
import { PlaybackSpeed } from '~~/composables/usePlaybackSpeed'

const props = defineProps<{
  timelineParams?: AnimeTimelineAnimParams,
  timelineKey?: number | string,
}>();

const playbackSpeed = usePlaybackSpeed()

const timeline = ref<AnimeTimelineInstance | null>(null)
const progress = ref(0)
const controlIconName = ref('mdi-play')

const pause = () => {
  timeline.value?.pause()
  if (timeline.value?.completed === false) controlIconName.value = 'mdi-play'
}

const play = () => {
  timeline.value?.play()
  controlIconName.value = 'mdi-pause'
}

const onControlClick = () => {
  timeline.value?.paused
    ? play()
    : pause()
}

// Hacky fix to avoid stutters in timeline
// when modifying the current position &
// playback speed.
const pauseWhile = (fn: () => void) => {
  const pausedBefore = timeline.value?.paused ?? false
  timeline.value?.pause()

  fn()

  if (!pausedBefore) timeline.value?.play()
}

const onSliderClick = (value: number) =>
  pauseWhile(() => {
    const valueInMs = (value / 100) * (timeline.value?.duration ?? 0)
    timeline.value?.seek(valueInMs)
  })

const onPlaybackSpeedClick = (value: PlaybackSpeed | undefined) =>
  pauseWhile(() => {
    playbackSpeed.setCurrentPlaybackSpeed(value)
  })

const createTimeline = () => {
  timeline.value = anime.timeline({
    ...props.timelineParams,
    easing: 'easeInOutQuad',
    autoplay: false,
    update: currentAnimeInstance => {
      progress.value = currentAnimeInstance.progress
    },
    complete: () => {
      controlIconName.value = 'mdi-restart'
    },
  })
}

watch(() => props.timelineKey, () => {
  pause()
  timeline.value?.seek(0)
  createTimeline()
})

onMounted(() => {
  createTimeline()
})
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
        <v-btn
          class="playPauseButton"
          variant="plain"
          density="compact"
          :icon="controlIconName"
          @click="onControlClick"
        />
        <div class="prependControls">
          <slot
            name="prependControls"
            :timeline="timeline"
            :play="play"
            :pause="pause"
          />
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<style lang="scss">
.aesAnimationFrame {
  position: relative;
  padding: 0 20px 10px 20px;

  .slider {
    margin-top: 20px;
  }

  .controls {
    $sideElementWidth: 5fr;

    display: grid;
    grid-template-columns: $sideElementWidth 1fr $sideElementWidth;
    align-items: center;
    margin-top: 4px;

    .playbackSpeedGroup {
      margin-left: 8px;
    }

    .prependControls {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
  }

  .playPauseButton {
    justify-self: center;
  }
}

.selectedPlaybackSpeed {
  color: #2C1D66;
  opacity: 1;
}
</style>