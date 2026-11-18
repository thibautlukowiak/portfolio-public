// Constellation canvas (based on Constellation 1.2.2 by Acauã Montiel)
// Animated on hover only
const DEFAULTS = {
  star: { color: 'rgba(255, 255, 255, .5)', width: 3 },
  line: { color: '#222523', width: 0.2 },
  velocity: 0.1,
  length: 150,
  distance: 150,
  radius: 150
}

const near = (a, b, distance) =>
  a.x - b.x < distance && a.y - b.y < distance && a.x - b.x > -distance && a.y - b.y > -distance

export const constellation = (canvas, options = {}) => {
  const config = {
    ...DEFAULTS,
    ...options,
    star: { ...DEFAULTS.star, ...options.star },
    line: { ...DEFAULTS.line, ...options.line }
  }
  const context = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  context.fillStyle = config.star.color
  context.strokeStyle = config.line.color
  context.lineWidth = config.line.width

  const position = { x: canvas.width * 0.5, y: canvas.height * 0.5 }

  const stars = Array.from({ length: config.length }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: config.velocity - Math.random() * 0.5,
    vy: config.velocity - Math.random() * 0.5,
    radius: Math.random() * config.star.width
  }))

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Stars
    stars.forEach((star) => {
      context.beginPath()
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false)
      context.fill()
    })

    // Lines between close stars, around the mouse
    stars.forEach((iStar) => {
      stars.forEach((jStar) => {
        if (near(iStar, jStar, config.distance) && near(iStar, position, config.radius)) {
          context.beginPath()
          context.moveTo(iStar.x, iStar.y)
          context.lineTo(jStar.x, jStar.y)
          context.stroke()
          context.closePath()
        }
      })
    })

    // Move
    stars.forEach((star) => {
      if (star.y < 0 || star.y > canvas.height) {
        star.vy = -star.vy
      } else if (star.x < 0 || star.x > canvas.width) {
        star.vx = -star.vx
      }
      star.x += star.vx
      star.y += star.vy
    })

    if (isAnimated) requestAnimationFrame(draw)
  }

  let isAnimated = false

  canvas.addEventListener('mouseenter', () => {
    if (isAnimated) return
    isAnimated = true
    requestAnimationFrame(draw)
  })

  canvas.addEventListener('mouseleave', () => (isAnimated = false))

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect()
    position.x = event.pageX - (rect.left + window.scrollX)
    position.y = event.pageY - (rect.top + window.scrollY)
  })

  draw()
}
