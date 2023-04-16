import DefaultTutorial from '~~/components/tutorials/DefaultTutorial.vue'
import PlaintextToStateTutorial from '~~/components/tutorials/PlaintextToStateTutorial.vue'

import TestTutorial from '~~/components/tutorials/TestTutorial.vue'

export enum TutorialKey {
  Default,
  PlaintextToState,
  Test
}

export const useTutorial = defineStore(getKey`tutorialKey`, () => {
  const tutorialKeyToComponentMap = {
    [TutorialKey.Default]: DefaultTutorial,
    [TutorialKey.Test]: TestTutorial,
    [TutorialKey.PlaintextToState]: PlaintextToStateTutorial,
  }

  const currentTutorialKey = ref(TutorialKey.Default)
  const currentTutorialComponent = computed(() => tutorialKeyToComponentMap[currentTutorialKey.value])

  const sidebar = useSidebar()

  function open(newKey: TutorialKey) {
    currentTutorialKey.value = newKey
    sidebar.expand()
  }

  function close() {
    currentTutorialKey.value = TutorialKey.Default
    sidebar.shrink()
  }

  return {
    currentTutorialKey,
    currentTutorialComponent,
    open,
    close
  }
}, {
  persist: true
})