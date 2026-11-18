// Reduced motion
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Desktop (mouse)
export const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Visible element
export const isVisible = (el) => !!el && el.getClientRects().length > 0

// Position in the document
export const offset = (el) => {
  const rect = el.getBoundingClientRect()
  return { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
}

export const debounce = (callback, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), wait)
  }
}

export const scrollTop = () => window.scrollTo(0, 0)
