<script setup lang="ts">
const { t } = useI18n();

/**
 * TODO: add i18n keys
 * TODO: add quick-fill modal:
 * - all zeroes
 * - all ones
 * - random
 * - NIST test vector
 * TODO: skeleton
 */

const props = defineProps<{
  titleKey: string,
  modelValue: string,
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
  const isFull = currentValue.value.length === maxLength
  const isBackspace = event.key === 'Backspace'
  const hasModifier = event.altKey || event.ctrlKey
  const isNewCharacter = !isBackspace && !hasModifier

  if (!isBinary && isNewCharacter || isFull && isNewCharacter) {
    event.preventDefault()
    return
  }
}

const maxLength = 4 * 4 * 8
const remainingChars = computed(() => maxLength - currentValue.value.length);
const remainingCharsMessage = computed(() => `${remainingChars.value} ${t('binaryInputArea.bitsRemaining')}`)
</script>

<template>
  <div class="binaryTextInput">
    <label :for="props.titleKey">
      <h3>{{ t(props.titleKey) }}</h3>
    </label>
    <textarea
      v-model="currentValueFormatted"
      :name="props.titleKey"
      rows="4"
      cols="4"
      :maxlength="maxLength + 45"
      class="textArea"
      placeholder="00101010   1100000   11011..."
      @keydown="preventInvalidInput"
    >
    </textarea>
    <small class="footer">
      {{ remainingCharsMessage }}
      <span>Fill?</span>
    </small>
  </div>
</template>

<style lang="scss">
.binaryTextInput {
  display: grid;
  width: 426px;

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
  }
}
</style>