import { scrollTop } from '../utils'
import { initProjectSliders, lazyLoadCovers } from './sliders'

const body = document.body
const switchButton = document.querySelector('.js-switch')
const resumeButton = document.querySelector('.js-resume')
const sliderImg = document.querySelector('.js-slider--img')

const panels = {
  menu: document.querySelector('.menu'),
  resume: document.querySelector('.resume'),
  projects: document.querySelector('.projects'),
  slider: document.querySelector('.js-slider--text'),
  sliderNav: document.querySelector('.slider-nav'),
  themeSwitch: document.querySelector('.js-theme'),
  printButton: document.querySelector('.print-button')
}

export const showProject = (project) => {
  // Header / footer colors
  body.dataset.project = project
  document.querySelectorAll('.project').forEach((el) => el.classList.remove('js-active'))
  document.querySelector(`.project[data-project="${project}"]`)?.classList.add('js-active')
}

// ARIA and keyboard access
const syncState = () => {
  const isMenu = body.classList.contains('menu-display')
  const isResume = body.classList.contains('resume-display')
  const isProject = body.classList.contains('project-display')
  const isHome = !isMenu && !isResume && !isProject

  panels.menu.inert = !isMenu
  if (isMenu) lazyLoadCovers()
  panels.resume.inert = !isResume
  panels.projects.inert = !isProject
  panels.slider.inert = !isHome
  panels.sliderNav.inert = isMenu || isResume
  panels.themeSwitch.inert = !isResume
  panels.printButton.inert = isMenu

  resumeButton.setAttribute('aria-expanded', isResume)
  resumeButton.setAttribute('aria-label', isResume ? 'Fermer le CV' : 'Afficher le CV')

  switchButton.setAttribute('aria-expanded', isMenu)
  switchButton.setAttribute(
    'aria-label',
    isMenu ? 'Fermer les projets' : isProject || isResume ? 'Fermer' : 'Afficher les projets'
  )
}

// Focus project title
const focusProject = () => {
  const title = document.querySelector('.project.js-active .title')
  if (!title) return

  title.setAttribute('tabindex', '-1')
  title.focus({ preventScroll: true })
}

const closeDisplay = () => {
  scrollTop()

  if (body.classList.contains('project-display')) {
    body.classList.remove('project-display')
  } else if (body.classList.contains('resume-display')) {
    body.classList.remove('resume-display')
  } else {
    body.classList.toggle('menu-display')
  }
}

export const initDisplays = (textSlider) => {
  new MutationObserver(syncState).observe(body, { attributes: true, attributeFilter: ['class'] })
  syncState()

  // Switch display (menu / close)
  switchButton.addEventListener('click', closeDisplay)

  // Escape closes the current display
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !body.className) return

    closeDisplay()
    switchButton.focus()
  })

  // Resume display
  resumeButton.addEventListener('click', () => {
    if (body.classList.contains('resume-display')) {
      scrollTop()
      body.classList.remove('resume-display')
    } else {
      body.className = 'resume-display'
    }
  })

  // Print resume
  document.querySelectorAll('.js-print').forEach((el) => el.addEventListener('click', () => window.print()))

  const displayProject = () => {
    body.className = 'project-display'
    initProjectSliders()
    focusProject()
  }

  // Project display from slider
  document.querySelectorAll('.js-show').forEach((el) => el.addEventListener('click', displayProject))

  // Project display from menu
  document.querySelectorAll('.js-show--menu').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('li')
      const index = [...item.parentNode.children].indexOf(item)

      textSlider.jumpTo(index)
      showProject(button.dataset.project)

      // Image displayed at once (only the height is animated)
      sliderImg.style.transitionProperty = 'height'
      displayProject()
      sliderImg.offsetHeight // reflow
      sliderImg.style.transitionProperty = ''
    })
  })
}
