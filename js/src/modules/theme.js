// Light / dark mode (system by default, other choice saved)
const root = document.documentElement
const system = window.matchMedia('(prefers-color-scheme: dark)')

const getTheme = () => root.dataset.theme || (system.matches ? 'dark' : 'light')

const save = (theme) => {
  try {
    if (theme) localStorage.setItem('theme', theme)
    else localStorage.removeItem('theme')
  } catch (error) {
    // No storage (private browsing)
  }
}

let switching

export const initThemeSwitch = () => {
  const button = document.querySelector('.js-theme')
  if (!button) return

  const updateLabel = () => {
    const isDark = getTheme() === 'dark'
    button.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre')
  }

  button.addEventListener('click', () => {
    // Same transition on the whole page
    const duration = parseFloat(getComputedStyle(root).getPropertyValue('--transition-theme-timer')) * 1000
    root.classList.add('theme-switching')
    clearTimeout(switching)
    switching = setTimeout(() => root.classList.remove('theme-switching'), duration)

    const theme = getTheme() === 'dark' ? 'light' : 'dark'
    const systemTheme = system.matches ? 'dark' : 'light'

    // Same as the system
    if (theme === systemTheme) {
      delete root.dataset.theme
      save(null)
    } else {
      root.dataset.theme = theme
      save(theme)
    }

    updateLabel()
  })

  system.addEventListener('change', updateLabel)
  updateLabel()
}
