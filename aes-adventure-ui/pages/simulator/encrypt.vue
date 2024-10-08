<script setup lang="ts">
import { useTheme } from 'vuetify';
import { AesiRoundStepAddKey, AesiRoundStepType } from '~~/utils/aesi/aesi.types';
import { A, S_BOX } from '~~/utils/aesi/core/constants';
import { duplicateCiphertext } from '~~/utils/state/duplicateCiphertext';
import { duplicateKey } from '~~/utils/state/duplicateKey';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.encrypt')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.encrypt-description')
    },
  ]
})

const theme = useTheme()

const roundsHeader = ref<HTMLElement>()
const scrollToRoundsHeader = () => {
  if (!roundsHeader.value) return

  roundsHeader.value.scrollIntoView({
    behavior: "smooth"
  })
}

const encryptState = useEncryptState();
const configState = useConfig()
const tutorial = useTutorial()

const noMixColumns = computed(() => encryptState.isLastRound || configState.noMixColumns)

const roundProgressBarOffsetRoundOffset = computed(() => {
  const showRoundZeroBeforeRounds = encryptState.roundIndex === 0 ? -Number(encryptState.stage < EncryptStage.Rounds) : 0
  const showRoundMaxAfterRounds = encryptState.isLastRound ? Number(encryptState.stage > EncryptStage.Rounds) : 0

  return showRoundZeroBeforeRounds + showRoundMaxAfterRounds
})
const onRoundProgressBarClick = (roundNumber: number) => {
  const roundIndex = roundNumber - 1
  encryptState.setRound(roundIndex)
}

const outputHexArea = ref<HTMLElement>()
const skipToOutput = () => {
  encryptState.skipToOutput()
  setTimeout(() => {
    outputHexArea.value?.scrollIntoView({
      behavior: 'smooth',
    })
  }, 500)
}
</script>

