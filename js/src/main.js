import LazyLoad from './libraries/lazyload.min.js'
import { constellation } from './modules/constellation'
import { initDisplays, showProject } from './modules/displays'
import { initHand, initLoading, initMenuHover, initParallax } from './modules/projects'
import { shuffleLetters } from './modules/shuffle-letters'
import { initHomeSliders, initProjectSliders } from './modules/sliders'
import { initThemeSwitch } from './modules/theme'
import { tilt } from './modules/tilt'
import { isDesktop, prefersReducedMotion, scrollTop } from './utils'

// Top on reload
history.scrollRestoration = 'manual'

new LazyLoad({ elements_selector: '[data-src]' })

const titles = document.querySelectorAll('.js-shuffle')

// Home sliders
const animate = !prefersReducedMotion()

const textSlider = initHomeSliders((project) => {
  if (animate) shuffleLetters(titles)
  scrollTop()
  showProject(project)
  initProjectSliders()
})

if (animate) shuffleLetters(titles)
initDisplays(textSlider)
initThemeSwitch()
initMenuHover()
initHand()
initLoading()

// Desktop only effects
if (isDesktop() && animate) {
  tilt(document.querySelectorAll('.js-hover span'), { perspective: 600, maxTilt: 30, reset: false })
  tilt(document.querySelectorAll('.js-slider--text .slide'), { perspective: 500, reset: false })

  // Naturel - Canvas
  document.querySelectorAll('canvas').forEach((canvas) => {
    constellation(canvas, { line: { color: '#c4ad2f' } })
  })

  initParallax()
}
