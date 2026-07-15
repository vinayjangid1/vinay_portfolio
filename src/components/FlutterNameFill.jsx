import HoverPaintBrand from './HoverPaintBrand'

/**
 * Giant "FLUTTER" + "FULL STACK DEVELOPER" band with hover paint.
 */
export default function FlutterNameFill() {
  return (
    <section
      aria-label="Flutter — Full Stack Developer"
      className="relative overflow-hidden border-y border-white/5 py-10 md:py-16"
    >
      <HoverPaintBrand variant="section" />
    </section>
  )
}
