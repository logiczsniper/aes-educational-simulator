import anime from 'animejs/lib/anime.es.js';

export enum PlaybackSpeed {
  Slow,
  Fast
}

export const usePlaybackSpeed = defineStore(getKey`playbackSpeed`, () => {
  const currentPlaybackSpeed = ref<PlaybackSpeed>()

  function setCurrentPlaybackSpeed(newPlaybackSpeed: PlaybackSpeed | undefined) {
    currentPlaybackSpeed.value = newPlaybackSpeed

    //@ts-ignore We need to be able to change the speed here.
    if (newPlaybackSpeed === undefined) anime.speed = 1
    //@ts-ignore We need to be able to change the speed here.
    if (newPlaybackSpeed === PlaybackSpeed.Slow) anime.speed = 0.5
    //@ts-ignore We need to be able to change the speed here.
    if (newPlaybackSpeed === PlaybackSpeed.Fast) anime.speed = 2

  }

  onMounted(() => {
    setCurrentPlaybackSpeed(currentPlaybackSpeed.value)
  })

  return {
    currentPlaybackSpeed,
    setCurrentPlaybackSpeed
  }
}, {
  persist: true
})