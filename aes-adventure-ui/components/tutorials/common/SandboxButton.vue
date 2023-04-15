<script setup lang="ts">

const props = defineProps<{
  subtitle?: string;
}>()

const { t } = useI18n();

const sandboxDialogOpen = ref(false)

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
            <slot />
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