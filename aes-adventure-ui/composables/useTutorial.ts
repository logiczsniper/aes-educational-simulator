import AddKeyTutorial from '~~/components/tutorials/AddKeyTutorial.vue'
import AddRoundKeyTutorial from '~~/components/tutorials/AddRoundKeyTutorial.vue'
import CiphertextToStateTutorial from '~~/components/tutorials/CiphertextToStateTutorial.vue'
import DefaultTutorial from '~~/components/tutorials/DefaultTutorial.vue'
import MixColumnsTutorial from '~~/components/tutorials/MixColumnsTutorial.vue'
import PlaintextToStateTutorial from '~~/components/tutorials/PlaintextToStateTutorial.vue'
import RoundHeaderTutorial from '~~/components/tutorials/RoundHeaderTutorial.vue'
import RoundStatsTutorial from '~~/components/tutorials/RoundStatsTutorial.vue'
import ShiftRowsTutorial from '~~/components/tutorials/ShiftRowsTutorial.vue'
import StateToCiphertextTutorial from '~~/components/tutorials/StateToCiphertextTutorial.vue'
import StateToPlaintextTutorial from '~~/components/tutorials/StateToPlaintextTutorial.vue'
import SubBytesTutorial from '~~/components/tutorials/SubBytesTutorial.vue'

import TestTutorial from '~~/components/tutorials/TestTutorial.vue'

export enum TutorialKey {
  Default,
  PlaintextToState,
  CiphertextToState,
  AddKey,
  AddRoundKey,
  MixColumns,
  RoundHeader,
  RoundStats,
  ShiftRows,
  StateToCiphertext,
  StateToPlaintext,
  SubBytes,
  Test
}

export const useTutorial = defineStore(getKey`tutorialKey`, () => {
  const tutorialKeyToComponentMap = {
    [TutorialKey.Default]: DefaultTutorial,
    [TutorialKey.Test]: TestTutorial,
    [TutorialKey.PlaintextToState]: PlaintextToStateTutorial,
    [TutorialKey.CiphertextToState]: CiphertextToStateTutorial,
    [TutorialKey.AddKey]: AddKeyTutorial,
    [TutorialKey.AddRoundKey]: AddRoundKeyTutorial,
    [TutorialKey.MixColumns]: MixColumnsTutorial,
    [TutorialKey.RoundHeader]: RoundHeaderTutorial,
    [TutorialKey.RoundStats]: RoundStatsTutorial,
    [TutorialKey.ShiftRows]: ShiftRowsTutorial,
    [TutorialKey.StateToCiphertext]: StateToCiphertextTutorial,
    [TutorialKey.StateToPlaintext]: StateToPlaintextTutorial,
    [TutorialKey.SubBytes]: SubBytesTutorial,
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