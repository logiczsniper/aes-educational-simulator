<script setup lang="ts">
import { AesiRound, AesiRoundStepAddKey, AesiRoundStepType } from '~~/utils/aesi/aesi.types';
import { S_BOX } from '~~/utils/aesi/core/constants';
import { A } from '~~/utils/aesi/core/constants';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
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

const canBeginEncryption = computed(() => encryptState.rawPlaintext.length === 32 && encryptState.rawKey.length * 4 === encryptState.keySize)
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
          <v-btn
            v-if="encryptState.stage === EncryptStage.Input"
            :disabled="!canBeginEncryption"
            prependIcon="mdi-lock"
            variant="flat"
            color="primary"
            class="startButton"
            @click="encryptState.calculateEncryptOutput"
          >
            {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
          </v-btn>
          <template v-if="encryptState.output && encryptState.stage > EncryptStage.Input">
            <section class="transposeStep">
              <StepDropdown
                :model-value="encryptState.stage === EncryptStage.ToState"
                :title="`${t('simulator.plaintext')} ➜ ${t('simulator.state')}`"
                :tutorial-key="TutorialKey.Test"
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
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.stage === EncryptStage.ToState"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-redo"
                    color="primary"
                    @click="encryptState.stage = EncryptStage.SymmetryKeyAddition"
                  >{{ t('simulator.next-step') }}</v-btn>
                </template>
              </StepDropdown>
            </section>
            <section class="initialStep">
              <StepDropdown
                :model-value="encryptState.stage === EncryptStage.SymmetryKeyAddition"
                :title="`${t('simulator.add-key')}`"
                :tutorial-key="TutorialKey.Test"
                background-color="#f9f9f9"
              >
                <AnimationAesAnimationFrame>
                  <template #animation="{ timeline }">
                    <AnimationAesAddKey
                      id="add-key"
                      :timeline="timeline"
                      :key-value="encryptState.key"
                      :input="encryptState.output.symmetryKeyAddition?.inputState"
                      :output="encryptState.output.symmetryKeyAddition?.outputState"
                    >
                    </AnimationAesAddKey>
                  </template>
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.stage === EncryptStage.SymmetryKeyAddition"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-selection-ellipse-arrow-inside"
                    color="primary"
                    @click="encryptState.startRounds"
                  >{{ t('simulator.start-rounds') }}</v-btn>
                </template>
              </StepDropdown>
            </section>
            <section
              ref="roundsHeader"
              class="roundsHeader"
            >
              [Round count, statistics and control timeline here]
              {{ 'Round: ' + encryptState.roundIndex }}
              {{ 'Step: ' + encryptState.stepIndex }}
            </section>
            <section class="rounds">
              <StepDropdown
                :model-value="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                :title="`${t('simulator.substitute-bytes')}`"
                :tutorial-key="TutorialKey.Default"
              >
                <AnimationAesAnimationFrame :timeline-key="encryptState.roundIndex">
                  <template #animation="{ timeline }">
                    <AnimationAesSubstituteBytes
                      :timeline="timeline"
                      :sbox="S_BOX"
                      :input="encryptState.getStep(AesiRoundStepType.SubBytes)?.inputState"
                      :output="encryptState.getStep(AesiRoundStepType.SubBytes)?.outputState"
                    >
                    </AnimationAesSubstituteBytes>
                  </template>
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.step?.type === AesiRoundStepType.SubBytes && encryptState.stage === EncryptStage.Rounds"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-redo"
                    color="primary"
                    @click="encryptState.nextStep"
                  >{{ t('simulator.next-step') }}</v-btn>
                </template>
              </StepDropdown>
              <StepDropdown
                :model-value="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                :title="`${t('simulator.shift-rows')}`"
                :tutorial-key="TutorialKey.Test"
              >
                <AnimationAesAnimationFrame :timeline-key="encryptState.roundIndex">
                  <template #animation="{ timeline }">
                    <AnimationAesShiftRows
                      :timeline="timeline"
                      :input="encryptState.getStep(AesiRoundStepType.ShiftRows)?.inputState"
                      :output="encryptState.getStep(AesiRoundStepType.ShiftRows)?.outputState"
                    >
                    </AnimationAesShiftRows>
                  </template>
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.step?.type === AesiRoundStepType.ShiftRows"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-redo"
                    color="primary"
                    @click="encryptState.nextStep"
                  >{{ t('simulator.next-step') }}</v-btn>
                </template>
              </StepDropdown>
              <StepDropdown
                :model-value="encryptState.step?.type === AesiRoundStepType.MixColumns"
                :title="`${t('simulator.mix-columns')}`"
                :tutorial-key="encryptState.isLastRound ? undefined : TutorialKey.Test"
                :line-through-title="encryptState.isLastRound"
                :background-color="encryptState.isLastRound ? '#e53f33' : undefined"
              >
                <AnimationAesAnimationFrame
                  v-if="!encryptState.isLastRound"
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
                </AnimationAesAnimationFrame>
                <p v-else>
                  {{ t('simulator.no-mix-columns-last') }}
                </p>
                <template
                  #footer
                  v-if="encryptState.step?.type === AesiRoundStepType.MixColumns"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-redo"
                    color="primary"
                    @click="encryptState.nextStep"
                  >{{ t('simulator.next-step') }}</v-btn>
                </template>
              </StepDropdown>
              <StepDropdown
                :model-value="encryptState.step?.type === AesiRoundStepType.AddRoundKey && encryptState.stage === EncryptStage.Rounds"
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
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.step?.type === AesiRoundStepType.AddRoundKey"
                >
                  <v-btn
                    v-if="!encryptState.isLastStep && !encryptState.isSecondToLastRound"
                    variant="outlined"
                    prepend-icon="mdi-arrow-u-down-right"
                    color="primary"
                    @click="(_: Event) => {
                      encryptState.skipToLastRound()
                      scrollToRoundsHeader()
                    }"
                  >{{ t('simulator.skip') }}</v-btn>
                  <v-btn
                    v-if="!encryptState.isLastStep"
                    variant="flat"
                    prepend-icon="mdi-rotate-right"
                    color="primary"
                    @click="(_: Event) => {
                      encryptState.nextRound()
                      scrollToRoundsHeader()
                    }"
                  >{{ t('simulator.next-round') }}</v-btn>
                  <v-btn
                    v-if="encryptState.isLastStep && encryptState.stage === EncryptStage.Rounds"
                    variant="flat"
                    prepend-icon="mdi-flag-checkered"
                    color="primary"
                    @click="encryptState.stage = EncryptStage.FromState"
                  >{{ t('simulator.finish-rounds') }}</v-btn>
                </template>
              </StepDropdown>
            </section>
            <section class="transposeStep">
              <StepDropdown
                :model-value="encryptState.stage === EncryptStage.FromState"
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
                </AnimationAesAnimationFrame>
                <template
                  #footer
                  v-if="encryptState.stage === EncryptStage.FromState"
                >
                  <v-btn
                    variant="flat"
                    prepend-icon="mdi-lock"
                    color="primary"
                    @click="encryptState.stage = EncryptStage.Output"
                  >{{ `${t('simulator.finish')} ${t('simulator.encryption')}` }}
                  </v-btn>
                </template>
              </StepDropdown>
            </section>
          </template>
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
          <v-btn
            v-if="encryptState.stage !== EncryptStage.Input"
            prependIcon="mdi-lock-reset"
            :variant="encryptState.stage === EncryptStage.Output ? 'flat' : 'outlined'"
            color="primary"
            class="resetButton"
            @click="encryptState.reset"
          >
            {{ t('simulator.reset') }}
          </v-btn>
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
    margin: 36px 20px 12px auto;
  }

  .resetButton {
    margin-bottom: 5vh;
  }

  .transposeStep {
    margin: 20px 0;
  }

  .initialStep {
    margin-bottom: 20px;
  }

  .roundsHeader {
    margin-bottom: 18px;
  }

  .rounds {
    display: grid;
    gap: 20px;
  }
}

.selectedKeySize {
  display: none;
}</style>