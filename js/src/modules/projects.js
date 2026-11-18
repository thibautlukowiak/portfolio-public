import { debounce, isVisible, offset } from '../utils'

// Menu - Background image on hover / focus
export const initMenuHover = () => {
  document.querySelectorAll('.js-hover span').forEach((el) => {
    const load = () => (el.style.backgroundImage = `url(${el.dataset.src})`)

    el.addEventListener('mouseenter', load)
    el.closest('button').addEventListener('focus', load)
  })
}

// Marathon - Parallax
export const initParallax = () => {
  const project = document.querySelector('.project[data-project="marathon"]')
  if (!project) return

  const layers = [
    { el: '.parallax1', x: 'left', y: 'top', moveX: 1, moveY: 1 },
    { el: '.parallax2', x: 'right', y: 'top', moveX: 1, moveY: -1 },
    { el: '.parallax3', x: 'left', y: 'bottom', moveX: 1, moveY: 1 },
    { el: '.parallax4', x: 'left', y: 'bottom', moveX: -1, moveY: -1 }
  ].map((layer) => {
    const el = document.querySelector(layer.el)
    const style = getComputedStyle(el)
    return { ...layer, el, startX: parseInt(style[layer.x], 10), startY: parseInt(style[layer.y], 10) }
  })

  project.addEventListener('mousemove', (event) => {
    const x = -event.pageX / 50
    const y = -event.pageY / 50

    layers.forEach((layer) => {
      layer.el.style[layer.x] = `${layer.startX + layer.moveX * x}px`
      layer.el.style[layer.y] = `${layer.startY + layer.moveY * y}px`
    })
  })
}

// Artigo - Animated hand on scroll
export const initHand = () => {
  const hands = document.querySelectorAll('.js-hand')
  if (!hands.length) return

  const step = 183
  let lastScrollTop = 0

  window.addEventListener(
    'scroll',
    debounce(() => {
      const scrollPos = window.scrollY
      const xPos = parseInt(getComputedStyle(hands[0]).backgroundPosition.split(' ')[0], 10)
      const xPosNew = scrollPos > lastScrollTop ? xPos + step : xPos - step

      hands.forEach((hand) => (hand.style.backgroundPosition = `${xPosNew}px 0px`))
      lastScrollTop = scrollPos
    }, 100)
  )
}

// MisterFly - Fake loading of the results list
export const initLoading = () => {
  const image = document.querySelector('.js-loading')
  const bar = document.querySelector('.js-loading-bar')
  if (!image || !bar) return

  const loadedSrc = 'img/misterfly/results-list--loaded.webp'

  const onScroll = () => {
    if (!isVisible(image)) return

    const distance = offset(image).top - window.scrollY
    if (distance - window.innerHeight > 0) return

    window.removeEventListener('scroll', onScroll)
    bar.classList.add('js-active')

    setTimeout(() => {
      // data-src too (lazy load)
      image.dataset.src = loadedSrc
      image.src = loadedSrc
      bar.classList.remove('js-active')
    }, 8000)
  }

  window.addEventListener('scroll', onScroll)
}
