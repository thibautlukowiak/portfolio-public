// Tilt effect (based on tilt.jquery 1.2)
const DEFAULTS = {
  maxTilt: 20,
  perspective: 300,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
  scale: 1,
  speed: 400,
  reset: true
}

const tiltElement = (el, settings) => {
  let ticking = false
  let reset = false
  let mouse = { x: 0, y: 0 }
  let timeout

  const setTransition = () => {
    clearTimeout(timeout)
    el.style.transition = `${settings.speed}ms ${settings.easing}`
    timeout = setTimeout(() => (el.style.transition = ''), settings.speed)
  }

  const getValues = () => {
    const rect = el.getBoundingClientRect()
    const left = rect.left + window.scrollX
    const top = rect.top + window.scrollY
    const percentageX = (mouse.x - left) / el.offsetWidth
    const percentageY = (mouse.y - top) / el.offsetHeight

    return {
      tiltX: (settings.maxTilt / 2 - percentageX * settings.maxTilt).toFixed(2),
      tiltY: (percentageY * settings.maxTilt - settings.maxTilt / 2).toFixed(2)
    }
  }

  const update = () => {
    const { tiltX, tiltY } = getValues()
    const { perspective, scale } = settings

    if (reset) {
      reset = false
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`
      return
    }

    el.style.transform = `perspective(${perspective}px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(${scale},${scale},${scale})`
    ticking = false
  }

  const requestTick = () => {
    if (ticking) return
    requestAnimationFrame(update)
    ticking = true
  }

  el.addEventListener('mouseenter', () => {
    ticking = false
    el.style.willChange = 'transform'
    setTransition()
  })

  el.addEventListener('mousemove', (event) => {
    mouse = { x: event.pageX, y: event.pageY }
    requestTick()
  })

  if (settings.reset) {
    el.addEventListener('mouseleave', () => {
      setTransition()
      reset = true
      requestTick()
    })
  }
}

export const tilt = (elements, options = {}) => {
  const settings = { ...DEFAULTS, ...options }
  elements.forEach((el) => tiltElement(el, settings))
}
