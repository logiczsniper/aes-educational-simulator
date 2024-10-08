<script setup lang="ts">
import { useTheme } from 'vuetify';
import { AesiExpandKeyRoundStepAddWords, AesiExpandKeyRoundStepRoundGFn, AesiExpandKeyRoundStepRoundHFn, AesiExpandKeyRoundStepType } from '~~/utils/aesi/aesi.types';
import { duplicateKey } from '~~/utils/state/duplicateKey';

const { t } = useI18n()

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.expand')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.expand-description')
    }
  ]
})

const theme = useTheme()

const keyExpansionState = useKeyExpansionState()
const tutorial = useTutorial()

const noHFunction = computed(() => !keyExpansionState.round?.steps.find(({ type }) => type === AesiExpandKeyRoundStepType.RoundHFn))
const noHFunctionMessage = computed(() => {
  if (keyExpansionState.keySize === 128 || keyExpansionState.keySize === 192) return t('simulator.no-h-function-key-size')

  return t('simulator.no-h-function-last')
})

const smallRounds = computed(() => {
  switch (keyExpansionState.keySize) {
    case 128: return []
    case 192: return [1, 3, 5, 7]
    case 256: return [6]
  }
})

const roundProgressBarOffsetRoundOffset = computed(() => {
  const showRoundZeroBeforeRounds = keyExpansionState.roundIndex === 0 ? -Number(keyExpansionState.stage < KeyExpansionStage.Rounds) : 0
  const showRoundMaxAfterRounds = keyExpansionState.isLastRound ? Number(keyExpansionState.stage > KeyExpansionStage.Rounds) : 0

  return showRoundZeroBeforeRounds + showRoundMaxAfterRounds
})
const onRoundProgressBarClick = (roundNumber: number) => {
  const roundIndex = roundNumber - 1
  keyExpansionState.setRound(roundIndex)
}

const roundIndex = computed(() => Math.min(
  keyExpansionState.roundCount,
  keyExpansionState.roundIndex + roundProgressBarOffsetRoundOffset.value + 1
))

