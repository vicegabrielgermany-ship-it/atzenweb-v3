import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export interface LabelSlot {
  id: string
  kind: 'cone' | 'cyl'
  face: 'front' | 'back'
  arcDeg: number
  radius?: number
  rBot?: number
  rTop?: number
  y0?: number
  y1?: number
  centerY?: number
  height?: number
  topArch?: boolean
}

export interface FinishPreset {
  name: string
  glass: number
  beer: number
  attn: number
}

const FINISHES: FinishPreset[] = [
  { name: 'Amber', glass: 0x5a2a0a, beer: 0xb4560c, attn: 1.6 },
  { name: 'Green', glass: 0x123f1a, beer: 0xc09614, attn: 2.0 },
  { name: 'Clear', glass: 0xd7ddd9, beer: 0xcf9514, attn: 6.0 },
]

const LABEL_CONFIGS: LabelSlot[] = [
  { id: 'shoulder', kind: 'cone', face: 'front', arcDeg: 180, rBot: 2.96, rTop: 1.58, y0: 14.2, y1: 17.5 },
  { id: 'body', kind: 'cyl', face: 'front', arcDeg: 146, radius: 3.23, centerY: 7.25, height: 11.5, topArch: true },
  { id: 'back', kind: 'cyl', face: 'back', arcDeg: 146, radius: 3.23, centerY: 6.5, height: 11.5 },
]

