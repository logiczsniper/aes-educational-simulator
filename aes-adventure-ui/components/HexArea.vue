<script setup lang="ts">
import { AesiKeySize } from '~~/utils/aesi/aesi.types';

const { t } = useI18n();

const props = defineProps<{
  titleKey: string,
  modelValue: string,
  maxLength: AesiKeySize,
  disabled?: boolean,
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

const preventInvalidInput = (event: KeyboardEvent) => {
  const isHex = "0123456789ABCDEF".includes(event.key.toUpperCase())
  const isBackspace = event.key === 'Backspace'
  const hasModifier = event.altKey || event.ctrlKey
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
const remainingCharsMessage = computed(() => remainingChars.value === 0
  ? t('simulator.hexArea.ready')
  : `${remainingChars.value} ${t('simulator.hexArea.nibblesLeft')}`
)
const maxLengthPadding = computed(() => {
  if (props.maxLength === 128) return 15
  if (props.maxLength === 192) return 23

  return 31
})
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
      @keydown="preventInvalidInput"
    />
    <small class="footer">
      <transition
        appear
        name="opacity"
      >
        <p v-if="!props.disabled">{{ remainingCharsMessage }}</p>
      </transition>
    </small>
  </div>
</template>

<style lang="scss">
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
    background-color: white;
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 8px;

    transition: border-color .18s ease;
    border: 3px solid white;
    outline: none;
    resize: none;
    overflow: hidden;

    &:focus {
      border-color: #745CD0;
    }
  }

  .footer {
    margin-top: 8px;
    justify-self: right;
    display: flex;
    align-items: center;
    min-height: 19px;
  }
}
</style>