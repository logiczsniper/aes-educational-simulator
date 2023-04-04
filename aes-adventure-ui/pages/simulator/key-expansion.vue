<script setup lang="ts">
import { AesiExpandKeyRoundStepRoundGFn, AesiExpandKeyRoundStepRoundHFn, AesiExpandKeyRoundStepType } from '~~/utils/aesi/aesi.types';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop'
  }
})

const keyExpansionState = useKeyExpansionState()

const noHFunction = computed(() => !keyExpansionState.round?.steps.find(({ type }) => type === AesiExpandKeyRoundStepType.RoundHFn))
const noHFunctionMessage = computed(() => {
  if (keyExpansionState.keySize === 128 || keyExpansionState.keySize === 192) return t('simulator.no-h-function-key-size')

  return t('simulator.no-h-function-last')
})

const smallLastRound = computed(() => keyExpansionState.keySize === 192 || keyExpansionState.keySize === 256)

const roundIndex = computed(() => Math.min(
  keyExpansionState.roundCount,
  keyExpansionState.roundIndex + Number(keyExpansionState.stage >= KeyExpansionStage.FromWords) - Number(keyExpansionState.stage < KeyExpansionStage.Rounds) + 1
))
</script>

<template>
  <main class="keyExpansionPage">
    <ClientOnly>
      <transition
        appear
        name="opacity"
      >
        <div>
          <section class="inputs">
            <HexArea
              v-model="keyExpansionState.rawKey"
              title-key="simulator.key"
              :max-length="keyExpansionState.keySize"
              :key="keyExpansionState.keySize"
              :disabled="keyExpansionState.stage !== KeyExpansionStage.Input"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
                  :disabled="keyExpansionState.stage !== KeyExpansionStage.Input"
                  :model-value="keyExpansionState.keySize"
                  @update:model-value="keyExpansionState.setKeySize"
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
              v-if="keyExpansionState.stage === KeyExpansionStage.Input"
              :disabled="!keyExpansionState.canComputeKeyExpansionOutput"
              prependIcon="mdi-key-plus"
              variant="flat"
              color="primary"
              class="startButton"
              @click="keyExpansionState.computeKeyExpansionOutput"
            >
              {{ `${t('simulator.start')} ${t('simulator.expansion')}` }}
            </v-btn>
            <v-btn
              v-else
              prependIcon="mdi-restart"
              :variant="keyExpansionState.stage === KeyExpansionStage.Output ? 'flat' : 'outlined'"
              color="primary"
              class="resetButton"
              @click="keyExpansionState.reset"
            >
              {{ t('simulator.reset') }}
            </v-btn>
          </transition>
          <transition
            appear
            name="opacity"
          >
            <div v-if="keyExpansionState.output && keyExpansionState.stage > KeyExpansionStage.Input">
              <section class="transposeStep">
                <StepDropdown
                  :model-value="keyExpansionState.stage === KeyExpansionStage.ToWords"
                  eager
                  :title="`${t('simulator.key')} ➜ ${t('simulator.state')}`"
                  :tutorial-key="TutorialKey.PlaintextToState"
                  background-color="#f9f9f9"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesKeyToState
                        :timeline="timeline"
                        :key-size="keyExpansionState.keySize"
                        :input="keyExpansionState.key"
                      >

                      </AnimationAesKeyToState>
                    </template>
                    <template
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.stage === KeyExpansionStage.ToWords"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-selection-ellipse-arrow-inside"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          keyExpansionState.startRounds()
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
                <div
                  class="titleContainer"
                  :class="{ 'singleDigit': roundIndex < 10 }"
                >
                  <div />
                  <h4 class="roundLabel">{{ t('simulator.round') }}</h4>
                  <h2 class="roundIndex">
                    {{ roundIndex }}
                  </h2>
                  <div class="roundCount">
                    <h4>/ {{ keyExpansionState.roundCount }}</h4>
                    <div>
                      <TutorialIconButton :tutorial-key="TutorialKey.Test" />
                    </div>
                  </div>
                  <p class="totalRoundKeys">
                    <v-icon
                      icon="mdi-key-chain"
                      :size="18"
                    />
                    <b>{{ `${keyExpansionState.keysGeneratedSoFar}` }}</b>
                    <small class="denominator">{{ ` / ${keyExpansionState.keysTotal} ${t('simulator.keys-generated')}`
                    }}</small>
                  </p>
                </div>

                <RoundProgressBar
                  class="roundProgressBar"
                  :roundIndex="keyExpansionState.roundIndex + Number(keyExpansionState.stage >= KeyExpansionStage.FromWords) - Number(keyExpansionState.stage < KeyExpansionStage.Rounds)"
                  :roundCount="keyExpansionState.roundCount"
                  :small-last-round="smallLastRound"
                />
              </section>
              <section class="rounds">
                <StepDropdown
                  :model-value="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.AddWords && keyExpansionState.stage === KeyExpansionStage.Rounds"
                  eager
                  :title="t('simulator.add-words')"
                  :tutorial-key="TutorialKey.Test"
                >
                  <AnimationAesAnimationFrame :timeline-key="keyExpansionState.roundIndex">
                    <template #animation="{ timeline }">
                      add words animation
                    </template>
                    <template
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.AddWords && keyExpansionState.stage === KeyExpansionStage.Rounds"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 20_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          keyExpansionState.nextStep()
                        }"
                      >{{ t('simulator.next-step') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundGFn && keyExpansionState.stage === KeyExpansionStage.Rounds"
                  eager
                  :title="`${t('simulator.round')} <span class='math'>𝑔</span>-${t('simulator.function')}`"
                  :tutorial-key="TutorialKey.Test"
                >
                  <AnimationAesAnimationFrame :timeline-key="keyExpansionState.roundIndex">
                    <template #animation="{ timeline }">
                      <AnimationAesGFn
                        :timeline="timeline"
                        :step="keyExpansionState.getStep(AesiExpandKeyRoundStepType.RoundGFn) as AesiExpandKeyRoundStepRoundGFn"
                      >
                      </AnimationAesGFn>
                    </template>
                    <template
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundGFn && keyExpansionState.stage === KeyExpansionStage.Rounds"
                    >
                      <template v-if="noHFunction">
                        <v-btn
                          v-if="!keyExpansionState.isLastStep && !keyExpansionState.isSecondToLastRound"
                          :variant="timeline.completed ? 'outlined' : 'plain'"
                          prepend-icon="mdi-arrow-u-down-right"
                          color="primary"
                          @click="(_: Event) => {
                            keyExpansionState.skipToLastRound()
                          }"
                        >{{ t('simulator.skip') }}</v-btn>
                        <v-btn
                          v-if="!keyExpansionState.isLastStep"
                          :variant="timeline.completed ? 'flat' : 'plain'"
                          prepend-icon="mdi-rotate-right"
                          color="primary"
                          @click="(_: Event) => {
                            keyExpansionState.nextRound()
                          }"
                        >{{ t('simulator.next-round') }}</v-btn>
                        <v-btn
                          v-if="keyExpansionState.isLastStep && keyExpansionState.stage === KeyExpansionStage.Rounds"
                          :variant="timeline.completed ? 'flat' : 'plain'"
                          prepend-icon="mdi-flag-checkered"
                          color="primary"
                          @click="() => {
                            restartAndPause()
                            keyExpansionState.stage = KeyExpansionStage.Output
                            // TODO: can we remove KeyExpansionStage.FromWords?
                          }"
                        >{{ t('simulator.finish-rounds') }}</v-btn>
                      </template>
                      <template v-else>
                        <v-btn
                          :variant="timeline.completed ? 'flat' : 'plain'"
                          prepend-icon="mdi-redo"
                          color="primary"
                          @click="() => {
                            restartAndPause()
                            keyExpansionState.nextStep()
                          }"
                        >{{ t('simulator.next-step') }}</v-btn>
                      </template>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
                <StepDropdown
                  :model-value="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundHFn"
                  eager
                  :turned-off="noHFunction"
                  :title="`${t('simulator.round')} <span class='math'>ℎ</span>-${t('simulator.function')}`"
                  :tutorial-key="TutorialKey.Test"
                >
                  <p
                    v-if="noHFunction"
                    v-html="noHFunctionMessage"
                  >
                  </p>
                  <AnimationAesAnimationFrame
                    v-else
                    :timeline-key="keyExpansionState.roundIndex"
                  >
                    <template #animation="{ timeline }">
                      <AnimationAesHFn
                        :timeline="timeline"
                        :step="keyExpansionState.getStep(AesiExpandKeyRoundStepType.RoundHFn) as AesiExpandKeyRoundStepRoundHFn"
                      >
                      </AnimationAesHFn>
                    </template>
                    <template
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundHFn"
                    >
                      <v-btn
                        v-if="!keyExpansionState.isLastStep && !keyExpansionState.isSecondToLastRound"
                        :variant="timeline.currentTime > 9_500 ? 'outlined' : 'plain'"
                        prepend-icon="mdi-arrow-u-down-right"
                        color="primary"
                        @click="(_: Event) => {
                          keyExpansionState.skipToLastRound()
                        }"
                      >{{ t('simulator.skip') }}</v-btn>
                      <v-btn
                        v-if="!keyExpansionState.isLastStep"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-rotate-right"
                        color="primary"
                        @click="(_: Event) => {
                          keyExpansionState.nextRound()
                        }"
                      >{{ t('simulator.next-round') }}</v-btn>
                      <v-btn
                        v-if="keyExpansionState.isLastStep && keyExpansionState.stage === KeyExpansionStage.Rounds"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'plain'"
                        prepend-icon="mdi-flag-checkered"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          keyExpansionState.stage = KeyExpansionStage.Output
                          // TODO: can we remove KeyExpansionStage.FromWords?
                        }"
                      >{{ t('simulator.finish-rounds') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
            </div>
          </transition>
          <section
            class="output"
            v-if="keyExpansionState.stage === KeyExpansionStage.Output"
          >
            TODO: output show the round keys
          </section>
          <div style="height: 1px;" />
        </div>
      </transition>
    </ClientOnly>
  </main>
</template>

<style scoped lang="scss">
.keyExpansionPage {
  // width: 100%;
  height: 100%;

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

.titleContainer {
  display: grid;

  margin-bottom: 16px;

  $key-count-progress-width: 180px;
  align-items: center;
  width: 100%;

  grid-template-columns: $key-count-progress-width 1fr 56px 1fr $key-count-progress-width;

  &.singleDigit {
    grid-template-columns: $key-count-progress-width 1fr 38px 1fr $key-count-progress-width;
  }

  .totalRoundKeys {
    display: flex;
    align-items: center;
    gap: 6px;

    .denominator {
      height: 22px;
    }
  }

  .roundIndex {
    background-color: white;
    border-radius: 4px;
    place-self: center;
    padding: 14px;
    font-weight: bold;
  }

  .roundLabel {
    justify-self: flex-end;
    margin-right: 10px;
  }

  .roundIndex {}

  .roundCount {
    margin-left: 9px;
    display: flex;
    gap: 16px;
    align-items: center;
  }
}
</style>