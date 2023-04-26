<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()
const { locale } = useI18n()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.guide')}`,
  htmlAttrs: { lang: locale.value ?? 'en' },
  link: [{ rel: 'canonical', href: `https://aes-adventure.web.app/${locale.value ?? 'en'}/guide` }],
  meta: [
    {
      name: 'description',
      content: t('seo.guide-description')
    },
    { property: 'og:locale', content: locale.value ?? 'en' },
  ]
})
</script>

<template>
  <div class="guidePage scrollbar">
    <header class="guideHeader">
      <h2>{{ t('home.guide.title') }}</h2>
      <NuxtLink :to="localePath('/')">
        <v-btn
          variant="plain"
          icon
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </NuxtLink>
    </header>
    <section class="toc">
      <a
        href="#intro"
        class="tocHeader"
      >
        {{ t('home.guide.intro.header') }}
      </a>
      <a
        href="#features"
        class="tocHeader"
      >
        {{ t('home.guide.features.header') }}
      </a>
      <a
        href="#animations"
        class="tocItem"
      >
        {{ t('home.guide.features.animations.header') }}
      </a>
      <a
        href="#tutorials"
        class="tocItem"
      >
        {{ t('home.guide.features.tutorials.header') }}
      </a>
      <a
        href="#configuration"
        class="tocItem"
      >
        {{ t('home.guide.features.configuration.header') }}
      </a>
      <a
        href="#persistence"
        class="tocItem"
      >
        {{ t('home.guide.features.persistence.header') }}
      </a>
      <a
        href="#duplicate"
        class="tocItem"
      >
        {{ t('home.guide.features.duplicate-buttons.header') }}
      </a>
      <a
        href="#i18n"
        class="tocItem"
      >
        {{ t('home.guide.features.i18n.header') }}
      </a>
      <a
        href="#quick-points"
        class="tocHeader"
      >
        {{ t('home.guide.quick-points.header') }}
      </a>
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
    transition: color .2s;
    color: black;
    width: fit-content;

    &:hover {
      color: #2C1D66;
    }
  }

  .guideHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .toc {

    .tocHeader {
      display: block;
      font-size: 15px;
    }

    .tocItem {
      display: block;
      font-size: 14px;
      margin-left: 20px;
    }

    .tocHeader,
    .tocItem {
      font-weight: bold;
      position: relative;

      &::before {
        content: '#';
        color: gray;
        font-size: 10px;
        position: absolute;
        top: 3.5px;
        left: -10px;
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