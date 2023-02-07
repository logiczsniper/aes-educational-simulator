<script setup lang="ts">
const { t } = useI18n();

const config = useConfig()
const sidebarOpen = ref(true)
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value

enum Tab {
  Encrypt = "encrypt",
  Decrypt = "decrypt",
  KeyExpansion = "key-expansion",
}
const route = useRouteBaseName()
const currentTab = ref(route === 'index' ? Tab.Encrypt : route?.substring(10))
const getTabLink = (tab: Tab) => `/simulator/${tab}`
const leftColumnStyle = ref('padding-top: 20px;')
const sidebar = ref<HTMLElement>()
if (process.client) {
  const adaptSidebar = () => {
    const sidebarWidth = sidebar.value?.clientWidth ?? 0
    const windowHeight = window.visualViewport?.height ?? 0
    leftColumnStyle.value = `padding-top: ${window.scrollY + 20}px; height: ${window.scrollY + windowHeight}px; width: ${sidebarWidth}px`
  }
  window.onscroll = adaptSidebar
  window.onresize = adaptSidebar
}
</script>

<template>
  <div class="simulatorPage">
    <header
      v-if="sidebarOpen"
      ref="sidebar"
      class="leftColumn"
      :style="leftColumnStyle"
    >
      <Logo />
      <nav class="navMenu">
        <v-btn
          variant="plain"
          prependIcon="mdi-backburger"
          @click="toggleSidebar"
        >
          {{ t('simulator.hide') }}
        </v-btn>
        <NuxtLink
          to="/"
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
      <section>
        <h4 v-if="config.selectedDefaultConfigs.length > 1">{{ t('simulator.configurations') }}</h4>
        <ClientOnly>
          <div
            v-if="config.selectedDefaultConfigs.length > 1"
            v-for="selectedDefaultConfig in config.selectedDefaultConfigs"
            class="configDefaultLabel"
            :class="{ 'highlighted': config.walkThroughConfig === selectedDefaultConfig }"
          >
            <p>{{ t(`configure.modal.defaults.${selectedDefaultConfig}.name`) + ' AES' }}
              <v-tooltip activator="parent">
                {{ t(`configure.modal.defaults.${ selectedDefaultConfig }.description`) }}
              </v-tooltip>
            </p>
          </div>
          <template #fallback>
            <div>
              <h4>{{ t('simulator.configurations') }}</h4>
              <div class="configSkeleton skeleton" />
            </div>
          </template>
        </ClientOnly>
      </section>
      <section class="tutorialContainer">
        <h4>{{ t('simulator.tutorial') }}</h4>
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
        @click="toggleSidebar"
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
    <div v-if="!sidebarOpen" />
    <section
      class="rightColumn"
      :class="{ 'largePadding': !sidebarOpen }"
    >
      <nav class="tabBar">
        <NuxtLink
          v-for="tab in Object.values(Tab)"
          :key="tab"
          :to="getTabLink(tab)"
          class="tab"
          :class="{
            'selected': currentTab === tab
          }"
          @click="currentTab = tab"
        >
          {{ t(`simulator.${ tab }`) }}
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

  .configSkeleton {
    height: 20px;
    border-radius: 4px;
    width: 120px;
    margin-top: 14px;
  }

  .closedLeftColumn {
    position: fixed;
    top: 70px;
    left: 14px;
    z-index: 1;
  }

  .leftColumn {
    resize: horizontal;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 200px;
    max-width: 50vw;
    padding: 20px 20px 12px 26px;
    z-index: 2;
    background-color: white;
    transition: padding-top .16s ease-out;

    position: relative;

    .resizer {
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: white;
      z-index: 20;
    }

    .navMenu {
      margin: 20px 0 30px -12px;

      .quitButton {
        color: unset;
      }
    }

    .configDefaultLabel {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 4px;
      overflow-wrap: break-word;

      small {
        font-size: 12px;
        line-height: 12px;
      }

      &:first-of-type {
        margin-top: 12px;
      }

      p {
        width: min-content;
        white-space: nowrap;
      }

      &.highlighted {
        p {
          transition: font-weight 0.1s ease-in;
          font-weight: bold;
          color: #2C1D66;
        }

        ::before {
          content: '✔ ';
          margin-left: -14.4px;
          margin-right: 3px;
          font-size: 12px;
        }
      }
    }

    .tutorialContainer {
      margin-top: 32px;
      height: 100%;
      overflow-y: auto;

    }
  }

  .rightColumn {
    place-items: center;
    background-color: #f9f9f9;
    padding: 20px 4%;

    &.largePadding {
      padding: 20px 10%;
    }

    .tabBar {
      display: flex;
      justify-content: space-around;
      gap: 64px;
      background-color: white;
      border-radius: 8px;
      padding: 6px;
      margin-bottom: 20px;
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