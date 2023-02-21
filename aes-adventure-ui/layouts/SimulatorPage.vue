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

const tutorial = useTutorial();
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
      <section
        v-if="config.selectedDefaultConfigs.length > 1"
        class="leftColumnSection"
      >
        <h4>{{ t('simulator.configurations') }}</h4>
        <ClientOnly>
          <transition
            appear
            name="opacity"
          >
            <div>
              <div
                v-for="selectedDefaultConfig in config.selectedDefaultConfigs"
                class="configDefaultLabel"
                :class="{ 'highlighted': config.walkThroughConfig === selectedDefaultConfig }"
              >
                <p>{{ t(`configure.modal.defaults.${selectedDefaultConfig}.name`) + ' AES' }}
                  <v-tooltip activator="parent">
                    {{ t(`configure.modal.defaults.${selectedDefaultConfig}.description`) }}
                  </v-tooltip>
                </p>
              </div>
            </div>
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
    padding: 20px 20px 12px 26px;
    z-index: 2;
    background-color: white;
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
      background-color: white;
      z-index: 20;
    }

    .navMenu {
      margin: 20px 0 0 -12px;

      .quitButton {
        color: unset;
      }
    }

    .configDefaultLabel {
      display: flex;
      flex-direction: column;
      overflow-wrap: break-word;

      small {
        font-size: 12px;
        line-height: 12px;
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
      flex-grow: 1;
      position: relative;

      -webkit-mask-image: linear-gradient(180deg, #000 90%, transparent);
      mask-image: linear-gradient(180deg, #000 90%, transparent);

      padding-bottom: 40px;
    }
  }

  .rightColumn {
    place-items: center;
    background-color: #f9f9f9;
    padding: 20px 4%;
    overflow-y: auto;
    min-width: 1000px;

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