<template>
  <main class="encryptPage">
    <ClientOnly>
      <transition
        appear
        name="opacity"
      >
        <div>
          <section class="inputs">
            <HexArea
              v-model="encryptState.rawPlaintext"
              title-key="simulator.plaintext"
              :max-length="128"
              :disabled="encryptState.stage !== EncryptStage.Input"
              :disabled-text="t('simulator.disabled-input')"
            />
            <HexArea
              v-model="encryptState.rawKey"
              title-key="simulator.key"
              :max-length="encryptState.keySize"
              :key="encryptState.keySize"
              :disabled="encryptState.stage !== EncryptStage.Input"
              :disabled-text="t('simulator.disabled-input')"
              :duplicate="{
                snackbarMessage: t('simulator.hexArea.duplicated-keys'),
                tooltipMessage: t('simulator.hexArea.duplicate-keys-tooltip'),
                onDuplicate: key => duplicateKey(key, Tab.Encrypt)
              }"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
                  :disabled="encryptState.stage !== EncryptStage.Input"
                  :title="encryptState.stage !== EncryptStage.Input ? t('simulator.disabled-input') : ''"
                  :model-value="encryptState.keySize"
                  @update:model-value="encryptState.setKeySize"
                >
                  <v-btn
                    icon
                    density="compact"
                    variant="plain"
                    :value="128"
                    aria-label="128-bit key size button."
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
                    aria-label="192-bit key size button."
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
                    aria-label="256-bit key size button."
                  >
                    <v-icon size="20">mdi-numeric-2</v-icon>
                    <v-icon size="20">mdi-numeric-5</v-icon>
                    <v-icon size="20">mdi-numeric-6</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
            </HexArea>
          </section>
          <div class="controlButtonsContainer">
            <transition
              name="opacity"
              mode="out-in"
            >
              <v-btn
                v-if="encryptState.stage === EncryptStage.Input"
                :disabled="!encryptState.canComputeEncryptOutput"
                :title="!encryptState.canComputeEncryptOutput ? t('simulator.disabled-start') : ''"
                prependIcon="mdi-lock"
                variant="flat"
                color="primary"
                @click="encryptState.computeEncryptOutput"
              >
                {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
              </v-btn>
              <div v-else>
                <transition name="opacity">
                  <v-btn
                    v-if="encryptState.stage !== EncryptStage.Output"
                    prepend-icon="mdi-arrow-u-down-right"
                    variant="text"
                    color="primary"
                    @click="skipToOutput"
                  >
                    {{ t('simulator.skip-full') }}
                  </v-btn>
                </transition>
                <v-btn
                  prependIcon="mdi-lock-reset"
                  :variant="encryptState.stage === EncryptStage.Output ? 'flat' : 'outlined'"
                  color="primary"
                  @click="encryptState.reset"
                >
                  {{ t('simulator.reset') }}
                </v-btn>
              </div>
            </transition>
          </div>
          <transition
            appear
            name="opacity"
          >
            <div v-if="encryptState.output && encryptState.stage > EncryptStage.Input">
              <section class="transposeStep">
                <StepDropdown
                  :model-value="encryptState.stage === EncryptStage.ToState"
                  eager
                  :title="`${t('simulator.plaintext')} ➜ ${t('simulator.state')}`"
                  :tutorial-key="TutorialKey.PlaintextToState"
                  :background-color="theme.current.value.colors.background"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesTranspose
                        id="plaintext-to-state"
                        :timeline="timeline"
                        :input="encryptState.plaintext"
                      >
                      </AnimationAesTranspose>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.ToState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.stage = EncryptStage.SymmetryKeyAddition
                        }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section class="initialStep">
                <StepDropdown
                  :model-value="encryptState.stage === EncryptStage.SymmetryKeyAddition"
                  :eager="encryptState.stage === EncryptStage.ToState"
                  :title="`${t('simulator.add-key')}`"
                  :tutorial-key="TutorialKey.AddKey"
                  :background-color="theme.current.value.colors.background"
                  no-auto-scroll-on-update
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesAddKey
                        id="add-key"
                        :timeline="timeline"
                        :key-value="(encryptState.output.symmetryKeyAddition as AesiRoundStepAddKey)?.roundKey"
                        :input="encryptState.output.symmetryKeyAddition?.inputState"
                        :output="encryptState.output.symmetryKeyAddition?.outputState"
                      >
                      </AnimationAesAddKey>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.SymmetryKeyAddition"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'text'"
                        prepend-icon="mdi-selection-ellipse-arrow-inside"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.startRounds()
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
                  v-if="encryptState.stats"
                  v-model="encryptState.showStats"
                  :stats="encryptState.stats"
                  :roundIndex="encryptState.roundIndex + roundProgressBarOffsetRoundOffset"
                  :roundCount="encryptState.roundCount"
                >

                </StatsDropdown>
                <RoundProgressBar
                  class="roundProgressBar"
                  :class="{
                    'moveUp': encryptState.showStats
                  }"
                  :roundIndex="encryptState.roundIndex + roundProgressBarOffsetRoundOffset"
                  :roundCount="encryptState.roundCount"
                  @click="onRoundProgressBarClick"
                />
              </section>
              <section class="rounds">
                <StepDropdown
                  :model-value="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                  :eager="(encryptState.stage === EncryptStage.SymmetryKeyAddition) || ((encryptState.step?.type === AesiRoundStepType.AddRoundKey) && encryptState.stage === EncryptStage.Rounds)"
                  :title="`${t('simulator.substitute-bytes')}`"
                  :turned-off="configState.noSubBytes"
                  :layer-icon="configState.noSubBytes ? 'mdi-layers-off' : 'mdi-layers'"
                  :tutorial-key="TutorialKey.SubBytes"
                  variant="default"
                >
                  <p v-if="configState.noSubBytes">
                    {{ configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="encryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesSubstituteBytes
                        :timeline="timeline"
                        :sbox="S_BOX"
                        :input="encryptState.getStep(AesiRoundStepType.SubBytes)?.inputState"
                        :output="encryptState.getStep(AesiRoundStepType.SubBytes)?.outputState"
                      >
                      </AnimationAesSubstituteBytes>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.nextStep()
                        }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                  :eager="encryptState.step?.type === AesiRoundStepType.SubBytes"
                  :title="`${t('simulator.shift-rows')}`"
                  :turned-off="configState.noShiftRows"
                  :layer-icon="configState.noShiftRows ? 'mdi-layers-off' : 'mdi-layers'"
                  :tutorial-key="TutorialKey.ShiftRows"
                  variant="default"
                >
                  <p v-if="configState.noShiftRows">
                    {{ configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="encryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesShiftRows
                        :timeline="timeline"
                        :input="encryptState.getStep(AesiRoundStepType.ShiftRows)?.inputState"
                        :output="encryptState.getStep(AesiRoundStepType.ShiftRows)?.outputState"
                      >
                      </AnimationAesShiftRows>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.nextStep()
                        }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="encryptState.step?.type === AesiRoundStepType.MixColumns"
                  :eager="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                  :title="`${t('simulator.mix-columns')}`"
                  :turned-off="noMixColumns"
                  :layer-icon="configState.noMixColumns ? 'mdi-layers-off' : 'mdi-layers'"
                  :tutorial-key="TutorialKey.MixColumns"
                  variant="default"
                >
                  <p v-if="noMixColumns">
                    {{ encryptState.isLastRound ? t('simulator.no-mix-columns-last') : configState.offMessage }}
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="encryptState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesMixColumns
                        :timeline="timeline"
                        :matrix="A"
                        :input="encryptState.getStep(AesiRoundStepType.MixColumns)?.inputState"
                        :output="encryptState.getStep(AesiRoundStepType.MixColumns)?.outputState"
                      >
                      </AnimationAesMixColumns>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.MixColumns"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.nextStep()
                        }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="encryptState.step?.type === AesiRoundStepType.AddRoundKey && encryptState.stage === EncryptStage.Rounds"
                  :eager="encryptState.step?.type === AesiRoundStepType.MixColumns || ((encryptState.step?.type === AesiRoundStepType.ShiftRows) && encryptState.isLastRound)"
                  :title="`${t('simulator.add-round-key')}`"
                  :tutorial-key="TutorialKey.AddRoundKey"
                  variant="default"
                >
                  <AnimationAesAnimationFrame :timeline-key="encryptState.roundIndex">
                    <template #animation="{ timeline }">
                      <AnimationAesAddKey
                        id="add-round-key"
                        :timeline="timeline"
                        :key-value="(encryptState.getStep(AesiRoundStepType.AddRoundKey) as AesiRoundStepAddKey).roundKey"
                        :input="encryptState.getStep(AesiRoundStepType.AddRoundKey)?.inputState"
                        :output="encryptState.getStep(AesiRoundStepType.AddRoundKey)?.outputState"
                      >
                      </AnimationAesAddKey>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.AddRoundKey"
                    >
                      <v-btn
                        v-if="!encryptState.isLastStep && !encryptState.isSecondToLastRound"
                        :variant="timeline.currentTime > 9_500 ? 'outlined' : 'text'"
                        prepend-icon="mdi-arrow-u-down-right"
                        color="primary"
                        @click="(_: Event) => {
                          tutorial.close()
                          encryptState.skipToLastRound()
                          scrollToRoundsHeader()
                        }"
                      >{{ t('simulator.skip') }}</v-btn>
                      <v-btn
                        v-if="!encryptState.isLastStep"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'text'"
                        prepend-icon="mdi-rotate-right"
                        color="primary"
                        @click="(_: Event) => {
                          tutorial.close()
                          encryptState.nextRound()
                          scrollToRoundsHeader()
                        }"
                      >{{ t('simulator.next-round') }}</v-btn>
                      <v-btn
                        v-if="encryptState.isLastStep && encryptState.stage === EncryptStage.Rounds"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'text'"
                        prepend-icon="mdi-flag-checkered"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.stage = EncryptStage.FromState
                        }"
                      >{{ t('simulator.finish-rounds') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section class="transposeStep">
                <StepDropdown
                  :model-value="encryptState.stage === EncryptStage.FromState"
                  :eager="encryptState.step?.type === AesiRoundStepType.AddRoundKey"
                  :title="`${t('simulator.state')} ➜ ${t('simulator.ciphertext')}`"
                  :tutorial-key="TutorialKey.StateToCiphertext"
                  :background-color="theme.current.value.colors.background"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesTranspose
                        id="state-to-ciphertext"
                        :timeline="timeline"
                        :input="encryptState.output.rounds.at(-1)?.steps.at(-1)?.outputState"
                      >
                      </AnimationAesTranspose>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.FromState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-lock"
                        color="primary"
                        @click="() => {
                          tutorial.close()
                          restartAndPause()
                          encryptState.stage = EncryptStage.Output
                        }"
                      >{{ `${t('simulator.finish')} ${t('simulator.encryption')}` }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
            </div>
          </transition>
          <section
            class="output"
            v-if="encryptState.stage === EncryptStage.Output && encryptState.outputString"
            ref="outputHexArea"
          >
            <HexArea
              v-model="encryptState.outputString"
              title-key="simulator.ciphertext"
              :max-length="128"
              disabled
              :duplicate="{
                snackbarMessage: t('simulator.hexArea.duplicated-ciphertext'),
                tooltipMessage: t('simulator.hexArea.duplicate-ciphertext-tooltip'),
                onDuplicate: duplicateCiphertext,
                goTo: Tab.Decrypt
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
.encryptPage {
  height: 100%;

  .inputs {
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

  .controlButtonsContainer {
    display: flex;
    justify-content: flex-end;
    margin: 36px 24px 12px 0;
  }

  .output {
    display: flex;
    justify-content: center;
    height: min-content;
  }

  .transposeStep {
    margin: 20px 0;
  }

  .initialStep {
    margin-bottom: 42px;
  }

  .roundsHeader {
    margin-bottom: 18px;
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
    margin-bottom: 58px;
  }
}

.selectedKeySize {
  display: none;
}
</style>