const outputHexArea = ref<HTMLElement>()
const skipToOutput = () => {
  keyExpansionState.skipToOutput()
  setTimeout(() => {
    outputHexArea.value?.scrollIntoView({
      behavior: 'smooth',
    })
  }, 500)
}
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
              :disabled-text="t('simulator.disabled-input')"
              :duplicate="{
                snackbarMessage: t('simulator.hexArea.duplicated-keys'),
                tooltipMessage: t('simulator.hexArea.duplicate-keys-tooltip'),
                onDuplicate: key => duplicateKey(key, Tab.KeyExpansion)
              }"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
                  :disabled="keyExpansionState.stage !== KeyExpansionStage.Input"
                  :title="keyExpansionState.stage !== KeyExpansionStage.Input ? t('simulator.disabled-input') : ''"
                  :model-value="keyExpansionState.keySize"
                  @update:model-value="keyExpansionState.setKeySize"
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
                v-if="keyExpansionState.stage === KeyExpansionStage.Input"
                :disabled="!keyExpansionState.canComputeKeyExpansionOutput"
                :title="!keyExpansionState.canComputeKeyExpansionOutput ? t('simulator.disabled-start') : ''"
                prependIcon="mdi-key-plus"
                variant="flat"
                color="primary"
                @click="keyExpansionState.computeKeyExpansionOutput"
              >
                {{ `${t('simulator.start')} ${t('simulator.expansion')}` }}
              </v-btn>
              <div v-else>
                <transition name="opacity">
                  <v-btn
                    v-if="keyExpansionState.stage !== KeyExpansionStage.Output"
                    prepend-icon="mdi-arrow-u-down-right"
                    variant="text"
                    color="primary"
                    @click="skipToOutput"
                  >
                    {{ t('simulator.skip-full') }}
                  </v-btn>
                </transition>
                <v-btn
                  prependIcon="mdi-restart"
                  :variant="keyExpansionState.stage === KeyExpansionStage.Output ? 'flat' : 'outlined'"
                  color="primary"
                  @click="keyExpansionState.reset"
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
            <div v-if="keyExpansionState.output && keyExpansionState.stage > KeyExpansionStage.Input">
              <section class="transposeStep">
                <StepDropdown
                  :model-value="keyExpansionState.stage === KeyExpansionStage.ToWords"
                  eager
                  :title="`${t('simulator.key')} ➜ ${t('simulator.state')}`"
                  :tutorial-key="TutorialKey.KeyToState"
                  :background-color="theme.current.value.colors.background"
                  no-auto-scroll-on-update
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
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.stage === KeyExpansionStage.ToWords"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-selection-ellipse-arrow-inside"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          tutorial.close()
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
                      <TutorialIconButton :tutorial-key="TutorialKey.KeyRoundHeader" />
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
                  :roundIndex="keyExpansionState.roundIndex + roundProgressBarOffsetRoundOffset"
                  :roundCount="keyExpansionState.roundCount"
                  :small-rounds="smallRounds"
                  @click="onRoundProgressBarClick"
                />
              </section>
              <section class="rounds">
                <StepDropdown
                  :model-value="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.AddWords && keyExpansionState.stage === KeyExpansionStage.Rounds"
                  eager
                  :title="t('simulator.add-words')"
                  :tutorial-key="TutorialKey.AddWords"
                  variant="default"
                >
                  <AnimationAesAnimationFrame :timeline-key="keyExpansionState.roundIndex">
                    <template #animation="{ timeline }">
                      <AnimationAesAddWords
                        :timeline="timeline"
                        :key-size="keyExpansionState.keySize"
                        :has-h-fn="!noHFunction"
                        :step="(keyExpansionState.getStep(AesiExpandKeyRoundStepType.AddWords) as AesiExpandKeyRoundStepAddWords)"
                      >
                      </AnimationAesAddWords>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.AddWords && keyExpansionState.stage === KeyExpansionStage.Rounds"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 20_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-redo"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          tutorial.close()
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
                  :tutorial-key="TutorialKey.RoundGFn"
                  variant="default"
                >
                  <AnimationAesAnimationFrame :timeline-key="keyExpansionState.roundIndex">
                    <template #animation="{ timeline }">
                      <AnimationAesGFn
                        :timeline="timeline"
                        :step="(keyExpansionState.getStep(AesiExpandKeyRoundStepType.RoundGFn) as AesiExpandKeyRoundStepRoundGFn)"
                      >
                      </AnimationAesGFn>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundGFn && keyExpansionState.stage === KeyExpansionStage.Rounds"
                    >
                      <template v-if="noHFunction">
                        <v-btn
                          v-if="!keyExpansionState.isLastStep && !keyExpansionState.isSecondToLastRound"
                          :variant="timeline.completed ? 'outlined' : 'text'"
                          prepend-icon="mdi-arrow-u-down-right"
                          color="primary"
                          @click="(_: Event) => {
                            tutorial.close()
                            keyExpansionState.skipToLastRound()
                          }"
                        >{{ t('simulator.skip') }}</v-btn>
                        <v-btn
                          v-if="!keyExpansionState.isLastStep"
                          :variant="timeline.completed ? 'flat' : 'text'"
                          prepend-icon="mdi-rotate-right"
                          color="primary"
                          @click="(_: Event) => {
                            tutorial.close()
                            keyExpansionState.nextRound()
                          }"
                        >{{ t('simulator.next-round') }}</v-btn>
                        <v-btn
                          v-if="keyExpansionState.isLastStep && keyExpansionState.stage === KeyExpansionStage.Rounds"
                          :variant="timeline.completed ? 'flat' : 'text'"
                          prepend-icon="mdi-flag-checkered"
                          color="primary"
                          @click="() => {
                            restartAndPause()
                            tutorial.close()
                            keyExpansionState.stage = KeyExpansionStage.FromWords
                          }"
                        >{{ t('simulator.finish-rounds') }}</v-btn>
                      </template>
                      <template v-else>
                        <v-btn
                          :variant="timeline.completed ? 'flat' : 'text'"
                          prepend-icon="mdi-redo"
                          color="primary"
                          @click="() => {
                            restartAndPause()
                            tutorial.close()
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
                  :tutorial-key="TutorialKey.RoundHFn"
                  variant="default"
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
                        :step="(keyExpansionState.getStep(AesiExpandKeyRoundStepType.RoundHFn) as AesiExpandKeyRoundStepRoundHFn)"
                      >
                      </AnimationAesHFn>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.step?.type === AesiExpandKeyRoundStepType.RoundHFn"
                    >
                      <v-btn
                        v-if="!keyExpansionState.isLastStep && !keyExpansionState.isSecondToLastRound"
                        :variant="timeline.currentTime > 9_500 ? 'outlined' : 'text'"
                        prepend-icon="mdi-arrow-u-down-right"
                        color="primary"
                        @click="(_: Event) => {
                          tutorial.close()
                          keyExpansionState.skipToLastRound()
                        }"
                      >{{ t('simulator.skip') }}</v-btn>
                      <v-btn
                        v-if="!keyExpansionState.isLastStep"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'text'"
                        prepend-icon="mdi-rotate-right"
                        color="primary"
                        @click="(_: Event) => {
                          tutorial.close()
                          keyExpansionState.nextRound()
                        }"
                      >{{ t('simulator.next-round') }}</v-btn>
                      <v-btn
                        v-if="keyExpansionState.isLastStep && keyExpansionState.stage === KeyExpansionStage.Rounds"
                        :variant="timeline.currentTime > 9_500 ? 'flat' : 'text'"
                        prepend-icon="mdi-flag-checkered"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          tutorial.close()
                          keyExpansionState.stage = KeyExpansionStage.FromWords
                        }"
                      >{{ t('simulator.finish-rounds') }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
              <section class="transposeStep">
                <StepDropdown
                  :model-value="keyExpansionState.stage === KeyExpansionStage.FromWords"
                  :eager="keyExpansionState.isLastStep"
                  :title="`${t('simulator.state')} ➜ ${t('simulator.round-keys')}`"
                  :tutorial-key="TutorialKey.StateToRoundKeys"
                  :background-color="theme.current.value.colors.background"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">
                      <AnimationAesStateToRoundKeys
                        :timeline="timeline"
                        :key-size="keyExpansionState.keySize"
                        :round-count="keyExpansionState.roundCount"
                        :expanded-key="keyExpansionState.output.expandedKey"
                      >
                      </AnimationAesStateToRoundKeys>
                    </template>
                    <template
                      #appendControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.stage === KeyExpansionStage.FromWords"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'text'"
                        prepend-icon="mdi-key-plus"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          tutorial.close()
                          keyExpansionState.stage = KeyExpansionStage.Output
                        }"
                      >{{ `${t('simulator.finish')} ${t('simulator.key-expansion')}` }}</v-btn>
                    </template>
                  </AnimationAesAnimationFrame>
                </StepDropdown>
              </section>
            </div>
          </transition>
          <section
            class="output"
            v-if="keyExpansionState.stage === KeyExpansionStage.Output"
            ref="outputHexArea"
          >
            <div>
              <div class="outputHeader">
                <h3>{{ t('simulator.round-keys') }}</h3>
                <TutorialIconButton
                  class="outputTutorial"
                  :tutorial-key="TutorialKey.RoundKeys"
                />
              </div>
              <div class="outputBody">
                <div
                  v-for="roundKeyString in keyExpansionState.outputRoundKeysStrings"
                  class="code"
                >{{ roundKeyString }}</div>
              </div>
            </div>
          </section>
          <div style="height: 140px;" />
        </div>
      </transition>
    </ClientOnly>
  </main>
</template>

<style scoped lang="scss">
.keyExpansionPage {
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

  .output {
    justify-content: center;
    height: min-content;
    display: flex;
    flex-direction: column;
    align-items: center;

    .outputHeader {
      display: flex;
      cursor: default;

      .outputTutorial {
        height: min-content;
        margin-top: 6px;
        margin-left: 12px;
      }
    }

    .outputBody {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background-color: rgb(var(--v-theme-surface));
      border: 3px solid rgb(var(--v-theme-surface));
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
      margin-bottom: 26px;
      color: rgb(84, 84, 84);
    }
  }

  .controlButtonsContainer {
    display: flex;
    justify-content: flex-end;
    margin: 36px 24px 12px 0;
  }

  .transposeStep {
    margin: 20px 0;
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
    margin-bottom: 58px;
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
      height: min-content;
    }
  }

  .roundIndex {
    background-color: rgb(var(--v-theme-surface));
    border-radius: 4px;
    place-self: center;
    padding: 14px;
    font-weight: bold;
  }

  .roundLabel {
    justify-self: flex-end;
    margin-right: 10px;
  }

  .roundCount {
    margin-left: 9px;
    display: flex;
    gap: 16px;
    align-items: center;
  }
}
</style>