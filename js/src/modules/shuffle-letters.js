// Shuffle letters (based on the jQuery plugin by Martin Angelov)
const STEP = 8
const FPS = 26
const POOLS = {
  lowerLetter: 'abcdefghijklmnopqrstuvwxyz0123456789',
  upperLetter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  symbol: ',.?/\\(^)![]{}*&^%$#\'"'
}

const animated = new WeakSet()

const randomChar = (type) => {
  const pool = POOLS[type]
  return pool[Math.floor(Math.random() * pool.length)]
}

const getType = (char) => {
  if (char === ' ') return 'space'
  if (/[a-z]/.test(char)) return 'lowerLetter'
  if (/[A-Z]/.test(char)) return 'upperLetter'
  return 'symbol'
}

const shuffle = (el) => {
  // Prevent parallel animations
  if (animated.has(el)) return
  animated.add(el)

  const chars = el.textContent.split('')
  const types = chars.map(getType)
  const letters = chars.map((char, i) => i).filter((i) => types[i] !== 'space')

  el.textContent = ''

  const frame = (start) => {
    if (start > letters.length) {
      animated.delete(el)
      return
    }

    const copy = chars.slice()
    for (let i = Math.max(start, 0); i < letters.length; i++) {
      copy[letters[i]] = i < start + STEP ? randomChar(types[letters[i]]) : ''
    }
    el.textContent = copy.join('')

    setTimeout(() => frame(start + 1), 1000 / FPS)
  }

  frame(-STEP)
}

export const shuffleLetters = (elements) => elements.forEach(shuffle)
