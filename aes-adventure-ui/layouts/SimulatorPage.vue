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
</script>

<template>
  <div class="simulatorPage">
    <header
      v-if="sidebarOpen"
      class="leftColumn"
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
        <h5 v-if="config.selectedDefaultConfigs.length > 1">{{ t('simulator.configurations') }}</h5>
        <ClientOnly>
          <div
            v-if="config.selectedDefaultConfigs.length > 1"
            v-for="selectedDefaultConfig in config.selectedDefaultConfigs"
            class="configDefaultLabel"
            :class="{ 'highlighted': config.walkThroughConfig === selectedDefaultConfig }"
          >
            <p>{{ t(`configure.modal.defaults.${selectedDefaultConfig}.name`) }}
              <v-tooltip activator="parent">
                {{ t(`configure.modal.defaults.${ selectedDefaultConfig }.description`) }}
              </v-tooltip>
            </p>
          </div>
          <template #fallback>
            <div>
              <h5>{{ t('simulator.configurations') }}</h5>
              <div class="configSkeleton skeleton" />
            </div>
          </template>
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
        variant="plain"
        @click="toggleSidebar"
      >
        <template #prepend>
          <v-icon
            class="flipped"
            icon="mdi-backburger"
          />
        </template>
        <!-- {{ t('simulator.show') }} -->
      </v-btn>
    </div>
    <div v-if="!sidebarOpen" />
    <section class="rightColumn">
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
    z-index: 1;
  }

  .leftColumn {
    resize: horizontal;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 180px;
    max-width: 50vw;
    padding: 20px 20px 12px 26px;
    z-index: 2;
    background-color: white;

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
      }
    }
  }

  .rightColumn {
    place-items: center;
    background-color: #f9f9f9;

    .tabBar {
      display: flex;
      justify-content: space-around;
      background-color: white;
      border-radius: 12px;
      padding: 6px;
      margin: 20px;
      margin-top: 32px;
      transition: all .5s linear;
      color: #2C1D66;
      font-weight: bold;
      position: relative;

      .tab {
        cursor: pointer;
        width: 100%;
        padding: 8px 0;
        border-radius: 8px;
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