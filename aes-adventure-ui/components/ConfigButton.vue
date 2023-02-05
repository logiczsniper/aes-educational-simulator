<script setup lang="ts">
import { useConfig } from '~~/composables/useConfig';
import { AesiDefaultConfig } from '~~/utils/aesi/aesi.types';

const { t } = useI18n();

const configureDialogOpen = ref(false)

const defaultConfigurations = Object.values(AesiDefaultConfig).map(configKey => ({
  "name": t(`configure.modal.defaults.${configKey}.name`) + ' AES',
  "description": t(`configure.modal.defaults.${configKey}.description`),
  "key": configKey,
}))
const config = useConfig()
</script>

<template>
  <ClientOnly>
    <div class="configSelect">
      <v-dialog
        v-model="configureDialogOpen"
        transition="dialog-top-transition"
        max-width="50%"
        content-class="v-dialog-fixed"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="configureButton"
            variant="outlined"
            color="primary-lighten-1"
          >
            {{ t('configure.button') }}
          </v-btn>
        </template>
        <v-card>
          <v-toolbar
            color="white"
            title="Configure"
          >
            <template #prepend>
              <v-icon
                class="tuneIcon"
                icon="mdi-tune-vertical"
              />
            </template>
          </v-toolbar>
          <v-card-text>
            <p
              class="configBody"
              v-html="t('configure.modal.body')"
            />
            <div class="configDefaultsGrid">
              <v-checkbox
                v-for="defaultConfig in defaultConfigurations"
                v-model="config.selectedDefaultConfigs"
                color="primary-darken-1"
                :value="defaultConfig.key"
                :disabled="defaultConfig.key === AesiDefaultConfig.Standard"
                hide-details
                density="compact"
              >
                <template #label>
                  <div
                    class="configDefaultLabel"
                    :class="{ 'highlighted': config.walkThroughConfig === defaultConfig.key }"
                  >
                    <p>{{ defaultConfig.name }}</p>
                    <small>{{ defaultConfig.description }}</small>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="closeButton"
              color="primary"
              variant="flat"
              @click="configureDialogOpen = false"
            >
              Close
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
.configSelect {
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