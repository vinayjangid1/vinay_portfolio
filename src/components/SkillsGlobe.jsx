import { useEffect, useMemo, useRef, useState } from 'react'
import TechLogo from './TechLogo'
import data from '../data.json'

function fibonacciSphere(count) {
  const points = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    })
  }
  return points
}

/** Identity 3×3 */
function matId() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1]
}

function matMul(a, b) {
  const o = new Array(9)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      o[r * 3 + c] =
        a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]
    }
  }
  return o
}

/** Rotate around camera axes — left/right (Y) and top/bottom (X), full 360°. */
function rotX(a) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [1, 0, 0, 0, c, -s, 0, s, c]
}

function rotY(a) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [c, 0, s, 0, 1, 0, -s, 0, c]
}

function applyMat(m, p) {
  return {
    x: m[0] * p.x + m[1] * p.y + m[2] * p.z,
    y: m[3] * p.x + m[4] * p.y + m[5] * p.z,
    z: m[6] * p.x + m[7] * p.y + m[8] * p.z,
  }
}

/** Inverse = transpose for pure rotation. */
function applyMatT(m, p) {
  return {
    x: m[0] * p.x + m[3] * p.y + m[6] * p.z,
    y: m[1] * p.x + m[4] * p.y + m[7] * p.z,
    z: m[2] * p.x + m[5] * p.y + m[8] * p.z,
  }
}

const CONTINENTS = [
  { lat: 0.2, lon: 0.3, rx: 0.55, ry: 0.9, w: 1.1 },
  { lat: 0.85, lon: 0.2, rx: 0.35, ry: 0.45, w: 0.9 },
  { lat: 0.55, lon: 1.5, rx: 1.1, ry: 0.7, w: 1.2 },
  { lat: 0.7, lon: -1.6, rx: 0.9, ry: 0.55, w: 1 },
  { lat: -0.35, lon: -1.1, rx: 0.45, ry: 0.8, w: 0.95 },
  { lat: -0.55, lon: 2.3, rx: 0.4, ry: 0.3, w: 0.85 },
  { lat: 0.15, lon: 1.15, rx: 0.35, ry: 0.55, w: 0.7 },
]

