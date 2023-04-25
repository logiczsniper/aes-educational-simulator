<script setup lang="ts">
import { AesiRoundStepAddKey, AesiRoundStepType } from '~~/utils/aesi/aesi.types';
import { A_INVERSE, S_BOX_INVERSE } from '~~/utils/aesi/core/constants';
import { duplicateKey } from '~~/utils/state/duplicateKey';
import { duplicatePlaintext } from '~~/utils/state/duplicatePlaintext';

const { t } = useI18n();
const { locale } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop',
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.decrypt')}`,
  htmlAttrs: { lang: locale.value ?? 'en' },
  link: [{ rel: 'canonical', href: `https://aes-adventure.web.app/${locale.value ?? 'en'}/simulator/decrypt` }],
  meta: [
    {
      name: 'description',
      content: t('seo.decrypt-description')
    },
    { property: 'og:locale', content: locale.value ?? 'en' },
  ]
})

const roundsHeader = ref<HTMLElement>()
const scrollToRoundsHeader = () => {
  if (!roundsHeader.value) return

  roundsHeader.value.scrollIntoView({
    behavior: "smooth"
  })
}

const decryptState = useDecryptState();
const configState = useConfig()
const tutorial = useTutorial()

const noMixColumns = computed(() => decryptState.isFirstRound || configState.noMixColumns)
</script>

