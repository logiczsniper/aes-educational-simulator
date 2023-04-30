<script setup lang="ts">
const themeName = useThemeName()
</script>

<template>
  <div class="themeToggle">
    <v-icon
      class="themeIcon"
      icon="mdi-weather-sunny"
    ></v-icon>
    <ClientOnly>
      <v-switch
        :model-value="themeName.name === ThemeName.Dark"
        @update:model-value="themeName.flip"
        hide-details
        inset
        color="primary"
      >
      </v-switch>
      <template #fallback>
        <div class="toggleSkeleton skeleton" />
      </template>
    </ClientOnly>
    <v-icon
      class="themeIcon"
      icon="mdi-weather-night"
    ></v-icon>
  </div>
</template>

<style scoped lang="scss">
.themeToggle {
  display: flex;
  gap: 12px;
  align-items: center;
  width: fit-content;

  .themeIcon {
    opacity: 0.6;
  }

  .toggleSkeleton {
    height: 28px;
    width: 48px;
    margin: 14px 0;
    border-radius: 20px;
  }
}

.selectedTheme,
.selectedTheme:focus {
  color: #2C1D66 !important;
  opacity: 1;
}
</style>