function landValue(lat, lon) {
  let v = -0.15
  for (const c of CONTINENTS) {
    let dLon = lon - c.lon
    while (dLon > Math.PI) dLon -= Math.PI * 2
    while (dLon < -Math.PI) dLon += Math.PI * 2
    const dLat = lat - c.lat
    const e =
      (dLon * dLon) / (c.rx * c.rx) + (dLat * dLat) / (c.ry * c.ry)
    v += c.w * Math.exp(-e * 1.8)
  }
  v += Math.sin(lon * 7 + lat * 5) * 0.04 + Math.sin(lon * 13 - lat * 9) * 0.025
  return v
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

/**
 * Full 360° globe — drag left/right and up/down freely (trackball).
 * Auto-spins left→right when idle.
 */
export default function SkillsGlobe({ size = 420 }) {
  const skills = useMemo(() => {
    const fromSkills = (data.skills || []).map((s) => ({
      name: s.name,
      logo: s.logo,
    }))
    const fromStack = (data.techStack || []).map((t) => ({
      name: t.name,
      logo: t.logo,
    }))
    const seen = new Set()
    return [...fromSkills, ...fromStack].filter((s) => {
      const key = s.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [])

  const basePoints = useMemo(
    () => fibonacciSphere(skills.length),
    [skills.length]
  )

  const canvasRef = useRef(null)
  // Rotation matrix — supports unlimited 360° on every axis
  const matRef = useRef(matMul(rotX(0.35), rotY(0.4)))
  const velRef = useRef({ x: 0, y: 0.0045 }) // x = pitch rate, y = yaw rate
  const draggingRef = useRef(false)
  const lastPtrRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const [projected, setProjected] = useState([])

  const paintSize = Math.min(280, Math.round(size * 0.7))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    const W = paintSize
    const H = paintSize
    canvas.width = W
    canvas.height = H

    const cx = W / 2
    const cy = H / 2
    const R = W * 0.42
    const tagR = size * 0.4
    const img = ctx.createImageData(W, H)
    const buf = img.data

    const tick = () => {
      if (!draggingRef.current) {
        // Auto-spin left → right (yaw); keep any leftover pitch inertia
        velRef.current.y += (0.0045 - velRef.current.y) * 0.02
        velRef.current.x *= 0.96
        if (Math.abs(velRef.current.y) > 0.00005) {
          matRef.current = matMul(rotY(velRef.current.y), matRef.current)
        }
        if (Math.abs(velRef.current.x) > 0.00005) {
          matRef.current = matMul(rotX(velRef.current.x), matRef.current)
        }
      }

      const M = matRef.current

      buf.fill(0)
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const dx = (px - cx) / R
          const dy = (py - cy) / R
          const d2 = dx * dx + dy * dy
          if (d2 > 1) continue

          const nz = Math.sqrt(1 - d2)
          // Screen-space surface point → planet space
          const p = applyMatT(M, { x: dx, y: -dy, z: nz })

          const lat = Math.asin(Math.max(-1, Math.min(1, p.y)))
          const lon = Math.atan2(p.x, p.z)
          const land = landValue(lat, lon)

          const lx = -0.45
          const ly = -0.35
          const lz = 0.82
          const ndotl = Math.max(0, dx * lx + -dy * ly + nz * lz)
          const night = clamp01(ndotl * 1.15)
          const fresnel = Math.pow(1 - nz, 2.2)

          let r
          let g
          let b

          if (land > 0.22) {
            const desert = clamp01(1 - Math.abs(lat) * 2.2) * 0.45
            r = lerp(42, 150, desert)
            g = lerp(110, 120, desert)
            b = lerp(55, 60, desert)
            const elev = clamp01((land - 0.22) * 1.5)
            r = lerp(r, 90, elev * 0.3)
            g = lerp(g, 140, elev * 0.25)
          } else if (land > 0.08) {
            r = 30
            g = 120
            b = 140
          } else {
            const depth = clamp01(-land + 0.1)
            r = lerp(12, 8, depth)
            g = lerp(55, 30, depth)
            b = lerp(120, 70, depth)
            const spec = Math.pow(ndotl, 24) * 180
            r += spec
            g += spec
            b += spec * 0.9
          }

          if (Math.abs(lat) > 1.15) {
            const ice = clamp01((Math.abs(lat) - 1.15) * 4)
            r = lerp(r, 230, ice)
            g = lerp(g, 240, ice)
            b = lerp(b, 250, ice)
          }

          r *= 0.18 + night * 0.82
          g *= 0.18 + night * 0.82
          b *= 0.22 + night * 0.78

          if (night < 0.25 && land > 0.25) {
            const cities =
              Math.max(0, Math.sin(lon * 40) * Math.sin(lat * 35)) * (1 - night)
            r += cities * 40
            g += cities * 25
            b += cities * 8
          }

          r = lerp(r, 120, fresnel * 0.55)
          g = lerp(g, 180, fresnel * 0.55)
          b = lerp(b, 255, fresnel * 0.7)

          const i = (py * W + px) * 4
          buf[i] = Math.min(255, r)
          buf[i + 1] = Math.min(255, g)
          buf[i + 2] = Math.min(255, b)
          buf[i + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)

      // Clouds
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()
      for (let c = 0; c < 16; c++) {
        const ang = c * 1.7
        const elev = ((c * 37) % 100) / 100
        let cp = {
          x: Math.cos(ang) * Math.sin(elev * Math.PI),
          y: Math.cos(elev * Math.PI),
          z: Math.sin(ang) * Math.sin(elev * Math.PI),
        }
        cp = applyMat(M, cp)
        if (cp.z < 0.12) continue
        const sx = cx + cp.x * R
        const sy = cy - cp.y * R
        const cloud = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.18)
        cloud.addColorStop(0, 'rgba(255,255,255,0.2)')
        cloud.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = cloud
        ctx.beginPath()
        ctx.ellipse(sx, sy, R * 0.2, R * 0.1, ang, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      const next = basePoints.map((bp, i) => {
        const p = applyMat(M, bp)
        const depth = (p.z + 1) / 2
        return {
          ...skills[i],
          left: size / 2 + p.x * tagR,
          top: size / 2 - p.y * tagR,
          scale: 0.55 + depth * 0.55,
          opacity: 0.2 + depth * 0.8,
          zIndex: Math.round(p.z * 100),
          front: p.z > 0.05,
        }
      })
      setProjected(next)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [basePoints, skills, size, paintSize])

  const onPointerDown = (e) => {
    draggingRef.current = true
    velRef.current = { x: 0, y: 0 }
    lastPtrRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastPtrRef.current.x
    const dy = e.clientY - lastPtrRef.current.y
    lastPtrRef.current = { x: e.clientX, y: e.clientY }

    // Grab-the-globe: drag right → rotate world left (natural)
    const yaw = -dx * 0.006 // left ↔ right · full 360°
    const pitch = -dy * 0.006 // top ↔ bottom · full 360°

    // Camera-space trackball: apply yaw then pitch (order gives free 360°)
    matRef.current = matMul(rotY(yaw), matRef.current)
    matRef.current = matMul(rotX(pitch), matRef.current)

    velRef.current.y = yaw * 0.55
    velRef.current.x = pitch * 0.55
  }

  const onPointerUp = () => {
    draggingRef.current = false
  }

  return (
    <div
      className="relative mx-auto touch-none select-none"
      style={{ width: size, height: size, maxWidth: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Interactive Earth skills globe — drag left, right, up, or down to rotate 360 degrees"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-80"
        aria-hidden
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              left: `${(i * 47) % 100}%`,
              top: `${(i * 73) % 100}%`,
              opacity: 0.15 + ((i * 13) % 50) / 100,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-[8%] rounded-full"
        style={{
          boxShadow: `
            0 0 40px 6px rgba(80,160,255,0.25),
            0 0 80px 20px rgba(40,100,200,0.12),
            inset 0 0 30px rgba(100,180,255,0.15)
          `,
        }}
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-[8%] h-[84%] w-[84%] rounded-full"
        style={{
          filter: 'contrast(1.05) saturate(1.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-[8%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.2), transparent 32%)',
          mixBlendMode: 'screen',
        }}
      />

      {projected.map((item) => (
        <div
          key={item.name}
          className="absolute flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-lg backdrop-blur-md md:text-xs"
          style={{
            left: item.left,
            top: item.top,
            zIndex: item.zIndex + 50,
            opacity: item.opacity,
            transform: `translate(-50%, -50%) scale(${item.scale})`,
            borderColor: item.front
              ? 'rgba(255,107,0,0.55)'
              : 'rgba(255,255,255,0.1)',
            background: item.front
              ? 'rgba(0,0,0,0.55)'
              : 'rgba(0,0,0,0.35)',
            color: item.front ? '#ffffff' : '#a3a3a3',
            pointerEvents: 'none',
          }}
        >
          {item.logo && (
            <span className="flex h-4 w-4 items-center justify-center">
              <TechLogo logo={item.logo} name={item.name} size={12} />
            </span>
          )}
          {item.name}
        </div>
      ))}

      <p className="pointer-events-none absolute bottom-0 left-0 right-0 text-center text-[10px] tracking-widest text-[#a3a3a3] uppercase md:text-xs">
        Drag any direction · Full 360° spin
      </p>
    </div>
  )
}
