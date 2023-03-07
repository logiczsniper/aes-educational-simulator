<script setup lang="ts">
import { AesiRound, AesiRoundStepType } from '~~/utils/aesi/aesi.types';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
  }
})

const encryptState = useEncryptState();

const getStep = (round: AesiRound, stepType: AesiRoundStepType) => round.steps.find(({ type }) => type === stepType) 
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
            prependIcon="mdi-lock"
            variant="flat"
            color="primary"
            @click="encryptState.calculateEncryptOutput"
          >
            {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
          </v-btn>
          <section
            v-if="encryptState.output && encryptState.stage !== EncryptStage.Input"
            class="inputToStateStep"
          >
            <StepDropdown
              :model-value="encryptState.stage === EncryptStage.ToState"
              :title="`${t('simulator.plaintext')} ➜ ${t('simulator.state')}`"
              :tutorial-key="TutorialKey.Test"
              background-color="#f9f9f9"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationAesPlaintextToState
                    :timeline="timeline"
                    :input="encryptState.output"
                    :output="encryptState.output"
                  >
                  </AnimationAesPlaintextToState>
                </template>
              </AnimationAesAnimationFrame>
              <template #footer>
                <v-btn
                  variant="flat"
                  prepend-icon="mdi-redo"
                  color="primary"
                  @click="encryptState.stage = EncryptStage.SymmetryKeyAddition"
                >{{ t('simulator.next-step') }}</v-btn>
              </template>
            </StepDropdown>
          </section>
          <section
            v-if="encryptState.output && encryptState.stage !== EncryptStage.Input"
            class="initialStep"
          >
            <StepDropdown
              :model-value="encryptState.stage === EncryptStage.SymmetryKeyAddition"
              :title="`${t('simulator.add-key')}`"
              :tutorial-key="TutorialKey.Test"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationAesAddKey
                    :timeline="timeline"
                    :input="encryptState.output"
                    :output="encryptState.output"
                  >
                  </AnimationAesAddKey>
                </template>
              </AnimationAesAnimationFrame>
              <template #footer>
                <v-btn
                  variant="flat"
                  prepend-icon="mdi-selection-ellipse-arrow-inside"
                  color="primary"
                  @click="encryptState.stage = EncryptStage.Rounds"
                >{{ t('simulator.start-rounds') }}</v-btn>
              </template>
            </StepDropdown>
          </section>
          <section
            v-if="encryptState.output && encryptState.stage !== EncryptStage.Input"
            class="roundsHeader"
          >
            [Round count, statistics and control timeline here]
            {{ 'Round: ' + encryptState.roundIndex }}
            {{ 'Step: ' + encryptState.stepIndex }}
          </section>
          <section
            v-if="encryptState.output && encryptState.stage === EncryptStage.Rounds"
            class="rounds"
          >
            <StepDropdown
              v-if="encryptState.output.rounds"
              :model-value="encryptState.step?.type === AesiRoundStepType.SubBytes"
              :title="`${t('simulator.substitute-bytes')}`"
              :tutorial-key="TutorialKey.Default"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationAesSubstituteBytes
                    :timeline="timeline"
                    :input="encryptState.output"
                    :output="encryptState.output"
                  >
                  </AnimationAesSubstituteBytes>
                </template>
              </AnimationAesAnimationFrame>
              <template #footer>
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
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationAesShiftRows
                    :timeline="timeline"
                    :input="encryptState.output"
                    :output="encryptState.output"
                  >
                  </AnimationAesShiftRows>
                </template>
              </AnimationAesAnimationFrame>
              <template #footer>
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
              :tutorial-key="TutorialKey.Test"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationAesMixColumns
                    :timeline="timeline"
                    :input="encryptState.output"
                    :output="encryptState.output"
                  >
                  </AnimationAesMixColumns>
                </template>
              </AnimationAesAnimationFrame>
              <template #footer>
                <v-btn
                  variant="flat"
                  prepend-icon="mdi-redo"
                  color="primary"
                  @click="encryptState.nextStep"
                >{{ t('simulator.next-step') }}</v-btn>
              </template>
            </StepDropdown>

            <StepDropdown
              :model-value="encryptState.step?.type === AesiRoundStepType.AddRoundKey"
              :title="`${t('simulator.add-round-key')}`"
              :tutorial-key="TutorialKey.Test"
            >
              <template #footer>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-arrow-u-down-right"
                  color="primary"
                  @click="encryptState.skipToLastRound"
                >{{ t('simulator.skip') }}</v-btn>
                <v-btn
                  variant="flat"
                  prepend-icon="mdi-rotate-right"
                  color="primary"
                  @click="encryptState.nextRound"
                >{{ t('simulator.next-round') }}</v-btn>
              </template>
            </StepDropdown>
          </section>
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

  .startButton {
    display: flex;
    margin: 36px 0 12px auto;
  }

  .inputToStateStep {
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
    padding-bottom: 100px;
  }
}

.selectedKeySize {
  display: none;
}
</style>