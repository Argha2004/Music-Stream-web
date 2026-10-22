/**
 * PixelBackground
 *
 * Implements Google Pixel / Android Material You ambient visual language:
 * - Dynamic Monet ambient mesh gradient glows (Sage mint, warm clay amber, sky blue, rose)
 * - Signature Pixel geometric vector floating shapes:
 *   1. Iconic 4-bulb Material You clock & widget flower shape
 *   2. Concentric "Now Playing" ambient audio recognition radar rings
 *   3. Asymmetric organic pebble shape (Pixel weather widget)
 *   4. Translucent Material You glass pill capsule
 *   5. Pixel 4-point diamond starburst
 *   6. Minimal hardware dot matrix accent
 *
 * Designed with pointer-events-none, low opacity, and GPU-accelerated float drift
 * so it never distracts or interferes with contrast, text, or click interactions.
 */

export default function PixelBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* =========================================================================
          1. DYNAMIC AMBIENT MONET COLOR BLOBS (Mesh gradient blooms)
      ========================================================================= */}

      {/* Top-Right: Botanical Sage / Mint Bloom (Pixel Sorta Seafoam / Lemongrass) */}
      <div
        className="absolute -top-28 -right-28 w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] 
                   rounded-full bg-gradient-to-br from-emerald-400/22 via-teal-300/15 to-transparent 
                   dark:from-emerald-500/14 dark:via-teal-700/8 dark:to-transparent 
                   blur-[90px] sm:blur-[135px] animate-pixel-pulse-slow will-change-transform"
      />

      {/* Top-Left / Hero: Soft Warm Amber Glow (Pixel Kinda Coral / Hazel warm tone) */}
      <div
        className="absolute top-10 -left-24 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] 
                   rounded-full bg-gradient-to-tr from-amber-300/16 via-orange-300/10 to-transparent 
                   dark:from-amber-500/8 dark:via-orange-900/5 dark:to-transparent 
                   blur-[85px] sm:blur-[125px] animate-pixel-pulse-slow will-change-transform"
        style={{ animationDelay: '-4s' }}
      />

      {/* Mid-Right: Calm Sky / Cyan Wash (Pixel Bay / Sky) */}
      <div
        className="absolute top-[42%] -right-36 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] 
                   rounded-full bg-gradient-to-bl from-sky-400/15 via-indigo-300/10 to-transparent 
                   dark:from-sky-600/9 dark:via-indigo-950/6 dark:to-transparent 
                   blur-[100px] sm:blur-[140px] animate-pixel-pulse-slow will-change-transform"
        style={{ animationDelay: '-8s' }}
      />

      {/* Bottom-Left: Soft Emerald Moss Glow */}
      <div
        className="absolute bottom-10 -left-28 w-[350px] sm:w-[520px] h-[350px] sm:h-[520px] 
                   rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent 
                   dark:from-emerald-900/12 dark:via-teal-950/6 dark:to-transparent 
                   blur-[100px] sm:blur-[140px] animate-pixel-pulse-slow will-change-transform"
        style={{ animationDelay: '-6s' }}
      />


      {/* =========================================================================
          2. ICONIC PIXEL GEOMETRIC FLOATING SHAPES
      ========================================================================= */}

      {/* Shape A: Iconic Material You 4-Bulb Flower Widget (Top-Right near Hero) */}
      <div className="absolute top-24 right-[5%] sm:right-[10%] hidden sm:block animate-pixel-spin-slow">
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 sm:w-32 sm:h-32 text-primary/14 dark:text-primary/20"
        >
          {/* Overlapping rounded petals creating the iconic Pixel clock shape */}
          <rect x="25" y="25" width="50" height="50" rx="16" fill="currentColor" opacity="0.35" />
          <circle cx="50" cy="22" r="22" fill="currentColor" opacity="0.25" />
          <circle cx="50" cy="78" r="22" fill="currentColor" opacity="0.25" />
          <circle cx="22" cy="50" r="22" fill="currentColor" opacity="0.25" />
          <circle cx="78" cy="50" r="22" fill="currentColor" opacity="0.25" />
          <circle cx="50" cy="50" r="8" fill="var(--color-primary)" opacity="0.45" />
        </svg>
      </div>

      {/* Shape B: Pixel "Now Playing" Ambient Sound Radar Rings (Top-Left) */}
      <div className="absolute top-36 left-[3%] sm:left-[5%] hidden xs:block animate-pixel-float-1">
        <svg
          viewBox="0 0 120 120"
          className="w-20 h-20 sm:w-28 sm:h-28 text-ink-3/20 dark:text-ink-3/16"
        >
          <circle cx="60" cy="60" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
          <circle cx="60" cy="60" r="32" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" fill="none" opacity="0.3" />
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
          <circle cx="60" cy="60" r="4" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      {/* Shape C: Material You Glass Pill Capsule with Sound Dot (Mid-Right) */}
      <div className="absolute top-[46%] right-[4%] sm:right-[7%] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 dark:border-primary/25 bg-card/40 dark:bg-card/25 backdrop-blur-2xs -rotate-12 animate-pixel-float-2 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary/60 select-none">
          Material You
        </span>
      </div>

      {/* Shape D: Organic Pebble / Fluid Squircle Shape (Mid-Left) */}
      <div className="absolute top-[52%] left-[4%] sm:left-[6%] hidden lg:block animate-pixel-float-1">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-[42%_58%_70%_30%_/_45%_52%_48%_55%] 
                     border border-rule/80 dark:border-rule/50 bg-card-subtle/35 dark:bg-card-subtle/20 
                     backdrop-blur-2xs rotate-45 shadow-2xs"
        />
      </div>

      {/* Shape E: Pixel 4-Point Diamond Starburst (Lower-Right) */}
      <div className="absolute bottom-40 right-[7%] sm:right-[12%] hidden sm:block animate-pixel-float-2">
        <svg
          viewBox="0 0 80 80"
          className="w-10 h-10 sm:w-14 sm:h-14 text-primary/18 dark:text-primary/25"
        >
          <path
            d="M40 0 C40 22 58 40 80 40 C58 40 40 58 40 80 C40 58 22 40 0 40 C22 40 40 22 40 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Shape F: Subtle Micro Dot Matrix (Top-Center / Subtle Hardware Detail) */}
      <div className="absolute top-28 left-[50%] -translate-x-1/2 hidden xl:grid grid-cols-4 gap-3 opacity-20 dark:opacity-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-primary" />
        ))}
      </div>
    </div>
  )
}
