/**
 * A plotted level trace — the drawing's one piece of instrumentation.
 *
 * On a specification sheet a row of bars is a measured plot, not an ornament,
 * so the bars are square, sit on a baseline rule, and are drawn in line-work
 * blue rather than the accent. Orange is reserved for actions and approvals.
 *
 * Cheap by construction: each bar animates only `transform: scaleY`, which the
 * compositor handles with no layout or paint. `prefers-reduced-motion` is
 * honoured globally in index.css, where the bars freeze at their varied
 * resting heights and still read as a plot.
 */

// A fixed, musical-looking pattern so the row never reads as a uniform comb.
const PATTERN = [0.4, 0.75, 0.55, 1, 0.65, 0.9, 0.45, 0.8, 0.6, 0.95, 0.5, 0.7]

export default function Waveform({
  bars = 12,
  className = '',
  barClassName = 'bg-rule',
  animated = true,
  height = 40,
  gap = 3,
  barWidth = 3,
  baseline = false,
}) {
  return (
    <div
      className={`relative flex items-end ${className}`}
      style={{ height, gap }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const rest = PATTERN[i % PATTERN.length]
        return (
          <span
            key={i}
            className={`inline-block ${barClassName}`}
            style={{
              width: barWidth,
              height: '100%',
              transformOrigin: 'bottom',
              transform: `scaleY(${rest})`,
              animation: animated ? `var(--animate-bar)` : undefined,
              // Stagger so the row ripples rather than pulsing in lockstep.
              animationDelay: `${(i % PATTERN.length) * -0.12}s`,
            }}
          />
        )
      })}

      {/* Every plot sits on a datum. */}
      {baseline && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-rule" />
      )}
    </div>
  )
}
