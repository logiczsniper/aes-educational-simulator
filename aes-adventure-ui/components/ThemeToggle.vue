<script setup lang="ts">
const themeName = useThemeName()
</script>

<template>
  <div class="themeToggle">
    <v-icon
      class="themeIcon"
      icon="mdi-weather-sunny"
      size="18"
    ></v-icon>
    <ClientOnly>
      <v-switch
        :model-value="themeName.name === ThemeName.Dark"
        @update:model-value="themeName.flip"
        hide-details
        inset
        aria-label="Theme switch."
      >
      </v-switch>
      <template #fallback>
        <div class="toggleSkeleton skeleton" />
      </template>
    </ClientOnly>
    <v-icon
      class="themeIcon"
      icon="mdi-weather-night"
      size="18"
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

  :deep(.v-switch__thumb) {
    background-color: rgb(var(--v-theme-off-surface));
  }

  :deep(.v-switch__track) {
    background-color: rgb(var(--v-theme-surface));
  }
}

.selectedTheme,
.selectedTheme:focus {
  color: #2C1D66 !important;
  opacity: 1;
}
</style>