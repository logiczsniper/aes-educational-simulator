<script setup lang="ts">
import { aesi } from '~~/utils/aesi';

const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
  }
})

const encryptState = useEncryptState();

const o = ref()
const onStartEncryption = () => {
  const { encrypt, decrypt } = aesi({ key: encryptState.key, config: {} })

  o.value = encrypt(encryptState.plaintext)
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
            />
            <HexArea
              v-model="encryptState.rawKey"
              title-key="simulator.key"
              :max-length="encryptState.keySize"
              :key="encryptState.keySize"
            >
              <template #after-title>
                <v-btn-toggle
                  class="keySizeGroup"
                  density="compact"
                  selected-class="selectedKeySize"
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
            class="startButton"
            prependIcon="mdi-lock"
            variant="flat"
            color="primary"
            @click="onStartEncryption"
          >
            {{ `${t('simulator.start')} ${t('simulator.encryption')}` }}
          </v-btn>
          <section class="inputToStateStep">
            <StepDropdown
              :title="`${t('simulator.plaintext')} ➜ ${t('simulator.state')}`"
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