<template>
  <main class="decryptPage">
    <ClientOnly>
      <transition
        appear
        name="opacity"
      >
        <div>
          <section class="inputs">
            <HexArea
              v-model="decryptState.rawCiphertext"
              title-key="simulator.ciphertext"
              :max-length="128"
              :disabled="decryptState.stage !== DecryptStage.Input"
            />
            <HexArea
              v-model="decryptState.rawKey"
              title-key="simulator.key"
              :max-length="decryptState.keySize"
              :key="decryptState.keySize"
              :disabled="decryptState.stage !== DecryptStage.Input"
              :duplicate="{
                  snackbarMessage: t('simulator.hexArea.duplicated-keys'),
                  onDuplicate: key => duplicateKey(key, 'decrypt')
                }"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
                  :disabled="decryptState.stage !== DecryptStage.Input"
                  :model-value="decryptState.keySize"
                  @update:model-value="decryptState.setKeySize"
                >
                  <v-btn
                    icon
                    density="compact"
                    variant="plain"
                    :value="128"
                  >
                    <v-icon size="20">mdi-numeric-1</v-icon>
                    <v-icon size="20">mdi-numeric-2</v-icon>
                    <v-icon size="20">mdi-numeric-8</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    density="compact"
                    variant="plain"
                    :value="192"
                  >
                    <v-icon size="20">mdi-numeric-1</v-icon>
                    <v-icon size="20">mdi-numeric-9</v-icon>
                    <v-icon size="20">mdi-numeric-2</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    density="compact"
                    variant="plain"
                    :value="256"
                  >
                    <v-icon size="20">mdi-numeric-2</v-icon>
                    <v-icon size="20">mdi-numeric-5</v-icon>
                    <v-icon size="20">mdi-numeric-6</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
            </HexArea>
          </section>
          <transition
            name="opacity"
            mode="out-in"
          >
            <v-btn
              v-if="decryptState.stage === DecryptStage.Input"
              :disabled="!decryptState.canComputeDecryptOutput"
              prependIcon="mdi-lock-open-variant"
              variant="flat"
              color="primary"
              class="startButton"
              @click="decryptState.computeDecryptOutput"
            >
              {{ `${t('simulator.start')} ${t('simulator.decryption')}` }}
            </v-btn>
            <v-btn
              v-else
              prependIcon="mdi-lock-reset"
              :variant="decryptState.stage === DecryptStage.Output ? 'flat' : 'outlined'"
              color="primary"
              class="resetButton"
              @click="decryptState.reset"
            >
              {{ t('simulator.reset') }}
            </v-btn>
          </transition>
          <transition
            appear
            name="opacity"
          >
            <div v-if="decryptState.output && decryptState.stage > DecryptStage.Input">
              <section class="transposeStep">
                <StepDropdown
                  :model-value="decryptState.stage === DecryptStage.ToState"
                  eager
                  :title="`${t('simulator.ciphertext')} ➜ ${t('simulator.state')}`"
                  :tutorial-key="TutorialKey.CiphertextToState"
                  background-color="#f9f9f9"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesTranspose
                        id="plaintext-to-state"
                        :timeline="timeline"
                        :input="decryptState.ciphertext"
                      >
                      </AnimationAesTranspose>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.stage === DecryptStage.ToState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-selection-ellipse-arrow-inside"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.stage = DecryptStage.Rounds
                          }"
                      >{{ t('simulator.start-rounds') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section
                ref="roundsHeader"
                class="roundsHeader"
              >
                <StatsDropdown
                  v-if="decryptState.stats"
                  v-model="decryptState.showStats"
                  :stats="decryptState.stats"
                  :roundIndex="decryptState.roundIndex + Number(decryptState.stage >= DecryptStage.SymmetryKeyAddition) - Number(decryptState.stage < DecryptStage.Rounds)"
                  :roundCount="decryptState.roundCount"
                >

                </StatsDropdown>
                <RoundProgressBar
                  class="roundProgressBar"
                  :class="{
                      'moveUp': decryptState.showStats
                    }"
                  :roundIndex="decryptState.roundIndex + Number(decryptState.stage >= DecryptStage.SymmetryKeyAddition) - Number(decryptState.stage < DecryptStage.Rounds)"
                  :roundCount="decryptState.roundCount"
                />
              </section>
              <section class="rounds">
                <StepDropdown
                  :model-value="decryptState.step?.type === AesiRoundStepType.AddRoundKey && decryptState.stage === DecryptStage.Rounds"
                  :eager="(decryptState.stage === DecryptStage.ToState) || (decryptState.step?.type === AesiRoundStepType.SubBytes)"
                  :title="`${t('simulator.add-round-key')}`"
                  :tutorial-key="TutorialKey.AddRoundKey"
                  variant="default"
                >
                  <AnimationAesAnimationFrame :timeline-key="decryptState.roundIndex">
                    <template #animation="{ timeline }">
                      <AnimationAesAddKey
                        id="add-round-key"
                        :timeline="timeline"
                        :key-value="(decryptState.getStep(AesiRoundStepType.AddRoundKey) as AesiRoundStepAddKey).roundKey"
                        :input="decryptState.getStep(AesiRoundStepType.AddRoundKey)?.inputState"
                        :output="decryptState.getStep(AesiRoundStepType.AddRoundKey)?.outputState"
                      >
                      </AnimationAesAddKey>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.step?.type === AesiRoundStepType.AddRoundKey && decryptState.stage === DecryptStage.Rounds"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.nextStep()
                          }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="decryptState.step?.type === AesiRoundStepType.MixColumns"
                  :eager="decryptState.step?.type === AesiRoundStepType.AddRoundKey"
                  :title="`${t('simulator.mix-columns')}`"
                  :turned-off="noMixColumns"
                  :tutorial-key="TutorialKey.MixColumns"
                  variant="default"
                >
                  <p v-if="noMixColumns">
                    {{ decryptState.isFirstRound ? t('simulator.no-mix-columns-first') : configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="decryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesMixColumns
                        :timeline="timeline"
                        :matrix="A_INVERSE"
                        :input="decryptState.getStep(AesiRoundStepType.MixColumns)?.inputState"
                        :output="decryptState.getStep(AesiRoundStepType.MixColumns)?.outputState"
                      >
                      </AnimationAesMixColumns>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.step?.type === AesiRoundStepType.MixColumns"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.nextStep()
                          }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="decryptState.step?.type === AesiRoundStepType.ShiftRows"
                  :eager="decryptState.step?.type === AesiRoundStepType.MixColumns || ((decryptState.step?.type === AesiRoundStepType.AddRoundKey) && decryptState.roundIndex === 0)"
                  :title="`${t('simulator.shift-rows')}`"
                  :turned-off="configState.noShiftRows"
                  :tutorial-key="TutorialKey.ShiftRows"
                  variant="default"
                >
                  <p v-if="configState.noShiftRows">
                    {{ configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="decryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesShiftRowsInverse
                        :timeline="timeline"
                        :input="decryptState.getStep(AesiRoundStepType.ShiftRows)?.inputState"
                        :output="decryptState.getStep(AesiRoundStepType.ShiftRows)?.outputState"
                      >
                      </AnimationAesShiftRowsInverse>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.step?.type === AesiRoundStepType.ShiftRows"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.nextStep()
                          }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="decryptState.step?.type === AesiRoundStepType.SubBytes && decryptState.stage === DecryptStage.Rounds"
                  :eager="decryptState.step?.type === AesiRoundStepType.ShiftRows"
                  :title="`${t('simulator.substitute-bytes')}`"
                  :turned-off="configState.noSubBytes"
                  :tutorial-key="TutorialKey.SubBytes"
                  variant="default"
                >
                  <p v-if="configState.noSubBytes">
                    {{ configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="decryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesSubstituteBytes
                        :timeline="timeline"
                        :sbox="S_BOX_INVERSE"
                        :input="decryptState.getStep(AesiRoundStepType.SubBytes)?.inputState"
                        :output="decryptState.getStep(AesiRoundStepType.SubBytes)?.outputState"
                      >
                      </AnimationAesSubstituteBytes>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.step?.type === AesiRoundStepType.SubBytes"
                    >
                      <v-btn
                        v-if="!decryptState.isLastStep && !decryptState.isSecondToLastRound"
                        :variant="timeline.currentTime > 9_500 ? 'outlined' : 'plain'"
                        prepend-icon="mdi-arrow-u-down-right"
                        color="primary"
                        @click="(_: Event) => {
                            tutorial.close()
                            decryptState.skipToLastRound()
                            scrollToRoundsHeader()
                          }"
                      >{{ t('simulator.skip') }}</v-btn>
                      <v-btn
                        v-if="!decryptState.isLastStep"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-rotate-right"
                        color="primary"
                        @click="(_: Event) => {
                            tutorial.close()
                            decryptState.nextRound()
                            scrollToRoundsHeader()
                          }"
                      >{{ t('simulator.next-round') }}</v-btn>
                      <v-btn
                        v-if="decryptState.isLastStep && decryptState.stage === DecryptStage.Rounds"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-flag-checkered"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.stage = DecryptStage.SymmetryKeyAddition
                          }"
                      >{{ t('simulator.finish-rounds') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section class="finalStep">
                <StepDropdown
                  :model-value="decryptState.stage === DecryptStage.SymmetryKeyAddition"
                  :eager="decryptState.step?.type === AesiRoundStepType.SubBytes"
                  :title="`${t('simulator.add-key')}`"
                  :tutorial-key="TutorialKey.AddKey"
                  background-color="#f9f9f9"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesAddKey
                        id="add-key"
                        :timeline="timeline"
                        :key-value="(decryptState.output.symmetryKeyAddition as AesiRoundStepAddKey)?.roundKey"
                        :input="decryptState.output.symmetryKeyAddition?.inputState"
                        :output="decryptState.output.symmetryKeyAddition?.outputState"
                      >
                      </AnimationAesAddKey>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.stage === DecryptStage.SymmetryKeyAddition"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.stage = DecryptStage.FromState
                          }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section class="transposeStep">
                <StepDropdown
                  :model-value="decryptState.stage === DecryptStage.FromState"
                  :eager="decryptState.stage === DecryptStage.SymmetryKeyAddition"
                  :title="`${t('simulator.state')} ➜ ${t('simulator.plaintext')}`"
                  :tutorial-key="TutorialKey.StateToPlaintext"
                  background-color="#f9f9f9"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesTranspose
                        id="state-to-plaintext"
                        :timeline="timeline"
                        :input="decryptState.output.symmetryKeyAddition?.outputState"
                      >
                      </AnimationAesTranspose>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="decryptState.stage === DecryptStage.FromState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-lock-open-variant"
                        color="primary"
                        @click="() => {
                            restartAndPause()
                            tutorial.close()
                            decryptState.stage = DecryptStage.Output
                          }"
                      >{{ `${t('simulator.finish')} ${t('simulator.decryption')}` }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
            </div>
          </transition>
          <section
            class="output"
            v-if="decryptState.stage === DecryptStage.Output && decryptState.outputString"
          >
            <HexArea
              v-model="decryptState.outputString"
              title-key="simulator.plaintext"
              :max-length="128"
              disabled
              :duplicate="{
                  snackbarMessage: t('simulator.hexArea.duplicated-plaintext'),
                  onDuplicate: duplicatePlaintext,
                  goTo: localePath('/simulator/encrypt')
                }"
            />
          </section>
          <div style="height: 140px;" />
        </div>
      </transition>
    </ClientOnly>
  </main>
</template>

<style scoped lang="scss">
.decryptPage {
  // width: 100%;
  height: 100%;

  .inputs {
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    display: flex;
    justify-content: center;
    height: min-content;
    gap: 40px;

    :deep(.v-selection-control-group--inline) {
      align-self: flex-end;
      gap: 10px;
      font-size: 12px;
    }

    &>*:first-child {
      justify-self: end;
    }

    .keySizeGroup {
      height: unset;
      gap: 4px;

      .v-btn {
        height: min-content !important;
      }

      .v-icon:first-of-type {
        margin-right: -13px;
      }

      .v-icon:last-of-type {
        margin-left: -13px;
      }
    }
  }

  .output {
    display: flex;
    justify-content: center;
    height: min-content;
  }

  .startButton,
  .resetButton {
    display: flex;
    margin: 36px 24px 12px auto;
  }

  .transposeStep {
    margin: 20px 0;
  }

  .finalStep {
    margin-top: 58px;
  }

  .roundsHeader {
    margin-bottom: 18px;
    margin-top: 48px;
    display: grid;
    place-items: center;
    grid-template-rows: min-content;

    &:hover {
      :deep(.roundProgressBarValue) {
        opacity: 1;
        margin-left: 4px;
      }

      .roundProgressBar {
        border-radius: 4px;
        column-gap: 2px;
      }
    }

    .roundProgressBar {
      &.moveUp {
        padding-left: 29px;
        padding-right: 25px;
        z-index: 1;
      }
    }
  }

  .rounds {
    display: grid;
    gap: 20px;
  }
}

.selectedKeySize {
  display: none;
}
</style>