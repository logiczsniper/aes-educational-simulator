<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  titleKey: string,
  modelValue: string,
  maxLength: 128 | 192 | 256
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const formatInput = (input: string) => {
  const spacer = '   '
  const formattedValue = input.match(/.{1,8}/g)?.join(spacer) ?? ''

  return formattedValue
}

const currentValueFormatted = ref(formatInput(props.modelValue))
watch(currentValueFormatted, () => currentValueFormatted.value = formatInput(currentValue.value))

const currentValue = computed(() => currentValueFormatted.value.replaceAll(' ', ''))
watch(currentValue, newValue => emit('update:modelValue', newValue))

const preventInvalidInput = (event: KeyboardEvent) => {
  const isBinary = event.key === '0' || event.key === '1'
  const isFull = currentValue.value.length === maxLength.value
  const isBackspace = event.key === 'Backspace'
  const hasModifier = event.altKey || event.ctrlKey
  const isNewCharacter = !isBackspace && !hasModifier

  if (!isBinary && isNewCharacter || isFull && isNewCharacter) {
    event.preventDefault()
    return
  }
}

const maxLength = computed(() => Number(props.maxLength))
const remainingChars = computed(() => maxLength.value - currentValue.value.length);
const remainingCharsMessage = computed(() => `${remainingChars.value} ${t('simulator.binaryInputArea.bitsRemaining')}`)
const maxLengthPadding = computed(() => {
  if (maxLength.value === 128) return 45
  if (maxLength.value === 192) return 69

  return 93
})

const onFillZeroes = () => currentValueFormatted.value = formatInput('0'.repeat(maxLength.value))
const onFillOnes = () => currentValueFormatted.value = formatInput('1'.repeat(maxLength.value))
const onFillRandom = () => currentValueFormatted.value = formatInput(
  Array(maxLength.value).fill(null).map(_ => Number(Math.random() > 0.5)).join('')
)
</script>

<template>
  <div
    class="binaryTextInput"
    :class="{
      'small': maxLength === 128,
      'medium': maxLength === 192,
      'large': maxLength === 256
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
      :maxlength="maxLength + maxLengthPadding"
      class="textArea"
      placeholder="00101010   1100000   11011..."
      @keydown="preventInvalidInput"
    >
                  </textarea>
    <small class="footer">
      {{ remainingCharsMessage }}
      <FillButton
        :on-fill-ones="onFillOnes"
        :on-fill-zeroes="onFillZeroes"
        :on-fill-random="onFillRandom"
      />
    </small>
  </div>
</template>

<style lang="scss">
.binaryTextInput {
  display: grid;

  &.small {
    width: 426px;
  }

  &.medium {
    width: 640px;
  }

  &.large {
    width: 854px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 16px;
  }

  .textArea {
    font-family: 'Courier New';
    font-weight: bold;
    background-color: white;
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 8px;

    transition: border-color .18s ease;
    border: 3px solid white;
    outline: none;
    resize: none;

    &:focus {
      border-color: #745CD0;
    }
  }

  .footer {
    margin-top: 8px;
    justify-self: right;
    display: flex;
    align-items: center;
  }
}
</style>