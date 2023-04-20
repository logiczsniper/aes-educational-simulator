import AddKeyTutorial from '~~/components/tutorials/AddKeyTutorial.vue'
import AddRoundKeyTutorial from '~~/components/tutorials/AddRoundKeyTutorial.vue'
import AddWordsTutorial from '~~/components/tutorials/AddWordsTutorial.vue'
import CiphertextToStateTutorial from '~~/components/tutorials/CiphertextToStateTutorial.vue'
import DefaultTutorial from '~~/components/tutorials/DefaultTutorial.vue'
import KeyRoundHeaderTutorial from '~~/components/tutorials/KeyRoundHeaderTutorial.vue'
import KeyToStateTutorial from '~~/components/tutorials/KeyToStateTutorial.vue'
import MixColumnsTutorial from '~~/components/tutorials/MixColumnsTutorial.vue'
import PlaintextToStateTutorial from '~~/components/tutorials/PlaintextToStateTutorial.vue'
import RoundGFnTutorial from '~~/components/tutorials/RoundGFnTutorial.vue'
import RoundHeaderTutorial from '~~/components/tutorials/RoundHeaderTutorial.vue'
import RoundHFnTutorial from '~~/components/tutorials/RoundHFnTutorial.vue'
import RoundKeysTutorial from '~~/components/tutorials/RoundKeysTutorial.vue'
import RoundStatsTutorial from '~~/components/tutorials/RoundStatsTutorial.vue'
import ShiftRowsTutorial from '~~/components/tutorials/ShiftRowsTutorial.vue'
import StateToCiphertextTutorial from '~~/components/tutorials/StateToCiphertextTutorial.vue'
import StateToPlaintextTutorial from '~~/components/tutorials/StateToPlaintextTutorial.vue'
import StateToRoundKeysTutorial from '~~/components/tutorials/StateToRoundKeysTutorial.vue'
import SubBytesTutorial from '~~/components/tutorials/SubBytesTutorial.vue'

export enum TutorialKey {
  Default,
  PlaintextToState,
  CiphertextToState,
  KeyToState,
  AddKey,
  AddWords,
  AddRoundKey,
  MixColumns,
  KeyRoundHeader,
  RoundHeader,
  RoundStats,
  RoundGFn,
  RoundHFn,
  RoundKeys,
  ShiftRows,
  StateToCiphertext,
  StateToPlaintext,
  StateToRoundKeys,
  SubBytes
}

export const useTutorial = defineStore(getKey`tutorialKey`, () => {
  const tutorialKeyToComponentMap = {
    [TutorialKey.Default]: DefaultTutorial,
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
    [TutorialKey.KeyToState]: KeyToStateTutorial,
    [TutorialKey.AddWords]: AddWordsTutorial,
    [TutorialKey.KeyRoundHeader]: KeyRoundHeaderTutorial,
    [TutorialKey.RoundGFn]: RoundGFnTutorial,
    [TutorialKey.RoundHFn]: RoundHFnTutorial,
    [TutorialKey.RoundKeys]: RoundKeysTutorial,
    [TutorialKey.StateToRoundKeys]: StateToRoundKeysTutorial,
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