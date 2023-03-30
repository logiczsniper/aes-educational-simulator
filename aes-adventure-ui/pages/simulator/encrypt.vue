<script setup lang="ts">
import { AesiRoundStepAddKey, AesiRoundStepType } from '~~/utils/aesi/aesi.types';
import { S_BOX } from '~~/utils/aesi/core/constants';
import { A } from '~~/utils/aesi/core/constants';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop'
  }
})

const roundsHeader = ref<HTMLElement>()
const scrollToRoundsHeader = () => {
  if (!roundsHeader.value) return

  roundsHeader.value.scrollIntoView({
    behavior: "smooth"
  })
}

const encryptState = useEncryptState();
const configState = useConfig()

const noMixColumns = computed(() => encryptState.isLastRound || configState.noMixColumns)
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
            />
            <HexArea
              v-model="encryptState.rawKey"
              title-key="simulator.key"
              :max-length="encryptState.keySize"
              :key="encryptState.keySize"
              :disabled="encryptState.stage !== EncryptStage.Input"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
                  :disabled="encryptState.stage !== EncryptStage.Input"
                  :model-value="encryptState.keySize"
                  @update:model-value="encryptState.setKeySize"
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
              v-if="encryptState.stage === EncryptStage.Input"
              :disabled="!encryptState.canComputeEncryptOutput"
              prependIcon="mdi-lock"
              variant="flat"
              color="primary"
              class="startButton"
              @click="encryptState.computeEncryptOutput"
            >
              {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
            </v-btn>
            <v-btn
              v-else
              prependIcon="mdi-lock-reset"
              :variant="encryptState.stage === EncryptStage.Output ? 'flat' : 'outlined'"
              color="primary"
              class="resetButton"
              @click="encryptState.reset"
            >
              {{ t('simulator.reset') }}
            </v-btn>
          </transition>
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
                  background-color="#f9f9f9"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.ToState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
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
                  :tutorial-key="TutorialKey.Test"
                  background-color="#f9f9f9"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.SymmetryKeyAddition"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-selection-ellipse-arrow-inside"
                        color="primary"
                        @click="() => {
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
                  :roundIndex="encryptState.roundIndex + Number(encryptState.stage >= EncryptStage.FromState) - Number(encryptState.stage < EncryptStage.Rounds)"
                  :roundCount="encryptState.roundCount"
                >

                </StatsDropdown>
                <RoundProgressBar
                  class="roundProgressBar"
                  :class="{
                    'moveUp': encryptState.showStats
                  }"
                  :roundIndex="encryptState.roundIndex + Number(encryptState.stage >= EncryptStage.FromState) - Number(encryptState.stage < EncryptStage.Rounds)"
                  :roundCount="encryptState.roundCount"
                />
              </section>
              <section class="rounds">
                <StepDropdown
                  :model-value="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                  :eager="(encryptState.stage === EncryptStage.SymmetryKeyAddition) || ((encryptState.step?.type === AesiRoundStepType.AddRoundKey) && encryptState.stage === EncryptStage.Rounds)"
                  :title="`${t('simulator.substitute-bytes')}`"
                  :turned-off="configState.noSubBytes"
                  :tutorial-key="TutorialKey.Default"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
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
                  :tutorial-key="TutorialKey.Test"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 10_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
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
                  :tutorial-key="TutorialKey.Test"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.MixColumns"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 9_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
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
                  :tutorial-key="TutorialKey.Test"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.step?.type === AesiRoundStepType.AddRoundKey"
                    >
                      <v-btn
                        v-if="!encryptState.isLastStep && !encryptState.isSecondToLastRound"
                        :variant="timeline.currentTime > 9_500 ? 'outlined' : 'plain'"
                        prepend-icon="mdi-arrow-u-down-right"
                        color="primary"
                        @click="(_: Event) => {
                          encryptState.skipToLastRound()
                          scrollToRoundsHeader()
                        }"
                      >{{ t('simulator.skip') }}</v-btn>
                      <v-btn
                        v-if="!encryptState.isLastStep"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-rotate-right"
                        color="primary"
                        @click="(_: Event) => {
                          encryptState.nextRound()
                          scrollToRoundsHeader()
                        }"
                      >{{ t('simulator.next-round') }}</v-btn>
                      <v-btn
                        v-if="encryptState.isLastStep && encryptState.stage === EncryptStage.Rounds"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-flag-checkered"
                        color="primary"
                        @click="() => {
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
                  :tutorial-key="TutorialKey.Test"
                  background-color="#f9f9f9"
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
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="encryptState.stage === EncryptStage.FromState"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-lock"
                        color="primary"
                        @click="() => {
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
          >
            <HexArea
              v-model="encryptState.outputString"
              title-key="simulator.ciphertext"
              :max-length="128"
              disabled
            />
          </section>
          <div style="height: 1px;" />
        </div>
      </transition>
    </ClientOnly>
  </main>
</template>

<style scoped lang="scss">
.encryptPage {
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
    margin: 36px 44px 12px auto;
  }

  .transposeStep {
    margin: 20px 0;
  }

  .initialStep {
    margin-bottom: 20px;
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
  }
}

.selectedKeySize {
  display: none;
}
</style>