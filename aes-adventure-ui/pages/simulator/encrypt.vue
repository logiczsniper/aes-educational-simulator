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
          Sample tutorial keys:
          <TutorialIconButton :tutorial-key="TutorialKey.Test" />
          <TutorialIconButton :tutorial-key="TutorialKey.Default" />
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
    justify-content: space-between;
    height: min-content;
    gap: 20px;

    :deep(.v-selection-control-group--inline) {
      align-self: flex-end;
      gap: 10px;
      font-size: 12px;
    }
  }
}
</style>