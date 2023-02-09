import DefaultTutorial from '~~/components/tutorials/DefaultTutorial.vue'
import TestTutorial from '~~/components/tutorials/TestTutorial.vue'

export enum TutorialKey {
  Default,
  Test
}

export const tutorialKeyToComponentMap = {
  [TutorialKey.Default]: DefaultTutorial,
  [TutorialKey.Test]: TestTutorial
}

export const useTutorial = defineStore(getKey`tutorialKey`, () => {
  const currentTutorialKey = ref(TutorialKey.Default)
  const currentTutorialComponent = computed(() => tutorialKeyToComponentMap[currentTutorialKey.value])

  function setCurrentTutorialKey(newKey: TutorialKey) {
    currentTutorialKey.value = newKey
  }

  return {
    currentTutorialKey,
    currentTutorialComponent,
    setCurrentTutorialKey
  }
}, {
  persist: true
})