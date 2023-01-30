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
  <ClientOnly>
    <div class="languageSelect">
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
        <template #prepend>
          <v-icon
            class="translateIcon"
            icon="mdi-translate-variant"
            size="18"
          />
        </template>
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
      <v-btn
        variant="plain"
        size="x-small"
        class="languageHelp"
      >
        <!-- TODO: link to GitLab README explaining how to contribute -->
        <p><small>{{ t('home.settings.badLang') }}</small></p>
      </v-btn>
    </div>
    <template #fallback>
      <div class="languageSelect">
        <div class="test">
          <v-icon
            class="translateIcon"
            icon="mdi-translate-variant"
            size="18"
          />
          <div class="selectComponent skeleton">
          </div>
        </div>
        <v-btn
          variant="plain"
          size="x-small"
          class="languageHelp"
          disabled
        >
          <!-- TODO: link to GitLab README explaining how to contribute -->
          <p><small>{{ t('home.settings.badLang') }}</small></p>
        </v-btn>
      </div>
    </template>
  </ClientOnly>
</template>

<!-- TODO: break up this component to have a skeleton, general code cleanup NEEDED -->

<style scoped lang="scss">
.test {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
}

.languageSelect {
  .selectComponent {
    max-width: 50%;

    .translateIcon {
      margin-top: 8px
    }

    .languageItem {
      margin-left: -10px;
    }

    .v-field {
      align-items: baseline;
    }

    :deep(.v-field__append-inner) {
      align-items: center;
      padding: 0;
    }



    &.skeleton {
      width: calc(50% - 18px);
      margin-left: 18px;
      height: 52px;
      border-radius: 4px;
    }
  }

  .languageHelp {
    margin-top: -36px;
    padding-left: 0;
  }
}

.emoji {
  margin-right: 8px;
}
</style>