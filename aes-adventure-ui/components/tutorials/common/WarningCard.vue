<script setup lang="ts">

const props = defineProps<{
  text: string;
}>()
</script>

<template>
  <div class="warningCard">
    <v-card
      color="warning"
      :elevation="0"
    >
      <div class="warningCardBody">
        <v-icon
          class="alertIcon"
          icon="mdi-alert-circle"
          size="x-small"
        ></v-icon>
        <p><b>Warning: </b>{{ props.text }}</p>
      </div>

    </v-card>
  </div>
</template>

<style scoped lang="scss">
.warningCard {
  :deep(*>) {
    color: red !important;
  }

  .warningCardBody {
    display: grid;
    grid-template-columns: min-content auto;
    gap: 5px;
    padding: 8px;

    .alertIcon {
      margin-top: 2px;
    }
  }
}
</style>