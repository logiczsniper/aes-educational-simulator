import anime from "animejs"

export const useSidebar = defineStore(getKey`sidebar`, () => {
  const width = ref('auto')
  const open = ref(true)
  const toggle = () => open.value = !open.value

  const sidebarClass = 'sidebar-animation-target'

  const onManualResize = ([{ contentRect: { width: newWidthWithoutPadding } }]: ResizeObserverEntry[]) => {
    const sidebarPadding = 46
    const newWidth = newWidthWithoutPadding + sidebarPadding

    width.value = `${newWidth}px`
  }

  const register = (sidebarElement: HTMLElement) => {
    sidebarElement.style.setProperty('width', width.value)
    sidebarElement.classList.add(sidebarClass)
    new ResizeObserver(onManualResize).observe(sidebarElement)
  }

  const resize = (width: number) => anime({
    targets: `.${sidebarClass}`,
    width,
    easing: 'easeInOutExpo'
  })

  const expand = () => resize(document.body.clientWidth * 0.4)
  const shrink = () => resize(document.body.clientWidth * 0.16)

  return {
    width,
    open,
    toggle,
    register,
    expand,
    shrink,
  }
}, {
  persist: true
})