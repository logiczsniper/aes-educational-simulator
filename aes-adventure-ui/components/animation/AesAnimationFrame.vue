<script setup lang="ts">
import { AnimeTimelineAnimParams, AnimeTimelineInstance } from 'animejs';
import anime from 'animejs/lib/anime.es.js';
import { PlaybackSpeed } from '~~/composables/usePlaybackSpeed';

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
  controlIconName.value = 'mdi-play'
}

const play = () => {
  timeline.value?.play()
  controlIconName.value = 'mdi-pause'
}

const restartAndPause = () => {
  pause()
  timeline.value?.seek(0)
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

const onPlaybackSpeedClick = (value: PlaybackSpeed | undefined) => {
  // Hack to blur the stupid v-btns
  setTimeout(() => {
    const buttons = Array.from(document.getElementsByClassName("playbackSpeedButton"))
    buttons.forEach(button => (button as HTMLElement).blur());
  }, 200)

  pauseWhile(() => {
    playbackSpeed.setCurrentPlaybackSpeed(value)
  })
}

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
  restartAndPause()
  createTimeline()
})

onMounted(() => {
  createTimeline()
})
</script>

<template>
  <section class="aesAnimationFrame">
    <ClientOnly v-if="timeline !== null">
      <div class="viewContainer scrollbar">
        <slot
          name="animation"
          :timeline="timeline"
        />
      </div>
      <v-slider
        :model-value="progress"
        @update:model-value="onSliderClick"
        hide-details
        class="slider"
        color="#745CD0"
        :thumb-size="0"
      />
      <div class="controls">
        <div class="prependControls">
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
              class="playbackSpeedButton"
              aria-label="Decrease animation speed button."
            >
              <v-icon size="18">mdi-tortoise</v-icon>
            </v-btn>
            <v-btn
              icon
              density="compact"
              variant="plain"
              class="playbackSpeedButton"
              aria-label="Increase animation speed button."
            >
              <v-icon size="18">mdi-rabbit</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <v-btn
          class="playPauseButton"
          variant="plain"
          density="compact"
          :icon="controlIconName"
          @click="onControlClick"
          aria-label="Play and pause button."
        />
        <div class="appendControls">
          <slot
            name="appendControls"
            :timeline="timeline"
            :play="play"
            :pause="pause"
            :restartAndPause="restartAndPause"
          />
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<style lang="scss">
.aesAnimationFrame {
  position: relative;
  padding-bottom: 8px;

  .viewContainer {
    padding-bottom: 22px;
    overflow-x: overlay;
  }

  .slider {
    margin-top: 6px;
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

    .appendControls {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
  }

  .playPauseButton {
    justify-self: center;
  }
}

.selectedPlaybackSpeed,
.selectedPlaybackSpeed:focus {
  color: rgb(var(--v-theme-primary-darken-dynamic)) !important;
  opacity: 1;
}
</style>