<script setup lang="ts">
const { t } = useI18n();

// Each tutorial has
// 0. A title which is put before 'Tutorial' when open, e.g. 'Plaintext -> State Tutorial'
// 1. a short summary below title that has a lighter font weight
// 2. a more detailed description below summary. if there is anything tricky, use a WarningCard
// 3. (optional) a SandboxButton 'Play in Sandbox'
// 4. LearnMore links
// 5. Edit on gitlab
</script>

<template>
  <div>
    <EditOnGitLabButton gitlabHref="www.google.com" />
    <TutorialsCommonSandboxButton subtitle="sandboz">
      Hello i am the sandboz
    </TutorialsCommonSandboxButton>
    <TutorialsCommonWarningCard text="Lol vuetify sucks ass" />
    <TutorialsCommonLearnMore :links="[
      {
        label: 'Elements',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a'
      },
      {
        label: 'Vue 3 Cards',
        href: 'https://vuetifyjs.com/en/components/cards/'
      }
    ]" />
    <i18n-t
      keypath="simulator.tutorial.default.description"
      tag="p"
    >
      <template v-slot:tutorialIcon>
        <TutorialIconButton />
      </template>
    </i18n-t>
    <br />
    <p v-html="t('simulator.tutorial.default.tip')" />
  </div>
</template>