function makePlaceholder(id: string): HTMLCanvasElement {
  const cfg = LABEL_CONFIGS.find(c => c.id === id)!
  const arc = THREE.MathUtils.degToRad(cfg.arcDeg)
  const aspect = cfg.kind === 'cone'
    ? (((cfg.rTop! + cfg.rBot!) / 2) * arc) / (cfg.y1! - cfg.y0!)
    : (cfg.radius! * arc) / cfg.height!
  const W = 1024
  const H = Math.max(220, Math.round(W / aspect))
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')!
  const bg = '#efe6d3'
  const ink = '#23150a'
  const gold = '#a9802f'

  x.fillStyle = bg
  x.fillRect(0, 0, W, H)
  for (let i = 0; i < 3000; i++) {
    x.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`
    x.fillRect(Math.random() * W, Math.random() * H, 1, 1)
  }

  x.strokeStyle = gold
  x.lineWidth = 6
  x.setLineDash([22, 16])
  x.strokeRect(36, 36, W - 72, H - 72)
  x.setLineDash([])

  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillStyle = ink
  x.font = '600 96px Oswald, sans-serif'
  x.fillText(id.toUpperCase(), W / 2, H / 2 - 22)
  x.fillStyle = gold
  x.font = '400 34px Oswald, sans-serif'
  x.fillText('UPLOAD YOUR SCAN', W / 2, H / 2 + 48)
  return c
}

function makeRadialShadow(): THREE.CanvasTexture {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const x = c.getContext('2d')!
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(0.5, 'rgba(0,0,0,0.22)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g
  x.fillRect(0, 0, s, s)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export interface BottleSceneOptions {
  autoRotate?: boolean
  finishIndex?: number
  labelImages?: Partial<Record<string, string>>
}

export class BottleScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private group: THREE.Group
  private glassMat: THREE.MeshPhysicalMaterial
  private beerMat: THREE.MeshPhysicalMaterial
  private labelMeshes: Record<string, THREE.Mesh> = {}
  private disposed = false
  private container: HTMLDivElement
  private rafId = 0
  private resumeTimer: ReturnType<typeof setTimeout> | null = null

  constructor(container: HTMLDivElement, options?: BottleSceneOptions) {
    this.container = container
    const w = container.clientWidth
    const h = container.clientHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(w, h)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 200)
    this.camera.position.set(0, 3, 52)

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    const key = new THREE.DirectionalLight(0xfff2dd, 2.6)
    key.position.set(6, 10, 8)
    this.scene.add(key)
    const fill = new THREE.DirectionalLight(0x9fb6d6, 0.8)
    fill.position.set(-8, 2, 4)
    this.scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffd9a0, 2.0)
    rim.position.set(-2, 6, -10)
    this.scene.add(rim)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    const fi = options?.finishIndex ?? 0
    const finish = FINISHES[fi]

    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: finish.glass,
      metalness: 0, roughness: 0.07,
      transmission: 1, thickness: 2.4, ior: 1.5,
      attenuationColor: finish.glass,
      attenuationDistance: finish.attn,
      clearcoat: 0.7, clearcoatRoughness: 0.18,
      envMapIntensity: 1.5, side: THREE.DoubleSide,
    })

    this.beerMat = new THREE.MeshPhysicalMaterial({
      color: finish.beer,
      roughness: 0.25, metalness: 0,
      transmission: 0.45, thickness: 3, ior: 1.34,
      attenuationColor: finish.beer, attenuationDistance: 4,
      envMapIntensity: 0.8,
    })

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xcab86a, metalness: 0.75, roughness: 0.58, envMapIntensity: 0.7,
    })

    const profile: THREE.Vector2[] = [
      [0.00, 0.00], [2.55, 0.00], [3.05, 0.30], [3.18, 0.70],
      [3.20, 1.10], [3.20, 13.10],
      [3.18, 13.38], [3.11, 13.75], [2.96, 14.22],
      [2.53, 15.22], [2.10, 16.22], [1.66, 17.22],
      [1.23, 18.22], [1.12, 18.75],
      [1.12, 19.25],
      [1.16, 19.45], [1.21, 19.62], [1.21, 19.78], [1.16, 19.95], [1.12, 20.08],
      [1.12, 20.15], [1.30, 20.42], [1.30, 20.80], [0.00, 20.80],
    ].map(p => new THREE.Vector2(p[0], p[1]))

    const bottle = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), this.glassMat)
    bottle.renderOrder = 2

    const beer = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 14, 48), this.beerMat)
    beer.position.y = 7.0
    beer.renderOrder = 1

    this.buildLabelMeshes(options?.labelImages)

    const cap = new THREE.Mesh(this.makeCrownCap(), metalMat)

    this.group = new THREE.Group()
    this.group.add(bottle, beer, cap)
    Object.values(this.labelMeshes).forEach(m => this.group.add(m))

    const shadowTex = makeRadialShadow()
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.02
    this.group.add(shadow)
    this.group.position.y = -11
    this.scene.add(this.group)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.enablePan = false
    this.controls.minDistance = 32
    this.controls.maxDistance = 90
    this.controls.minPolarAngle = 0.55
    this.controls.maxPolarAngle = 2.15
    this.controls.autoRotate = options?.autoRotate ?? true
    this.controls.autoRotateSpeed = 1.1
    this.controls.target.set(0, 0, 0)

    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false
      if (this.resumeTimer) clearTimeout(this.resumeTimer)
    })
    this.controls.addEventListener('end', () => {
      this.resumeTimer = setTimeout(() => {
        this.controls.autoRotate = options?.autoRotate ?? true
      }, 2500)
    })

    this.tick()

    const ro = new ResizeObserver(() => this.onResize())
    ro.observe(container)
    this.renderer.domElement.__resizeObserver = ro
  }

  private panelGeometry(cfg: LabelSlot, scanAspect?: number): THREE.BufferGeometry {
    const arc = THREE.MathUtils.degToRad(cfg.arcDeg)
    const start = (cfg.face === 'back' ? Math.PI : 0) - arc / 2
    let g: THREE.BufferGeometry
    if (cfg.kind === 'cone') {
      g = new THREE.CylinderGeometry(cfg.rTop, cfg.rBot, cfg.y1! - cfg.y0!, 64, 1, true, start, arc)
      g.translate(0, (cfg.y0! + cfg.y1!) / 2, 0)
    } else {
      const arcLen = cfg.radius! * arc
      const h = scanAspect ? arcLen / scanAspect : cfg.height!
      g = new THREE.CylinderGeometry(cfg.radius, cfg.radius, h, 64, 1, true, start, arc)
      g.translate(0, cfg.centerY!, 0)
    }
    return g
  }

  private buildLabelMeshes(images?: Partial<Record<string, string>>) {
    LABEL_CONFIGS.forEach(cfg => {
      const tex = new THREE.CanvasTexture(makePlaceholder(cfg.id))
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      const mat = new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.85, metalness: 0, envMapIntensity: 0.45,
        transparent: true, alphaTest: 0.1,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -40,
      })
      const mesh = new THREE.Mesh(this.panelGeometry(cfg), mat)
      mesh.renderOrder = 3
      mesh.userData = { cfg }
      this.labelMeshes[cfg.id] = mesh
    })
    if (images) {
      Object.entries(images).forEach(([id, src]) => {
        if (src && this.labelMeshes[id]) {
          this.loadLabelImage(id, src)
        }
      })
    }
  }

  private makeCrownCap(): THREE.BufferGeometry {
    const FLUTES = 21
    const AMP = 0.085
    const SEG = FLUTES * 14
    const profile = [
      [1.18, 20.25], [1.37, 20.30], [1.38, 20.48], [1.38, 20.70],
      [1.34, 20.80], [1.10, 20.97], [0.45, 21.12], [0.00, 21.15],
    ].map(p => new THREE.Vector2(p[0], p[1]))

    const geo = new THREE.LatheGeometry(profile, SEG)

    const fluteAt = (y: number) => {
      const bot = 20.76, top = 20.80
      if (y <= bot) return 1
      if (y >= top) return 0
      const t = (y - bot) / (top - bot)
      return 1 - t * t * (3 - 2 * t)
    }

    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const r = Math.hypot(x, z)
      if (r < 1e-4) continue
      const theta = Math.atan2(z, x)
      const nr = r + fluteAt(y) * AMP * Math.cos(FLUTES * theta)
      pos.setX(i, Math.cos(theta) * nr)
      pos.setZ(i, Math.sin(theta) * nr)
    }
    geo.computeVertexNormals()
    return geo
  }

  setFinish(index: number) {
    const f = FINISHES[index]
    if (!f) return
    this.glassMat.color.setHex(f.glass)
    this.glassMat.attenuationColor.setHex(f.glass)
    this.glassMat.attenuationDistance = f.attn
    this.beerMat.color.setHex(f.beer)
    this.beerMat.attenuationColor.setHex(f.beer)
  }

  setAutoRotate(v: boolean) {
    this.controls.autoRotate = v
  }

  loadLabelImage(id: string, url: string) {
    const mesh = this.labelMeshes[id]
    if (!mesh) return
    const cfg = mesh.userData.cfg as LabelSlot
    const loader = new THREE.ImageLoader()
    const fallbackUrl = url.endsWith('.webp') ? url.replace(/\.webp$/, '.jpg') : undefined
    const tryLoad = (u: string) => {
      loader.load(u, (image) => {
        if (this.disposed) return
        const source = cfg.topArch ? this.applyArchMask(image) : cfg.id === 'shoulder' ? this.applyShoulderMask(image) : image
        const tex = new THREE.Texture(source)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
        tex.needsUpdate = true
        const oldMap = mesh.material.map as THREE.Texture | undefined
        if (oldMap) oldMap.dispose()
        mesh.material.map = tex
        mesh.material.needsUpdate = true
        if (cfg.kind === 'cyl') {
          mesh.geometry.dispose()
          mesh.geometry = this.panelGeometry(cfg, image.width / image.height)
        }
      }, undefined, () => {
        if (fallbackUrl && u !== fallbackUrl) {
          tryLoad(fallbackUrl)
        }
      })
    }
    tryLoad(url)
  }

  private applyArchMask(image: HTMLImageElement): HTMLCanvasElement {
    const W = image.width
    const H = image.height
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d')!

    const radius = W / 2
    const centerX = W / 2
    const archBaseY = radius

    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, archBaseY)
    ctx.arc(centerX, archBaseY, radius, Math.PI, 0, false)
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(image, 0, 0, W, H)
    return c
  }

  private applyShoulderMask(image: HTMLImageElement): HTMLCanvasElement {
    const W = image.width
    const H = image.height

    const scan = document.createElement('canvas')
    scan.width = W
    scan.height = H
    const sCtx = scan.getContext('2d')!
    sCtx.drawImage(image, 0, 0, W, H)
    const { data } = sCtx.getImageData(0, 0, W, H)

    let top = H, bottom = 0, left = W, right = 0
    const threshold = 10
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const a = data[(y * W + x) * 4 + 3]
        if (a > threshold) {
          if (y < top) top = y
          if (y > bottom) bottom = y
          if (x < left) left = x
          if (x > right) right = x
        }
      }
    }

    if (bottom < top) {
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      return c
    }

    const bottomMargin = H - 1 - bottom
    const pad = bottomMargin

    const clipTop = Math.max(top - pad, 0)
    const clipBottom = Math.min(bottom + pad, H - 1)
    const clipLeft = Math.max(left - pad, 0)
    const clipRight = Math.min(right + pad, W - 1)

    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d')!

    ctx.beginPath()
    ctx.roundRect(clipLeft, clipTop, clipRight - clipLeft + 1, clipBottom - clipTop + 1, pad * 0.3)
    ctx.clip()

    ctx.drawImage(image, 0, 0, W, H)
    return c
  }

  private onResize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (w === 0 || h === 0) return
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  private tick = () => {
    if (this.disposed) return
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.rafId = requestAnimationFrame(this.tick)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.rafId)
    if (this.resumeTimer) clearTimeout(this.resumeTimer)
    this.controls.dispose()
    this.renderer.dispose()
    this.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      }
    })
    const ro = (this.renderer.domElement as any).__resizeObserver as ResizeObserver | undefined
    if (ro) ro.disconnect()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
