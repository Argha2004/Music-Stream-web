/**
 * The site's signature motif: a row of equalizer bars.
 *
 * This replaces the old blurred "aurora" blobs. It is deliberately cheap —
 * each bar animates only `transform: scaleY`, which the compositor handles on
 * the GPU with no layout or paint. A dozen thin bars cost effectively nothing,
 * where three `blur-3xl` blobs animating forever did not.
 *
 * `prefers-reduced-motion` is honoured globally in index.css (the bars freeze
 * at a varied static height), so no per-instance guard is needed here.
 */

// A fixed, musical-looking height pattern so the bars never read as a uniform
// comb. Values are the resting scaleY; the animation lifts each to full height.
const PATTERN = [0.4, 0.75, 0.55, 1, 0.65, 0.9, 0.45, 0.8, 0.6, 0.95, 0.5, 0.7]

export default function Waveform({
  bars = 12,
  className = '',
  barClassName = 'bg-accent',
  animated = true,
  height = 40,
  gap = 3,
  barWidth = 3,
}) {
  return (
    <div
      className={`flex items-center ${className}`}
      style={{ height, gap }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const rest = PATTERN[i % PATTERN.length]
        return (
          <span
            key={i}
            className={`inline-block rounded-full ${barClassName}`}
            style={{
              width: barWidth,
              height: '100%',
              transformOrigin: 'center',
              transform: `scaleY(${rest})`,
              animation: animated ? `var(--animate-bar)` : undefined,
              // Stagger so the row ripples rather than pulsing in lockstep.
              animationDelay: `${(i % PATTERN.length) * -0.12}s`,
            }}
          />
        )
      })}
    </div>
  )
}
