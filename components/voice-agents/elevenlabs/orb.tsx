"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import * as THREE from "three"

export type AgentState = null | "thinking" | "listening" | "talking"

export type OrbProps = {
  colors?: [string, string]
  colorsRef?: RefObject<[string, string]>
  resizeDebounce?: number
  seed?: number
  agentState?: AgentState
  volumeMode?: "auto" | "manual"
  manualInput?: number
  manualOutput?: number
  inputVolumeRef?: RefObject<number>
  outputVolumeRef?: RefObject<number>
  getInputVolume?: () => number
  getOutputVolume?: () => number
  className?: string
}

export function Orb({
  colors = ["#CADCFC", "#A0B9D1"],
  colorsRef,
  resizeDebounce = 100,
  seed,
  agentState = null,
  volumeMode = "auto",
  manualInput,
  manualOutput,
  inputVolumeRef,
  outputVolumeRef,
  getInputVolume,
  getOutputVolume,
  className,
}: OrbProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef({
    colors,
    colorsRef,
    agentState,
    volumeMode,
    manualInput,
    manualOutput,
    inputVolumeRef,
    outputVolumeRef,
    getInputVolume,
    getOutputVolume,
  })
  const [failed, setFailed] = useState(false)

  liveRef.current = {
    colors,
    colorsRef,
    agentState,
    volumeMode,
    manualInput,
    manualOutput,
    inputVolumeRef,
    outputVolumeRef,
    getInputVolume,
    getOutputVolume,
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      })
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping
    } catch {
      setFailed(true)
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100)
    camera.position.z = 5

    const random = splitmix32(seed ?? Math.floor(Math.random() * 2 ** 32))
    const initialColors = liveRef.current.colors
    const offsets = new Float32Array(
      Array.from({ length: 7 }, () => random() * Math.PI * 2)
    )
    const perlinNoiseTexture = createFallbackNoiseTexture(random)
    perlinNoiseTexture.wrapS = THREE.RepeatWrapping
    perlinNoiseTexture.wrapT = THREE.RepeatWrapping
    let disposed = false

    new THREE.TextureLoader().load(
      "https://storage.googleapis.com/eleven-public-cdn/images/perlin-noise.png",
      (texture) => {
        if (disposed) {
          texture.dispose()
          return
        }
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        material.uniforms.uPerlinTexture.value = texture
      }
    )

    const isDark = () => document.documentElement.classList.contains("dark")
    const uniforms = {
      uColor1: new THREE.Uniform(createManagedColor(initialColors[0])),
      uColor2: new THREE.Uniform(createManagedColor(initialColors[1])),
      uOffsets: { value: offsets },
      uPerlinTexture: new THREE.Uniform(perlinNoiseTexture),
      uTime: new THREE.Uniform(0),
      uAnimation: new THREE.Uniform(0.1),
      uInverted: new THREE.Uniform(isDark() ? 1 : 0),
      uInputVolume: new THREE.Uniform(0),
      uOutputVolume: new THREE.Uniform(0),
      uOpacity: new THREE.Uniform(0),
    }
    const geometry = new THREE.CircleGeometry(3.5, 64)
    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader,
      vertexShader,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute("aria-hidden", "true")
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    host.appendChild(renderer.domElement)

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const resize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const { width, height } = host.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }, resizeDebounce)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()

    const themeObserver = new MutationObserver(() => {
      uniforms.uInverted.value = isDark() ? 1 : 0
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    let visible = true
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    intersectionObserver.observe(host)

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const targetColor1 = createManagedColor(initialColors[0])
    const targetColor2 = createManagedColor(initialColors[1])
    let currentInput = 0
    let currentOutput = 0
    let animationSpeed = 0.1
    let previous = performance.now()
    let frameId = 0

    const render = (now: number) => {
      frameId = requestAnimationFrame(render)
      if (!visible) {
        previous = now
        return
      }

      const delta = Math.min((now - previous) / 1000, 0.1)
      previous = now
      const live = liveRef.current
      const liveColors = live.colorsRef?.current ?? live.colors
      if (liveColors[0]) setManagedColor(targetColor1, liveColors[0])
      if (liveColors[1]) setManagedColor(targetColor2, liveColors[1])

      uniforms.uTime.value += reducedMotion ? 0 : delta * 0.5
      uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + delta * 2)

      let targetInput = 0
      let targetOutput = 0.3
      if (live.volumeMode === "manual") {
        targetInput = clamp01(
          live.manualInput ??
            live.inputVolumeRef?.current ??
            live.getInputVolume?.() ??
            0
        )
        targetOutput = clamp01(
          live.manualOutput ??
            live.outputVolumeRef?.current ??
            live.getOutputVolume?.() ??
            0
        )
      } else if (!reducedMotion) {
        const time = uniforms.uTime.value * 2
        if (live.agentState === "listening") {
          targetInput = clamp01(0.55 + Math.sin(time * 3.2) * 0.35)
          targetOutput = 0.45
        } else if (live.agentState === "talking") {
          targetInput = clamp01(0.65 + Math.sin(time * 4.8) * 0.22)
          targetOutput = clamp01(0.75 + Math.sin(time * 3.6) * 0.22)
        } else if (live.agentState === "thinking") {
          const base = 0.38 + 0.07 * Math.sin(time * 0.7)
          const wander =
            0.05 * Math.sin(time * 2.1) * Math.sin(time * 0.37 + 1.2)
          targetInput = clamp01(base + wander)
          targetOutput = clamp01(0.48 + 0.12 * Math.sin(time * 1.05 + 0.6))
        }
      }

      currentInput += (targetInput - currentInput) * 0.2
      currentOutput += (targetOutput - currentOutput) * 0.2
      const targetSpeed = 0.1 + (1 - Math.pow(currentOutput - 1, 2)) * 0.9
      animationSpeed += (targetSpeed - animationSpeed) * 0.12

      uniforms.uAnimation.value += reducedMotion ? 0 : delta * animationSpeed
      uniforms.uInputVolume.value = currentInput
      uniforms.uOutputVolume.value = currentOutput
      uniforms.uColor1.value.lerp(targetColor1, 0.08)
      uniforms.uColor2.value.lerp(targetColor2, 0.08)
      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(render)

    const onContextLost = (event: Event) => {
      event.preventDefault()
      setFailed(true)
    }
    renderer.domElement.addEventListener("webglcontextlost", onContextLost)

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost)
      geometry.dispose()
      material.dispose()
      const loadedTexture = material.uniforms.uPerlinTexture
        .value as THREE.Texture
      loadedTexture.dispose()
      if (loadedTexture !== perlinNoiseTexture) perlinNoiseTexture.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [resizeDebounce, seed])

  return (
    <div
      ref={hostRef}
      className={className ?? "relative h-full w-full"}
      data-orb-renderer={failed ? "fallback" : "webgl"}
    >
      {failed ? (
        <div
          aria-hidden
          className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--background),#cadcfc_38%,#a0b9d1_72%,transparent_73%)]"
        />
      ) : null}
    </div>
  )
}

