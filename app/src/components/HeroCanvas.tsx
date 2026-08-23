import { useEffect, useRef } from 'react'

const GLYPH_REGION_HEIGHT = 140
const SCAN_LINE_SPEED = 0.18
const FONT_SIZE = 100

class Particle {
  x = 0
  y = 0
  targetX = 0
  targetY = 0
  isHighlighted = false
  isDust = false
  hidden = false
  vx = 0
  vy = 0

  init(x: number, y: number, highlighted: boolean, dust: boolean) {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.isHighlighted = highlighted
    this.isDust = dust
    this.hidden = false
    if (highlighted) {
      this.vx = (Math.random() - 0.5) * 0.4
      this.vy = (Math.random() - 0.5) * 0.4
    } else if (dust) {
      this.vx = (Math.random() - 0.5) * 0.2
      this.vy = (Math.random() - 0.5) * 0.2
    } else {
      this.vx = 0
      this.vy = 0
    }
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (!this.isHighlighted && !this.isDust) return
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.96
    this.vy *= 0.96
    if (this.isDust) {
      this.vx += (Math.random() - 0.5) * 0.05
      this.vy += (Math.random() - 0.5) * 0.05
      if (this.x < 0) this.x = canvasWidth
      if (this.x > canvasWidth) this.x = 0
      if (this.y < 0) this.y = canvasHeight
      if (this.y > canvasHeight) this.y = 0
    }
    if (this.isHighlighted && Math.abs(this.vx) < 0.01 && Math.abs(this.vy) < 0.01) {
      this.x = this.targetX
      this.y = this.targetY
    } else if (this.isHighlighted) {
      this.x += (this.targetX - this.x) * 0.1
      this.y += (this.targetY - this.y) * 0.1
    }
  }

  draw(ctx: CanvasRenderingContext2D, smallSprite: HTMLCanvasElement, largeSprite: HTMLCanvasElement) {
    if (this.hidden) return
    if (this.isDust) {
      ctx.globalAlpha = 0.4
      ctx.drawImage(smallSprite, this.x - 3, this.y - 3)
      ctx.globalAlpha = 1
    } else if (this.isHighlighted) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(largeSprite, this.x - 5, this.y - 5)
      ctx.globalAlpha = 1
    }
  }
}

class ScanLine {
  x: number
  y: number
  startX: number
  startY: number
  velocityX: number
  bounds: { width: number; height: number }
  active = true
  width = 180
  opacity = 0

  constructor(startX: number, startY: number, velocityX: number, bounds: { width: number; height: number }) {
    this.startX = startX
    this.startY = startY
    this.x = startX
    this.y = startY
    this.velocityX = velocityX
    this.bounds = bounds
  }

