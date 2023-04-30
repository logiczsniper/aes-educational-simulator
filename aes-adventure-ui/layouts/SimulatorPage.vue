<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()

const config = useConfig()

const simulatorTabs = useSimulatorTabs()
const tutorial = useTutorial()

const sidebar = useSidebar()
const sidebarElement = ref<HTMLElement>()

onMounted(() => {
  if (sidebarElement.value) sidebar.register(sidebarElement.value)
})
onBeforeUnmount(() => {
  if (sidebarElement.value) sidebar.unregister(sidebarElement.value)
})
watch(sidebarElement, newSidebarElement => {
  const sidebarElementRemoved = !newSidebarElement

  if (sidebarElementRemoved) sidebar.unregister()
  else if (sidebarElement.value) sidebar.register(sidebarElement.value)
})
</script>

<template>
  <div class="simulatorPage">
    <header
      v-if="sidebar.open"
      class="leftColumn"
      ref="sidebarElement"
    >
      <Logo />
      <nav class="navMenu">
        <v-btn
          variant="plain"
          prependIcon="mdi-backburger"
          @click="sidebar.toggle"
        >
          {{ t('simulator.hide') }}
        </v-btn>
        <NuxtLink
          :to="localePath('/')"
          class="quitButton"
        >
          <v-btn
            variant="plain"
            prependIcon="mdi-exit-to-app"
          >
            {{ t('simulator.quit') }}
          </v-btn>
        </NuxtLink>
      </nav>
      <section
        v-if="!config.isStandard"
        class="leftColumnSection"
      >
        <h4>{{ t('simulator.configuration') }}</h4>
        <ClientOnly>
          <transition
            appear
            name="opacity"
          >
            <p>
              {{ t(`configure.modal.defaults.${config.selection}.name`) + ' AES' }}.
              {{ t(`configure.modal.defaults.${config.selection}.description`) }}
            </p>
          </transition>
        </ClientOnly>

      </section>
      <section class="leftColumnSection tutorialContainer scrollbar">
        <h4>{{ t('simulator.tutorial.title') }}</h4>
        <ClientOnly>
          <transition
            appear
            name="opacity"
            mode="out-in"
          >
            <component :is="tutorial.currentTutorialComponent" />
          </transition>
        </ClientOnly>
      </section>
      <v-icon
        class="resizer"
        icon="mdi-arrow-split-vertical"
        size="small"
      />
    </header>
    <div
      v-else
      class="closedLeftColumn"
    >
      <v-btn
        variant="flat"
        @click="sidebar.toggle"
      >
        <template #prepend>
          <v-icon
            class="flipped"
            icon="mdi-backburger"
          />
        </template>
        {{ t('simulator.show') }}
      </v-btn>
    </div>
    <div v-if="!sidebar.open" />
    <section
      class="rightColumn scrollbar"
      :class="{ 'largePadding': !sidebar.open }"
    >
      <nav class="tabBar">
        <NuxtLink
          v-for="tab in Object.values(Tab)"
          :key="tab"
          :to="localePath(simulatorTabs.getTabLink(tab))"
          class="tab"
          :class="{
              'selected': simulatorTabs.currentTab === tab
            }"
          @click="simulatorTabs.goToTab(tab)"
        >
          {{ t(`simulator.${tab}`) }}
        </NuxtLink>
      </nav>
      <slot />
    </section>
  </div>
</template>

<style scoped lang="scss">
.simulatorPage {
  display: grid;
  grid-template-columns: min-content auto;
  height: 100vh;
  overflow-x: hidden;

  .closedLeftColumn {
    position: fixed;
    top: 70px;
    left: 14px;
    z-index: 1;
  }

  .leftColumn {
    display: flex;
    flex-direction: column;
    resize: horizontal;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 200px;
    max-width: 50vw;
    padding: 20px 20px 12px 26px;
    z-index: 2;
    background-color: rgb(var(--v-theme-surface));
    transition: padding-top .16s ease-out;

    position: relative;

    .leftColumnSection {
      margin-top: 20px;
      margin-bottom: 8px;
    }

    .resizer {
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: rgb(var(--v-theme-surface));
      z-index: 20;
    }

    .navMenu {
      margin: 20px 0 0 -12px;

      .quitButton {
        color: unset;
      }
    }

    .tutorialContainer {
      flex-grow: 1;
      position: relative;
      padding-right: 4px;
      margin-right: -4px;

      -webkit-mask-image: linear-gradient(180deg, #000 90%, transparent);
      mask-image: linear-gradient(180deg, #000 90%, transparent);

      padding-bottom: 40px;
    }
  }

  .rightColumn {
    place-items: center;
    background-color: rgb(var(--v-theme-background));
    padding: 20px 4%;
    overflow-y: auto;
    min-width: 600px;

    &.largePadding {
      padding: 20px 10%;
    }

    .tabBar {
      display: flex;
      justify-content: space-around;
      gap: 24px;
      background-color: rgb(var(--v-theme-surface));
      border-radius: 8px;
      padding: 6px;
      margin-bottom: 30px;
      transition: all .5s linear;
      color: #2C1D66;
      font-weight: 500;
      position: relative;

      .tab {
        cursor: pointer;
        width: 100%;
        padding: 10px 0;
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
        color: unset;

        &.selected {
          transition: all .5s linear;
          color: white !important;
          background-color: #745CD0;
        }
      }
    }
  }
}
</style>