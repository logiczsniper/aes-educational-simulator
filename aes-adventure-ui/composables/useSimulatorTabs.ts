export enum Tab {
  Encrypt = "encrypt",
  Decrypt = "decrypt",
  KeyExpansion = "key-expansion",
}

export const useSimulatorTabs = defineStore(getKey`simulatorTabs`, () => {
  const route = useRouteBaseName()
  const currentTab = ref(route === 'index' ? Tab.Encrypt : route?.substring(10))

  const getTabLink = (tab?: Tab) => `/simulator/${tab ?? currentTab.value ?? 'encrypt'}`
  const goToTab = (tab: Tab) => {
    currentTab.value = tab
  }

  return {
    route,
    currentTab,
    getTabLink,
    goToTab
  }
}, {
  persist: true
})