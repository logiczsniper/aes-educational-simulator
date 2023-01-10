<template>
  <div>
    Testing 123
  </div>
  <va-badge class="mr-4" text="Paid" color="success" />
  <va-button> Button </va-button>
  <va-chip>default</va-chip>
  <va-icon class="material-icons">book</va-icon>
  <va-option-list
    :options="['Option 1', 'Option 2', 'Option 3']"
    v-model="listValue"
  />
</template>

<script setup lang="ts">
  import { aesi } from '../utils/aesi'

  // import { VaButton } from "vuestic-ui";
  // import { VaOptionList } from "vuestic-ui"
</script>

<style scoped>

</style>