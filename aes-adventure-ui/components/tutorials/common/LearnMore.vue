<script setup lang="ts">

export type LearnMoreLink = {
  label: string;
  href: string;
}

const props = defineProps<{
  links: Array<LearnMoreLink>;
}>()
</script>

<template>
  <section>
    <h5>Learn More</h5>
    <ul class="indentCorrection">
      <li v-for="{ label, href } in props.links">
        <p>
          <a
            class="href"
            :href="href"
            rel="external"
            target="_blank"
          >
            <p v-html="label" />
            <v-icon
              :size="12"
              icon="mdi-open-in-new"
            />
          </a>
        </p>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.indentCorrection {
  margin-left: 20px;

  .href {
    p {
      display: inline;
      margin-right: 4px;
    }

    .v-icon {
      margin-top: -3px;
    }
  }
}
</style>