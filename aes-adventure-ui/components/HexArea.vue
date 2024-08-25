<script setup lang="ts">
import { StyleValue } from 'vue';
import { Tab } from '~~/composables/useSimulatorTabs';
import { AesiKeySize } from '~~/utils/aesi/aesi.types';

const { t } = useI18n();
const localePath = useLocalePath()
const simulatorTabs = useSimulatorTabs()

const props = defineProps<{
  titleKey?: string,
  modelValue: string,
  maxLength: AesiKeySize,
  disabled?: boolean,
  disabledText?: string,
  textAreaStyle?: StyleValue,
  hideFooter?: boolean,
  duplicate?: {
    snackbarMessage: string,
    tooltipMessage: string,
    onDuplicate: (value: string) => void,
    goTo?: Tab,
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const formatInput = (input: string) => {
  const spacer = ' '
  const formattedValue = input.match(/.{1,2}/g)?.join(spacer) ?? ''

  return formattedValue
}

const currentValueFormatted = ref(formatInput(props.modelValue))
watch(currentValueFormatted, () => currentValueFormatted.value = formatInput(currentValue.value))

const currentValue = computed(() => currentValueFormatted.value.replaceAll(' ', ''))
watch(currentValue, newValue => emit('update:modelValue', newValue))

const HEX_VALUES = "0123456789ABCDEF"
const preventInvalidInput = (event: KeyboardEvent) => {
  const isHex = "0123456789ABCDEF".includes(event.key.toUpperCase())
  const isBackspace = event.key === 'Backspace'
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey
  const isNewCharacter = !isBackspace && !hasModifier
  const isPaste = (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === "V"

  if (isPaste) {
    // TODO: sanitize paste
  }

  if (!isHex && isNewCharacter) {
    event.preventDefault()
    return
  }
}

const maxLengthHex = computed(() => props.maxLength / 4)
const remainingChars = computed(() => maxLengthHex.value - currentValue.value.length);
const isFull = computed(() => remainingChars.value === 0)
const remainingCharsMessage = computed(() => isFull.value
  ? t('simulator.hexArea.ready')
  : `${remainingChars.value} ${t('simulator.hexArea.nibblesLeft')}`
)
const maxLengthPadding = computed(() => {
  if (props.maxLength === 128) return 15
  if (props.maxLength === 192) return 23

  return 31
})

const snackbarOpen = ref(false)
const snackbarMessage = ref('')
const snackbarGoTo = ref<Tab>()

const openSnackbar = (message: string, goTo?: Tab) => {
  snackbarMessage.value = message
  snackbarGoTo.value = goTo
  snackbarOpen.value = true
}

const onCopyClick = () => {
  openSnackbar(t('simulator.hexArea.copied'))
  navigator.clipboard.writeText(currentValue.value)
}

const onDuplicateClick = () => {
  if (!props.duplicate) return

  openSnackbar(props.duplicate.snackbarMessage, props.duplicate.goTo)
  props.duplicate.onDuplicate(currentValue.value)
}

const onFillClick = () => {
  currentValueFormatted.value = formatInput(
    Array(maxLengthHex.value).fill(null).map(_ => HEX_VALUES.at(Math.round(Math.random() * (HEX_VALUES.length - 1)))).join('').toLowerCase()
  )
}
</script>

<template>
  <div
    class="hexArea"
    :class="{
      'disabled': props.disabled,
      'small': props.maxLength === 128,
      'medium': props.maxLength === 192,
      'large': props.maxLength === 256
    }"
  >
    <label
      v-if="props.titleKey"
      :for="props.titleKey"
      class="title"
    >
      <h3>{{ t(props.titleKey) }}</h3>
      <slot name="after-title" />
    </label>
    <textarea
      v-model="currentValueFormatted"
      :name="props.titleKey"
      rows="4"
      cols="4"
      spellcheck="false"
      :maxlength="maxLengthHex + maxLengthPadding"
      class="textArea code"
      placeholder="2f 1c.."
      :disabled="props.disabled"
      :title="props.disabled ? props.disabledText : ''"
      :style="props.textAreaStyle"
      @keydown="preventInvalidInput"
    />
    <small
      v-if="!props.hideFooter"
      class="footer"
    >
      <div />
      <transition
        appear
        name="opacity"
        :duration="{
          'leave': 240
        }"
      >
        <div
          v-if="isFull"
          class="inlineButton"
        >
          <v-tooltip
            location="bottom"
            :open-delay="250"
            aria-label="Copy to clipboard tooltip."
          >
            <p class="tooltip">{{ t('simulator.hexArea.copy-tooltip') }}</p>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                density="compact"
                variant="plain"
                @click="onCopyClick"
                aria-label="Copy to clipboard button."
              >
                <v-icon size="18">mdi-content-copy</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip
            v-if="duplicate"
            location="bottom"
            :open-delay="250"
            aria-label="Copy to other input tooltip."
          >
            <p class="tooltip">{{ duplicate.tooltipMessage }}</p>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                density="compact"
                variant="plain"
                @click="onDuplicateClick"
                aria-label="Copy to other input button."
              >
                <v-icon size="18">mdi-content-duplicate</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
        <div
          v-else
          class="inlineButton"
        >
          <v-tooltip
            location="bottom"
            :open-delay="250"
            aria-label="Fill with random input."
          >
            <p class="tooltip">{{ t('simulator.hexArea.fill-tooltip') }}</p>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                density="compact"
                variant="plain"
                @click="onFillClick"
                aria-label="Fill with random input."
              >
                <v-icon size="23">mdi-dice-multiple-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </transition>
      <transition
        appear
        name="opacity"
      >
        <p v-if="!props.disabled">{{ remainingCharsMessage }}</p>
      </transition>
    </small>
    <v-snackbar
      v-model="snackbarOpen"
      color="#2C1D66"
      min-width="fit-content"
    >
      <div class="snackbar">
        <v-icon
          icon="mdi-check-bold"
          :size="15"
        />
        <p>{{ snackbarMessage }}</p>
        <NuxtLink
          v-if="snackbarGoTo"
          :to="localePath(simulatorTabs.getTabLink(snackbarGoTo))"
          @click="simulatorTabs.goToTab(snackbarGoTo)"
        >
          <v-btn
            variant="flat"
            color="white"
            size="small"
            class="goButtonWrapper"
          >
            <div class="goButton">
              <v-icon
                :size="18"
                icon="mdi-open-in-app"
              />
              <p>{{ t('simulator.hexArea.go') }}</p>
            </div>
          </v-btn>
        </NuxtLink>
      </div>
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.hexArea {
  display: grid;

  &.disabled {
    &>textarea {
      cursor: not-allowed;
    }

  }

  &.small {
    width: 136px;
  }

  &.medium {
    width: 196px;
  }

  &.large {
    width: 254px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .textArea {
    background-color: rgb(var(--v-theme-surface));
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 8px;

    transition: border-color .18s ease;
    border: 3px solid rgb(var(--v-theme-surface));
    outline: none;
    resize: none;
    overflow: hidden;

    &:focus {
      border-color: #745CD0;
    }
  }

  .footer {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 28px;
    position: relative;

    .inlineButton {
      margin-left: -4px;
      position: absolute;
    }
  }
}

.tooltip {
  color: white;
}

.snackbar {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;

  .goButtonWrapper {
    margin-left: 8px;

    .goButton {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
}
</style>