function splitmix32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x9e3779b9) | 0
    let t = a ^ (a >>> 16)
    t = Math.imul(t, 0x21f0aaad)
    t = t ^ (t >>> 15)
    t = Math.imul(t, 0x735a2d97)
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296
  }
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

function createManagedColor(value: string) {
  return setManagedColor(new THREE.Color(), value)
}

function setManagedColor(color: THREE.Color, value: string) {
  color.set(value)
  if (THREE.ColorManagement.legacyMode) color.convertSRGBToLinear()
  return color
}

function createFallbackNoiseTexture(random: () => number) {
  const size = 32
  const pixels = new Uint8Array(size * size * 4)
  const phases = Array.from({ length: 6 }, () => random() * Math.PI * 2)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = (x / size) * Math.PI * 2
      const py = (y / size) * Math.PI * 2
      const noise =
        0.5 +
        0.2 * Math.sin(px + phases[0]) * Math.cos(py + phases[1]) +
        0.12 * Math.sin(px * 2 + py + phases[2]) +
        0.08 * Math.cos(px - py * 3 + phases[3]) +
        0.05 * Math.sin(px * 4 + phases[4]) * Math.cos(py * 4 + phases[5])
      const value = Math.round(clamp01(noise) * 255)
      const offset = (y * size + x) * 4
      pixels[offset] = value
      pixels[offset + 1] = value
      pixels[offset + 2] = value
      pixels[offset + 3] = 255
    }
  }
  const texture = new THREE.DataTexture(
    pixels,
    size,
    size,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  )
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
const vertexShader = /* glsl */ `
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffsets[7];
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

const float PI = 3.14159265358979323846;

// Draw a single oval with soft edges and calculate its gradient color
bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 color) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);

    float edge = smoothstep(1.0, 1.0 - softness, oval);

    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        // Flatten gradient toward middle value for more uniform appearance
        gradient = mix(0.5, gradient, 0.1);
        color = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    return false;
}

// Map grayscale value to a 4-color ramp (color1, color2, color3, color4)
vec3 colorRamp(float grayscale, vec3 color1, vec3 color2, vec3 color3, vec3 color4) {
    if (grayscale < 0.33) {
        return mix(color1, color2, grayscale * 3.0);
    } else if (grayscale < 0.66) {
        return mix(color2, color3, (grayscale - 0.33) * 3.0);
    } else {
        return mix(color3, color4, (grayscale - 0.66) * 3.0);
    }
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// 2D noise for the ring
float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );

    return 0.5 + 0.5 * n;
}

float sharpRing(vec3 decomposed, float time) {
    float ringStart = 1.0;
    float ringWidth = 0.3;
    float noiseScale = 5.0;

    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );

    noise = (noise - 0.5) * 2.5;

    return ringStart + noise * ringWidth * 1.5;
}

float smoothRing(vec3 decomposed, float time) {
    float ringStart = 0.9;
    float ringWidth = 0.2;
    float noiseScale = 6.0;

    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );

    noise = (noise - 0.5) * 5.0;

    return ringStart + noise * ringWidth;
}

float flow(vec3 decomposed, float time) {
    return mix(
        texture(uPerlinTexture, vec2(time, decomposed.x / 2.0)).r,
        texture(uPerlinTexture, vec2(time, decomposed.y / 2.0)).r,
        decomposed.z
    );
}

void main() {
    // Normalize vUv to be centered around (0.0, 0.0)
    vec2 uv = vUv * 2.0 - 1.0;

    // Convert uv to polar coordinates
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI; // Normalize theta to [0, 2*PI]

    // Decomposed angle is used for sampling noise textures without seams:
    // float noise = mix(sample(decomposed.x), sample(decomposed.y), decomposed.z);
    vec3 decomposed = vec3(
        // angle in the range [0, 1]
        theta / (2.0 * PI),
        // angle offset by 180 degrees in the range [1, 2]
        mod(theta / (2.0 * PI) + 0.5, 1.0) + 1.0,
        // mixing factor between two noises
        abs(theta / PI - 1.0)
    );

    // Add noise to the angle for a flow-like distortion (reduced for flatter look)
    float noise = flow(decomposed, radius * 0.03 - uAnimation * 0.2) - 0.5;
    theta += noise * mix(0.08, 0.25, uOutputVolume);

    // Initialize the base color to white
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

    // Original parameters for the ovals in polar coordinates
    float originalCenters[7] = float[7](0.0, 0.5 * PI, 1.0 * PI, 1.5 * PI, 2.0 * PI, 2.5 * PI, 3.0 * PI);

    // Parameters for the animated centers in polar coordinates
    float centers[7];
    for (int i = 0; i < 7; i++) {
        centers[i] = originalCenters[i] + 0.5 * sin(uTime / 20.0 + uOffsets[i]);
    }

    float a, b;
    vec4 ovalColor;

    // Check if the pixel is inside any of the ovals
    for (int i = 0; i < 7; i++) {
        float noise = texture(uPerlinTexture, vec2(mod(centers[i] + uTime * 0.05, 1.0), 0.5)).r;
        a = 0.5 + noise * 0.3; // Increased for more coverage
        b = noise * mix(3.5, 2.5, uInputVolume); // Increased height for fuller appearance
        bool reverseGradient = (i % 2 == 1); // Reverse gradient for every second oval

        // Calculate the distance in polar coordinates
        float distTheta = min(
            abs(theta - centers[i]),
            min(
                abs(theta + 2.0 * PI - centers[i]),
                abs(theta - 2.0 * PI - centers[i])
            )
        );
        float distRadius = radius;

        float softness = 0.6; // Increased softness for flatter, less pronounced edges

        // Check if the pixel is inside the oval in polar coordinates
        if (drawOval(vec2(distTheta, distRadius), vec2(0.0, 0.0), a, b, reverseGradient, softness, ovalColor)) {
            // Blend the oval color with the existing color
            color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
            color.a = max(color.a, ovalColor.a); // Max alpha
        }
    }
    
    // Calculate both noisy rings
    float ringRadius1 = sharpRing(decomposed, uTime * 0.1);
    float ringRadius2 = smoothRing(decomposed, uTime * 0.1);
    
    // Adjust rings based on input volume (reduced for flatter appearance)
    float inputRadius1 = radius + uInputVolume * 0.2;
    float inputRadius2 = radius + uInputVolume * 0.15;
    float opacity1 = mix(0.2, 0.6, uInputVolume);
    float opacity2 = mix(0.15, 0.45, uInputVolume);

    // Blend both rings
    float ringAlpha1 = (inputRadius2 >= ringRadius1) ? opacity1 : 0.0;
    float ringAlpha2 = smoothstep(ringRadius2 - 0.05, ringRadius2 + 0.05, inputRadius1) * opacity2;
    
    float totalRingAlpha = max(ringAlpha1, ringAlpha2);
    
    // Apply screen blend mode for combined rings
    vec3 ringColor = vec3(1.0); // White ring color
    color.rgb = 1.0 - (1.0 - color.rgb) * (1.0 - ringColor * totalRingAlpha);

    // Define colours to ramp against greyscale (could increase the amount of colours in the ramp)
    vec3 color1 = vec3(0.0, 0.0, 0.0); // Black
    vec3 color2 = uColor1; // Darker Color
    vec3 color3 = uColor2; // Lighter Color
    vec3 color4 = vec3(1.0, 1.0, 1.0); // White

    // Convert grayscale color to the color ramp
    float luminance = mix(color.r, 1.0 - color.r, uInverted);
    color.rgb = colorRamp(luminance, color1, color2, color3, color4); // Apply the color ramp

    // Apply fade-in opacity
    color.a *= uOpacity;

    gl_FragColor = color;
}
`
