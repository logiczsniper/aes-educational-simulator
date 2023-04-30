<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';

const { locale, locales, setLocale, t } = useI18n();
const selectedLocaleCode = ref(locale.value)
const availableLocales = computed(() => locales.value as Array<LocaleObject>)
watch(selectedLocaleCode, newLocaleCode => {
  setLocale(newLocaleCode)
})
</script>

<template>
  <div class="languageSelect">
    <div class="languageSelectInput">
      <v-icon
        class="translateIcon"
        icon="mdi-translate-variant"
        size="18"
      />
      <ClientOnly>
        <v-select
          v-model="selectedLocaleCode"
          class="selectComponent"
          density="compact"
          :items="availableLocales"
          item-title="name"
          item-value="code"
          variant="solo"
          hide-selected
          :menu-props="{
              closeOnContentClick: true,
            }"
        >
          <template #item="{ item: { raw: { code, name, emoji } } }">
            <v-btn
              variant="plain"
              @click="selectedLocaleCode = code"
            >
              <span
                v-if="emoji"
                class="emoji"
              >
                {{ emoji }}
              </span>
              {{ name }}
            </v-btn>
          </template>
          <template #selection="{ item: { raw: { code, name, emoji } } }">
            <v-btn
              class="languageItem"
              variant="plain"
              @click="selectedLocaleCode = code"
            >
              <span
                v-if="emoji"
                class="emoji"
              >
                {{ emoji }}
              </span>
              {{ name }}
            </v-btn>
          </template>
        </v-select>
        <template #fallback>
          <div class="selectSkeleton skeleton" />
        </template>
      </ClientOnly>
    </div>
    <v-btn
      variant="plain"
      size="x-small"
      class="languageHelp"
    >
      <!-- TODO: link to GitLab README explaining how to contribute -->
      <p><small>{{ t('home.settings.badLang') }}</small></p>
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.languageSelect {
  .languageSelectInput {
    display: flex;
    gap: 12px;
    align-items: center;

    .translateIcon {
      opacity: 0.6;
      margin-top: -22px;
    }

    .selectComponent {
      max-width: 50%;
      display: grid;
      align-items: center;

      .languageItem {
        margin-left: -10px;
      }

      :deep(.v-field__append-inner) {
        align-items: center;
        padding: 0;
      }
    }

    .selectSkeleton {
      @extend .selectComponent;
      height: 52px;
      margin-bottom: 22px;
      border-radius: 4px;
      width: 50%;
    }
  }

  .languageHelp {
    margin-top: -36px;
    padding-left: 0;
  }

  .emoji {
    margin-right: 8px;
  }
}
</style>