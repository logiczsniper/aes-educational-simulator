<script setup lang="ts">
enum FillOption {
  Zeroes = "Zeroes",
  Ones = "Ones",
  Random = "Random",
}

const { t } = useI18n();

const fillDialogOpen = ref(false)

const fillOptionIconMap = {
  [FillOption.Zeroes]: 'mdi-numeric-0-box',
  [FillOption.Ones]: 'mdi-numeric-1-box',
  [FillOption.Random]: 'mdi-dice-multiple'
}
const getIcon = (fillOption: FillOption) => fillOptionIconMap[fillOption]

const selectedFillOption = ref<FillOption | null>(null);
const fillOptionItems = Object.keys(FillOption).map(fillOptionKey => ({
  name: t(`simulator.binaryInputArea.fill.options.${fillOptionKey}`),
  value: fillOptionKey
}))

const props = defineProps<{
  onFillZeroes: (..._: any[]) => any,
  onFillOnes: (..._: any[]) => any,
  onFillRandom: (..._: any[]) => any
}>()

const onFillClick = (): void => {
  fillDialogOpen.value = false;
  switch (selectedFillOption.value) {
    case FillOption.Ones:
      props.onFillOnes()
      break
    case FillOption.Zeroes:
      props.onFillZeroes()
      break
    case FillOption.Random:
      props.onFillRandom()
      break
  }
}
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
              <v-icon icon="mdi-format-color-fill" />
            </template>
          </v-toolbar>
          <v-card-text>
            <p> {{ t('simulator.binaryInputArea.fill.description') }}</p>
            <v-select
              v-model="selectedFillOption"
              :items="fillOptionItems"
              item-title="name"
              item-value="value"
              class="selectComponent"
              density="compact"
              variant="solo"
              placeholder="Select fill option..."
              hide-selected
              :menu-props="{
                closeOnContentClick: true,
              }"
            >
              <template #item="{ item: { title, value } }">
                <v-btn
                  variant="plain"
                  class="selectItem"
                  @click="selectedFillOption = value"
                >
                  <v-icon
                    :icon="getIcon(value)"
                    class="itemIcon"
                  />
                  {{ title }}
                </v-btn>
              </template>
              <template #selection="{ item: { title, value } }">
                <v-btn
                  variant="plain"
                  class="selectItem selected"
                  @click="selectedFillOption = value"
                >
                  <v-icon
                    :icon="getIcon(value)"
                    class="itemIcon"
                  />
                  {{ title }}
                </v-btn>
              </template>
            </v-select>
          </v-card-text>
          <v-card-actions class="buttonGroup">
            <v-btn
              color="primary"
              variant="flat"
              :disabled="selectedFillOption === null"
              @click="onFillClick"
            >
              {{ t('simulator.binaryInputArea.fill.title') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              @click="fillDialogOpen = false"
            >
              {{ t('simulator.binaryInputArea.fill.close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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

.selectComponent {
  margin-top: 20px;
  max-width: 70%;
  height: 52px;
  margin-bottom: -20px;
  display: grid;
  align-items: center;

  :deep(.v-field__append-inner) {
    align-items: center;
    padding: 0;
  }
}

.selectItem {
  display: block;

  &.selected {
    margin-left: -10px;
  }
}

.buttonGroup {
  margin: 20px;
  margin-left: auto;
}

.itemIcon {
  margin-right: 8px;
}
</style>