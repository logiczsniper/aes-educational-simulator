<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'fade-drop'
  }
})

const keyExpansionState = useKeyExpansionState()
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
                      TODO: animation
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
                TODO: custom rounds header
                <!-- <StatsDropdown
                              v-if="keyExpansionState.stats"
                              v-model="keyExpansionState.showStats"
                              :stats="keyExpansionState.stats"
                              :roundIndex="keyExpansionState.roundIndex + Number(keyExpansionState.stage >= KeyExpansionStage.FromWords) - Number(keyExpansionState.stage < KeyExpansionStage.Rounds)"
                              :roundCount="keyExpansionState.roundCount"
                            >

                            </StatsDropdown> -->
                <RoundProgressBar
                  class="roundProgressBar"
                  :roundIndex="keyExpansionState.roundIndex + Number(keyExpansionState.stage >= KeyExpansionStage.FromWords) - Number(keyExpansionState.stage < KeyExpansionStage.Rounds)"
                  :roundCount="keyExpansionState.roundCount"
                />
              </section>
              <section class="rounds">
                TODO: rounds

                {{ keyExpansionState.output }}

                <StepDropdown
                  :model-value="keyExpansionState.stage === KeyExpansionStage.FromWords"
                  eager
                  :title="`${t('simulator.state')} ➜ ${t('simulator.round')} ${t('simulator.key')}`"
                  :tutorial-key="TutorialKey.Test"
                  background-color="#f9f9f9"
                >
                  <AnimationAesAnimationFrame>
                    <template #animation="{ timeline }">

                    </template>
                    <template
                      #prependControls="{ timeline, restartAndPause }"
                      v-if="keyExpansionState.stage === KeyExpansionStage.FromWords"
                    >
                      <v-btn
                        :variant="timeline.currentTime > 7_000 ? 'flat' : 'plain'"
                        prepend-icon="mdi-lock"
                        color="primary"
                        @click="() => {
                          restartAndPause()
                          keyExpansionState.stage = KeyExpansionStage.Output
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
    margin: 36px 44px 12px auto;
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
</style>