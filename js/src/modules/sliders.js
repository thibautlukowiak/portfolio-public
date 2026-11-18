import Swiper from 'swiper'
import { A11y, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { isVisible } from '../utils'

const SPEED = 300

const A11Y = {
  prevSlideMessage: 'Projet précédent',
  nextSlideMessage: 'Projet suivant',
  firstSlideMessage: 'Premier projet',
  lastSlideMessage: 'Dernier projet',
  slideLabelMessage: '{{index}} sur {{slidesLength}}',
  containerRoleDescriptionMessage: 'carrousel',
  itemRoleDescriptionMessage: 'diapositive'
}

// Inactive slides: no keyboard access
const setInactiveSlidesInert = (swiper) => {
  swiper.slides.forEach((slide, index) => (slide.inert = index !== swiper.activeIndex))
}

// Lazy load (data-lazy)
const lazyLoad = (img) => {
  if (!img) return

  img.src = img.dataset.lazy
  img.removeAttribute('data-lazy')
}

const lazyLoadActiveSlide = (swiper) => lazyLoad(swiper.slides[swiper.activeIndex]?.querySelector('img[data-lazy]'))

// All covers (menu)
export const lazyLoadCovers = () => document.querySelectorAll('.js-slider--img img[data-lazy]').forEach(lazyLoad)

export const initHomeSliders = (onChange) => {
  const imgSlider = new Swiper('.js-slider--img', {
    modules: [EffectFade],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: SPEED,
    allowTouchMove: false,
    on: {
      init: lazyLoadActiveSlide,
      slideChange: lazyLoadActiveSlide
    }
  })

  const textSlider = new Swiper('.js-slider--text', {
    modules: [A11y, Navigation],
    loop: true,
    speed: SPEED,
    longSwipesRatio: 0.2,
    a11y: { ...A11Y, containerMessage: 'Projets à la une' },
    navigation: {
      prevEl: '.js-slider-prev',
      nextEl: '.js-slider-next'
    },
    on: {
      init: setInactiveSlidesInert,
      slideChangeTransitionEnd: setInactiveSlidesInert,
      slideChange(swiper) {
        imgSlider.slideTo(swiper.realIndex)
        onChange(swiper.slides[swiper.activeIndex].dataset.project)
      }
    }
  })

  // No animation (menu)
  textSlider.jumpTo = (index) => {
    imgSlider.slideTo(index, 0)
    textSlider.slideToLoop(index, 0)
  }

  return textSlider
}

// Pagination
const initDots = (swiper, el) => {
  const update = () => {
    el.querySelectorAll('button').forEach((button, index) => {
      if (index === swiper.realIndex) button.setAttribute('aria-current', 'true')
      else button.removeAttribute('aria-current')
    })
  }

  el.addEventListener('click', (event) => {
    const item = event.target.closest('li')
    if (item) swiper.slideTo([...el.children].indexOf(item))
  })

  swiper.on('slideChange', update)
  update()
}

// Project sliders
export const initProjectSliders = () => {
  document.querySelectorAll('.js-slider--tours:not(.actived)').forEach((el) => {
    if (!isVisible(el)) return

    const dots = el.querySelector('.js-slider-dots')
    const swiper = new Swiper(el, {
      modules: [A11y, EffectFade, Pagination],
      a11y: { ...A11Y, containerMessage: 'Captures du site Tours' },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: SPEED,
      pagination: {
        el: dots,
        renderBullet: (index, className) =>
          `<li class="${className}"><button type="button">Afficher l’image ${index + 1}</button></li>`
      }
    })

    initDots(swiper, dots)
    el.classList.add('actived')
  })
}
