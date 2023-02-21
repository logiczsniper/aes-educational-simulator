<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
  }
})

const encryptState = useEncryptState();
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
            <BinaryInputArea
              v-model="encryptState.plaintext"
              title-key="simulator.plaintext"
              :max-length="128"
            />
            <BinaryInputArea
              v-model="encryptState.key"
              title-key="simulator.key"
              :max-length="encryptState.keySize"
              :key="encryptState.keySize"
            >
              <template #after-title>
                <v-radio-group
                  inline
                  density="compact"
                  hide-details
                  :model-value="encryptState.keySize"
                  @update:model-value="encryptState.setKeySize"
                >
                  <v-radio
                    label="128"
                    value="128"
                  />
                  <v-radio
                    label="192"
                    value="192"
                  />
                  <v-radio
                    label="256"
                    value="256"
                  />
                </v-radio-group>
              </template>
            </BinaryInputArea>
          </section>
          <v-btn
            class="startButton"
            prependIcon="mdi-lock"
            variant="flat"
            color="primary"
          >
            {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
          </v-btn>
          <section class="inputToStateStep">
            <StepDropdown
              :title="`${t('simulator.plaintext')} ➙ ${t('simulator.state')}`"
              :tutorial-key="TutorialKey.Test"
              background-color="#f9f9f9"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationTestA :timeline="timeline">
                  </AnimationTestA>
                </template>
              </AnimationAesAnimationFrame>
            </StepDropdown>
          </section>
          <section class="initialStep">
            <StepDropdown
              :title="`${t('simulator.add-key')}`"
              :tutorial-key="TutorialKey.Test"
            >
              <AnimationAesAnimationFrame>
                <template #animation="{ timeline }">
                  <AnimationTestA :timeline="timeline">
                  </AnimationTestA>
                </template>
              </AnimationAesAnimationFrame>
            </StepDropdown>
          </section>
          <section class="roundsHeader">
            [Round count, statistics and control timeline here]
          </section>
          <section class="rounds">
            <StepDropdown
              :title="`${t('simulator.substitute-bytes')}`"
              :tutorial-key="TutorialKey.Default"
            >
            </StepDropdown>

            <StepDropdown
              :title="`${t('simulator.shift-rows')}`"
              :tutorial-key="TutorialKey.Test"
            >
            </StepDropdown>

            <StepDropdown
              :title="`${t('simulator.mix-columns')}`"
              :tutorial-key="TutorialKey.Test"
            >
            </StepDropdown>

            <StepDropdown
              :title="`${t('simulator.add-round-key')}`"
              :tutorial-key="TutorialKey.Test"
            >
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    height: min-content;
    gap: 20px;

    :deep(.v-selection-control-group--inline) {
      align-self: flex-end;
      gap: 10px;
      font-size: 12px;
    }
  }

  .startButton {
    display: flex;
    margin: 18px 0 12px auto;
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
</style>