import {
  BoxGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * "The living grid" — a field of tiles that breathes like a data grid in
 * motion and rises under the cursor. One draw call: every tile is an instance
 * and all movement is computed in the vertex shader.
 */

export interface Palette {
  bg: string
  top: string
  topHi: string
  side: string
  accent: string
}

export const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: { bg: '#0a0b0d', top: '#222730', topHi: '#414a58', side: '#0c0d10', accent: '#c6f24e' },
  light: { bg: '#f1eee6', top: '#f7f5ef', topHi: '#ffffff', side: '#cbc5b6', accent: '#2337e0' },
}

export interface HeroSceneApi {
  setPalette: (palette: Palette, immediate?: boolean) => void
  setActive: (active: boolean) => void
  dispose: () => void
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  attribute vec2 aOffset;
  attribute float aRand;
  varying float vHeight;
  varying float vPick;
  varying float vY;
  varying float vGlow;
  varying float vDist;
  varying vec3 vNormal;

  float field(vec2 p) {
    float t = uTime * 0.32;
    float h = sin(p.x * 0.21 + t) * cos(p.y * 0.18 - t * 0.8) * 1.1;
    h += sin((p.x + p.y) * 0.105 + t * 0.6) * 0.9;
    h += sin(length(p * vec2(0.8, 1.0)) * 0.33 - t * 1.3) * 0.55;
    return h;
  }

