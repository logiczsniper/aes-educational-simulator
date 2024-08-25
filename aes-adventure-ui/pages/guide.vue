<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.guide')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.guide-description')
    }
  ]
})
</script>

<template>
  <div class="guidePage scrollbar">
    <header class="guideHeader">
      <h2>{{ t('home.guide.title') }}</h2>
      <NuxtLink
        :to="localePath('/')"
        aria-label="Close guide link."
      >
        <v-btn
          variant="plain"
          icon
          aria-label="Close guide button."
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </NuxtLink>
    </header>
    <section class="toc">
      <v-btn
        href="#intro"
        class="tocButton"
        variant="flat"
      >
        {{ t('home.guide.intro.header') }}
      </v-btn>
      <v-btn
        href="#features"
        class="tocButton"
        variant="flat"
      >
        {{ t('home.guide.features.header') }}
      </v-btn>
      <v-btn
        href="#animations"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.animations.header') }}
      </v-btn>
      <v-btn
        href="#tutorials"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.tutorials.header') }}
      </v-btn>
      <v-btn
        href="#configuration"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.configuration.header') }}
      </v-btn>
      <v-btn
        href="#persistence"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.persistence.header') }}
      </v-btn>
      <v-btn
        href="#duplicate"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.duplicate-buttons.header') }}
      </v-btn>
      <v-btn
        href="#i18n"
        class="tocButton subButton"
        variant="flat"
      >
        {{ t('home.guide.features.i18n.header') }}
      </v-btn>
      <v-btn
        href="#quick-points"
        class="tocButton"
        variant="flat"
      >
        {{ t('home.guide.quick-points.header') }}
      </v-btn>
    </section>
    <section class="guideBody">
      <section
        id="intro"
        class="intro"
      >
        <h3>{{ t('home.guide.intro.header') }}</h3>
        <p v-html="t('home.guide.intro.body')" />
      </section>
      <section
        id="features"
        class="features"
      >
        <h3>{{ t('home.guide.features.header') }}</h3>
        <section
          id="animations"
          class="feature"
        >
          <h4>{{ t('home.guide.features.animations.header') }}</h4>
          <p v-html="t('home.guide.features.animations.body')" />
        </section>
        <section
          id="tutorials"
          class="feature"
        >
          <h4>{{ t('home.guide.features.tutorials.header') }}</h4>
          <p v-html="t('home.guide.features.tutorials.body')" />
        </section>
        <section
          id="configuration"
          class="feature"
        >
          <h4>{{ t('home.guide.features.configuration.header') }}</h4>
          <p v-html="t('home.guide.features.configuration.body')" />
        </section>
        <section
          id="persistence"
          class="feature"
        >
          <h4>{{ t('home.guide.features.persistence.header') }}</h4>
          <p v-html="t('home.guide.features.persistence.body')" />
        </section>
        <section
          id="duplicate"
          class="feature"
        >
          <h4>{{ t('home.guide.features.duplicate-buttons.header') }}</h4>
          <p v-html="t('home.guide.features.duplicate-buttons.body')" />
        </section>
        <section
          id="i18n"
          class="feature"
        >
          <h4>{{ t('home.guide.features.i18n.header') }}</h4>
          <p v-html="t('home.guide.features.i18n.body')" />
        </section>
      </section>
      <section
        id="quick-points"
        class="quick-points"
      >
        <h3>{{ t('home.guide.quick-points.header') }}</h3>
        <ul>
          <li>
            <p v-html="t('home.guide.quick-points.cant-input')" />
          </li>
          <li>
            <p v-html="t('home.guide.quick-points.cant-start')" />
          </li>
          <li>
            <p v-html="t('home.guide.quick-points.nibble')" />
          </li>
          <li>
            <p v-html="t('home.guide.quick-points.small')" />
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
.guidePage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;

  -webkit-mask-image: linear-gradient(180deg, #000 90%, transparent);
  mask-image: linear-gradient(180deg, #000 90%, transparent);
  padding-bottom: 200px;

  a {
    color: rgb(var(--v-theme-opposite));
  }

  .guideHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .toc {
    display: flex;
    flex-direction: column;
    gap: 4px;


    .tocButton {
      transition: color .2s;
      position: relative;
      width: fit-content;

      &.subButton {
        margin-left: 20px;
      }

      &::before {
        content: '#';
        color: gray;
        font-size: 10px;
        position: absolute;
        left: -14px;
      }

      &:hover {
        color: #2C1D66;
      }
    }
  }

  .guideBody {
    display: flex;
    flex-direction: column;
    gap: 44px;
    margin-top: 34px;

    .features {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>