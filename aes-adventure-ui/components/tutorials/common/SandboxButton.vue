<script setup lang="ts">

const props = defineProps<{
  subtitle?: string;
}>()

const { t } = useI18n();

const sandboxDialogOpen = ref(false)

const sandboxInput = ref('')
const sandboxInputParsed = computed(() => hexToUint8Array(sandboxInput.value.padEnd(32, '0')))

const title = computed(() => t('simulator.tutorial.sandbox.title') + (props.subtitle ? ` - ${props.subtitle}` : ''))
</script>

<template>
  <ClientOnly>
    <div class="sandbox">
      <v-dialog
        v-model="sandboxDialogOpen"
        transition="dialog-top-transition"
        max-width="50%"
        content-class="v-dialog-fixed"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="sandboxButton"
            color="primary"
            size="small"
            variant="flat"
            prepend-icon="mdi-test-tube"
          >
            {{ t('simulator.tutorial.sandbox.button') }}
          </v-btn>
        </template>
        <v-card>
          <v-toolbar
            color="white"
            :title="title"
          >
            <template #prepend>
              <v-icon
                class="tubeIcon"
                icon="mdi-test-tube"
              />
            </template>
          </v-toolbar>
          <v-card-text>
            <div class="sandboxInputContainer">
              <div class="sandboxInput">
                <HexArea
                  v-model="sandboxInput"
                  title-key="simulator.input"
                  :max-length="128"
                  :text-area-style="{ 'border-color': '#745CD0', 'margin-bottom': '18px' }"
                  hide-footer
                />
              </div>
            </div>
            <div :key="sandboxInput">
              <slot
                name="animation"
                :input="sandboxInputParsed"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="closeButton"
              color="primary"
              variant="flat"
              @click="sandboxDialogOpen = false"
            >
              {{ t('simulator.tutorial.sandbox.close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <template #fallback>
      <div class="skeleton" />
    </template>
  </ClientOnly>
</template>

<style scoped lang="scss">
.sandbox {
  :global(.v-toolbar) {
    padding-left: 12px;
    padding-top: 4px;
  }
}

.sandboxInputContainer {
  display: grid;

  .sandboxInput {
    justify-self: center;
  }

}

.skeleton {
  width: 100px;
  height: 36px;
  border-radius: 4px;
}

.closeButton {
  margin: 20px;
  margin-left: auto;
}
</style>