  update() {
    this.x += this.velocityX
    const distFromStart = Math.abs(this.x - this.startX)
    if (distFromStart < 100) {
      this.opacity = Math.min(distFromStart / 100, 1)
    } else if (distFromStart > this.bounds.width - 300) {
      this.opacity = Math.max(0, (this.bounds.width - 300) / 100)
    } else {
      this.opacity = 1
    }
    if (this.x > this.bounds.width + 300) {
      this.active = false
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createLinearGradient(this.x - this.width / 2, 0, this.x + this.width / 2, 0)
    gradient.addColorStop(0, 'rgba(10, 16, 69, 0)')
    gradient.addColorStop(0.5, `rgba(212, 163, 115, ${0.1 * this.opacity})`)
    gradient.addColorStop(1, 'rgba(10, 16, 69, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(this.x - this.width / 2, 0, this.width, this.bounds.height)
  }
}

class TextRevealController {
  words: { text: string; targets: { x: number; y: number }[]; revealed: boolean; revealedTime: number; highlightedParticles: Particle[] }[] = []
  activeParticles: Particle[] = []
  scanLines: ScanLine[] = []
  revealedWords = 0
  allWordsRevealed = false

  createGlyphTargets(text: string, x: number, y: number, _canvasWidth: number, _canvasHeight: number) {
    const offscreenCanvas = document.createElement('canvas')
    const offCtx = offscreenCanvas.getContext('2d')!
    offCtx.font = `${FONT_SIZE}px "Playfair Display", serif`
    const measured = offCtx.measureText(text)
    offscreenCanvas.width = Math.ceil(measured.width)
    offscreenCanvas.height = Math.ceil(FONT_SIZE * 1.2)
    offCtx.font = `${FONT_SIZE}px "Playfair Display", serif`
    offCtx.fillStyle = 'white'
    offCtx.fillText(text, 0, FONT_SIZE)
    const imageData = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height)
    const targets: { x: number; y: number }[] = []
    const step = 4
    for (let py = 0; py < offscreenCanvas.height; py += step) {
      for (let px = 0; px < offscreenCanvas.width; px += step) {
        const i = (py * offscreenCanvas.width + px) * 4
        if (imageData.data[i + 3] > 128) {
          targets.push({ x: x + px, y: y + py })
        }
      }
    }
    return targets
  }

  initText(textLines: string[], startX: number, startY: number, lineGap: number, canvasWidth: number, canvasHeight: number) {
    this.words = []
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i]
      const lineY = startY + i * lineGap
      const targets = this.createGlyphTargets(line, startX, lineY, canvasWidth, canvasHeight)
      this.words.push({
        text: line,
        targets,
        revealed: false,
        revealedTime: 0,
        highlightedParticles: [],
      })
    }
    this.revealedWords = 0
    this.allWordsRevealed = false
  }

  spawnScanLine(y: number, canvasWidth: number, canvasHeight: number) {
    this.scanLines.push(new ScanLine(-200, y, SCAN_LINE_SPEED, { width: canvasWidth, height: canvasHeight }))
  }

  update(_dt: number, time: number, canvasWidth: number, canvasHeight: number) {
    for (let i = this.scanLines.length - 1; i >= 0; i--) {
      this.scanLines[i].update()
      if (!this.scanLines[i].active) {
        this.scanLines.splice(i, 1)
      }
    }

    if (this.scanLines.length < 2 && Math.random() < 0.02 && !this.allWordsRevealed) {
      this.spawnScanLine(Math.random() * canvasHeight, canvasWidth, canvasHeight)
    }

    if (!this.allWordsRevealed) {
      for (const word of this.words) {
        if (word.revealed || word.targets.length === 0) continue
        const targetX = word.targets[0].x
        const targetY = word.targets[Math.floor(word.targets.length / 2)].y
        for (const sl of this.scanLines) {
          const dx = targetX - sl.x
          const dy = targetY - sl.y
          if (Math.abs(dx) < 120 && Math.abs(dy) < 80) {
            word.revealed = true
            word.revealedTime = time
            this.revealedWords++
            break
          }
        }
      }
    }

    if (this.revealedWords >= this.words.length) {
      this.allWordsRevealed = true
    }

    for (const word of this.words) {
      if (word.revealed && time - word.revealedTime > 500 && word.highlightedParticles.length === 0) {
        this.highlightWord(word, canvasWidth, canvasHeight)
      }
    }

    for (const p of this.activeParticles) {
      p.update(canvasWidth, canvasHeight)
    }
  }

  highlightWord(word: { targets: { x: number; y: number }[]; highlightedParticles: Particle[] }, canvasWidth: number, canvasHeight: number) {
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    for (let i = 0; i < 50; i++) {
      const a1 = Math.random() * Math.PI * 2
      const a2 = Math.random() * Math.PI * 2
      const r = Math.random() * 2 + (Math.random() < 0.3 ? 100 : 20)
      const sourceX = centerX + Math.cos(a1) * r
      const sourceY = centerY + Math.sin(a2) * r
      const target = word.targets[Math.floor(Math.random() * word.targets.length)]
      const p = new Particle()
      p.init(sourceX, sourceY, true, false)
      p.targetX = target.x
      p.targetY = target.y
      word.highlightedParticles.push(p)
      this.activeParticles.push(p)
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number, smallSprite: HTMLCanvasElement, largeSprite: HTMLCanvasElement) {
    for (const sl of this.scanLines) {
      sl.draw(ctx)
    }
    for (const word of this.words) {
      if (word.revealed && time - word.revealedTime > 600 && word.targets.length > 0) {
        ctx.fillStyle = 'rgba(212, 163, 115, 0.12)'
        ctx.font = `${FONT_SIZE}px "Playfair Display", serif`
        ctx.fillText(word.text, word.targets[0].x, word.targets[0].y + FONT_SIZE * 0.85)
      }
    }
    for (const p of this.activeParticles) {
      p.draw(ctx, smallSprite, largeSprite)
    }
  }
}

function createParticleSprite(radius: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = radius * 2
  canvas.height = radius * 2
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius)
  gradient.addColorStop(0, 'rgba(107, 147, 214, 1)')
  gradient.addColorStop(1, 'rgba(107, 147, 214, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(radius, radius, radius, 0, Math.PI * 2)
  ctx.fill()
  return canvas
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const initRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || initRef.current) return
    initRef.current = true

    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight

    const resize = () => {
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()

    let debounceTimer: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(resize, 200)
    }
    window.addEventListener('resize', debouncedResize)

    const particleSpriteSmall = createParticleSprite(3)
    const particleSpriteLarge = createParticleSprite(5)

    const revealController = new TextRevealController()
    const heroTextLines = ['AI That Reads', 'the Fine Print']
    const lineGap = GLYPH_REGION_HEIGHT + 20
    const totalHeight = heroTextLines.length * lineGap
    const startY = (canvasHeight - totalHeight) / 2

    const dustCount = canvasWidth < 768 ? 800 : 2000
    for (let i = 0; i < dustCount; i++) {
      const p = new Particle()
      p.init(Math.random() * canvasWidth, Math.random() * canvasHeight, false, true)
      revealController.activeParticles.push(p)
    }

    document.fonts.ready.then(() => {
      revealController.initText(heroTextLines, canvasWidth * 0.08, startY, lineGap, canvasWidth, canvasHeight)
    })

    let lastTime = 0
    const animate = (timestamp: number) => {
      animRef.current = requestAnimationFrame(animate)
      let dt = timestamp - lastTime
      if (dt > 100) dt = 100
      lastTime = timestamp

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      revealController.update(dt, timestamp, canvasWidth, canvasHeight)
      revealController.draw(ctx, timestamp, particleSpriteSmall, particleSpriteLarge)
    }
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(debounceTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
      role="presentation"
    />
  )
}