  void main() {
    float d = distance(aOffset, uPointer);
    float bump = exp(-d * d * 0.05) * uPointerStrength;
    float wave = max(0.0, field(aOffset) * 0.5 + 0.85);
    float jitter = 0.5 + 0.5 * sin(uTime * 0.7 + aRand * 6.2831);
    float height = 0.2 + wave * 1.15 + jitter * 0.35 * wave + bump * 2.2;

    // A few cells light up as a wave crest passes — like selected cells in a data grid.
    vPick = step(0.9, aRand) * smoothstep(1.25, 1.9, wave) * (0.55 + 0.45 * jitter);

    // Intro: tiles rise outward from the centre.
    float k = clamp(uIntro * 2.4 - length(aOffset) / 46.0, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    height = mix(0.04, height, k);

    vec3 p = position;
    p.xz *= 0.84;
    p.y *= height;
    p.x += aOffset.x;
    p.z += aOffset.y;

    vHeight = height;
    vY = position.y;
    vGlow = bump * k;
    vPick *= k;
    vNormal = normal;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uTop;
  uniform vec3 uTopHi;
  uniform vec3 uSide;
  uniform vec3 uAccent;
  uniform float uFogNear;
  uniform float uFogFar;
  varying float vHeight;
  varying float vPick;
  varying float vY;
  varying float vGlow;
  varying float vDist;
  varying vec3 vNormal;

  void main() {
    float isTop = step(0.5, vNormal.y);
    float heightN = clamp(vHeight / 3.0, 0.0, 1.0);
    float accent = clamp(vPick + vGlow * 1.1, 0.0, 1.0);

    vec3 top = mix(uTop, uTopHi, heightN);
    top = mix(top, uAccent, accent);

    float facing = abs(vNormal.x) > 0.5 ? 1.0 : 0.78;
    vec3 side = mix(uSide, uTop, vY * 0.55) * facing;
    side = mix(side, uAccent, accent * 0.4 * vY);

    vec3 color = mix(side, top, isTop);
    float fog = smoothstep(uFogNear, uFogFar, vDist);
    gl_FragColor = vec4(mix(color, uBg, fog), 1.0);
  }
`

export function createHeroScene(canvas: HTMLCanvasElement, initial: Palette, reducedMotion: boolean): HeroSceneApi {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(36, 1, 0.1, 120)

  const isSmall = () => window.innerWidth < 820
  const cols = isSmall() ? 40 : 96
  const rows = isSmall() ? 52 : 64

  const box = new BoxGeometry(1, 1, 1)
  box.translate(0, 0.5, 0)
  const geometry = new InstancedBufferGeometry()
  geometry.index = box.index
  geometry.setAttribute('position', box.getAttribute('position'))
  geometry.setAttribute('normal', box.getAttribute('normal'))
  const offsets = new Float32Array(cols * rows * 2)
  const rands = new Float32Array(cols * rows)
  let n = 0
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      offsets[n++] = x - (cols - 1) / 2
      offsets[n++] = z - (rows - 1) / 2
      rands[n / 2 - 1] = Math.random()
    }
  }
  geometry.setAttribute('aOffset', new InstancedBufferAttribute(offsets, 2))
  geometry.setAttribute('aRand', new InstancedBufferAttribute(rands, 1))
  geometry.instanceCount = cols * rows

  const uniforms = {
    uTime: { value: reducedMotion ? 14 : 0 },
    uIntro: { value: reducedMotion ? 1 : 0 },
    uPointer: { value: new Vector2(4, 2) },
    uPointerStrength: { value: 0 },
    uBg: { value: new Color(initial.bg) },
    uTop: { value: new Color(initial.top) },
    uTopHi: { value: new Color(initial.topHi) },
    uSide: { value: new Color(initial.side) },
    uAccent: { value: new Color(initial.accent) },
    uFogNear: { value: 20 },
    uFogFar: { value: 54 },
  }
  const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader })
  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  scene.add(mesh)

  const target = {
    bg: new Color(initial.bg),
    top: new Color(initial.top),
    topHi: new Color(initial.topHi),
    side: new Color(initial.side),
    accent: new Color(initial.accent),
  }

  // Pointer → point on the grid plane.
  const raycaster = new Raycaster()
  const plane = new Plane(new Vector3(0, 1, 0), -1)
  const ndc = new Vector2()
  const hit = new Vector3()
  const pointerTarget = new Vector2(4, 2)
  const parallax = new Vector2()
  const parallaxTarget = new Vector2()
  let pointerStrengthTarget = 0

  const lookAt = new Vector3()

  function layout() {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    const small = isSmall()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = small ? 44 : 34
    // Shift the composition so the copy has calm space: right on desktop, down on mobile.
    if (small) camera.setViewOffset(w, h, 0, -h * 0.36, w, h)
    else camera.setViewOffset(w, h, -w * 0.17, -h * 0.06, w, h)
    camera.updateProjectionMatrix()
  }

  function placeCamera() {
    const scroll = Math.min(Math.max(window.scrollY / Math.max(window.innerHeight, 1), 0), 1.2)
    const small = isSmall()
    camera.position.set(parallax.x * 1.8, (small ? 15 : 11.5) + scroll * 7 - parallax.y * 0.8, (small ? 36 : 27) - scroll * 3)
    lookAt.set(parallax.x * 0.5, 0.6, 2 - scroll * 5)
    camera.lookAt(lookAt)
  }

  function render() {
    placeCamera()
    renderer.render(scene, camera)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const rect = canvas.getBoundingClientRect()
    const inside = e.clientY >= rect.top && e.clientY <= rect.bottom
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    parallaxTarget.set(ndc.x, ndc.y)
    raycaster.setFromCamera(ndc, camera)
    if (inside && raycaster.ray.intersectPlane(plane, hit)) {
      pointerTarget.set(hit.x, hit.z)
      pointerStrengthTarget = 1
    } else {
      pointerStrengthTarget = 0
    }
  }
  const onPointerLeave = () => {
    pointerStrengthTarget = 0
  }

  let raf = 0
  let running = false
  let last = 0

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    uniforms.uTime.value += dt
    uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + dt / 2.2)
    uniforms.uPointer.value.lerp(pointerTarget, 0.09)
    uniforms.uPointerStrength.value += (pointerStrengthTarget - uniforms.uPointerStrength.value) * 0.06
    parallax.lerp(parallaxTarget, 0.045)
    uniforms.uBg.value.lerp(target.bg, 0.09)
    uniforms.uTop.value.lerp(target.top, 0.09)
    uniforms.uTopHi.value.lerp(target.topHi, 0.09)
    uniforms.uSide.value.lerp(target.side, 0.09)
    uniforms.uAccent.value.lerp(target.accent, 0.09)
    render()
    raf = requestAnimationFrame(frame)
  }

  function setActive(active: boolean) {
    if (reducedMotion) return
    if (active && !running) {
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    } else if (!active && running) {
      running = false
      cancelAnimationFrame(raf)
    }
  }

  function setPalette(palette: Palette, immediate = false) {
    target.bg.set(palette.bg)
    target.top.set(palette.top)
    target.topHi.set(palette.topHi)
    target.side.set(palette.side)
    target.accent.set(palette.accent)
    if (immediate || reducedMotion) {
      uniforms.uBg.value.copy(target.bg)
      uniforms.uTop.value.copy(target.top)
      uniforms.uTopHi.value.copy(target.topHi)
      uniforms.uSide.value.copy(target.side)
      uniforms.uAccent.value.copy(target.accent)
      render()
    }
  }

  const onResize = () => {
    layout()
    if (!running) render()
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas)
  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
  }

  layout()
  render()

  return {
    setPalette,
    setActive,
    dispose() {
      running = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      geometry.dispose()
      box.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
