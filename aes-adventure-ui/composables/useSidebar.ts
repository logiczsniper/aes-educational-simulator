import anime from "animejs"

export const useSidebar = defineStore(getKey`sidebar`, () => {
  const width = ref('auto')
  const open = ref(true)
  const toggle = () => open.value = !open.value

  const sidebarClass = 'sidebar-animation-target'
  const resize = (width: number | string) => anime({
    targets: `.${sidebarClass}`,
    width,
    easing: 'easeInOutExpo',
    duration: 300,
  })

  const onManualResize = ([{ contentRect: { width: newWidthWithoutPadding } }]: ResizeObserverEntry[]) => {
    const sidebarPadding = 46
    const newWidth = newWidthWithoutPadding + sidebarPadding

    width.value = `${newWidth}px`
  }

  let _resizeObserver: ResizeObserver;
  const getResizeObserver = () => {
    _resizeObserver ??= new ResizeObserver(onManualResize)

    return _resizeObserver
  }

  const register = (sidebarElement: HTMLElement) => {
    sidebarElement.classList.add(sidebarClass)
    requestAnimationFrame(() => resize(width.value))
    getResizeObserver().observe(sidebarElement)
  }

  const unregister = (sidebarElement?: HTMLElement) => {
    if (sidebarElement) getResizeObserver().unobserve(sidebarElement)
    else getResizeObserver().disconnect()
  }

  const expand = () => resize(document.body.clientWidth * 0.4)
  const shrink = () => resize(document.body.clientWidth * 0.16)

  return {
    width,
    open,
    toggle,
    register,
    unregister,
    expand,
    shrink,
  }
}, {
  persist: {
    paths: ['width'],
  },
})