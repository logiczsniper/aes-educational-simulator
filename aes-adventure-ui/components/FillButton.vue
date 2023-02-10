<script setup lang="ts">
const { t } = useI18n();

const fillDialogOpen = ref(false)

</script>

<template>
  <ClientOnly>
    <div class="fillSelect">
      <v-dialog
        v-model="fillDialogOpen"
        transition="dialog-top-transition"
        max-width="50%"
        content-class="v-dialog-fixed"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="fillButton"
            variant="link"
            color="primary-lighten-1"
          >
            {{ t('simulator.binaryInputArea.fill.button') }}
          </v-btn>
        </template>
        <v-card>
          <v-toolbar
            color="white"
            :title="t('simulator.binaryInputArea.fill.title')"
          >
            <template #prepend>
              <v-icon
                class="tuneIcon"
                icon="mdi-format-color-fill"
              />
            </template>
          </v-toolbar>
          <v-card-text>
            <p>Hello</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="closeButton"
              color="primary"
              variant="flat"
              @click="fillDialogOpen = false"
            >
              {{ t('simulator.binaryInputArea.fill.close') }}
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
.fillSelect {
  :global(.v-toolbar) {
    padding-left: 12px;
    padding-top: 4px;
  }

  .fillButton {
    margin-top: -4px;
    margin-left: -16px;
    margin-right: -16px;
  }
}

.skeleton {
  width: 100px;
  height: 36px;
  border-radius: 4px;
}

.configBody {
  margin-bottom: 20px;
}

.configDefaultsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 14px;
  margin-bottom: 20px;
  padding-right: 12px;
}

.configDefaultLabel {
  display: flex;
  flex-direction: column;
  margin-left: 6px;
  gap: 2px;

  small {
    font-size: 12px;
    line-height: 12px;
  }

  &.highlighted {
    p {
      transition: font-weight 0.1s ease-in;
      font-weight: bold;
      color: #2C1D66;
    }
  }
}

:global(.v-label) {
  opacity: 1;
}

.closeButton {
  margin: 20px;
  margin-left: auto;
}
</style>