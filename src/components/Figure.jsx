import { useState } from 'react'

/**
 * One numbered figure of a figure plate.
 *
 * Deliberately draws no container of its own — the plate cell around it
 * supplies the padding and the dividing rule, so figures butt against a shared
 * rule instead of sitting in nested boxes. The only edge here belongs to the
 * print itself.
 *
 * A figure whose file is not on disk yet renders as a hatched cell reading NOT
 * ISSUED rather than a broken image or a blank gap. That is the honest state in
 * this world — the drawing exists, the plate has not been pasted up — and it
 * keeps the sheet's composition identical whether or not every screenshot has
 * landed. `onError` is the only reliable signal: a missing static asset in a
 * SPA returns the index.html fallback with a 200, so the request "succeeds" and
 * only image decoding fails.
 */
export default function Figure({ no, src, alt, caption, priority = false }) {
  const [missing, setMissing] = useState(false)

  return (
    <figure className="m-0 flex min-w-0 flex-col">
      {missing ? (
        <div
          className="hatch flex aspect-[9/19.5] items-center justify-center border border-rule-soft"
          role="img"
          aria-label={`Figure ${no} has not been issued yet`}
        >
          <span className="label bg-sheet-deep px-2 py-1 text-center">Not issued</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={1080}
          height={2340}
          /* All three prints sit in the first viewport, so none of them may be
             lazy — deferring them also defers the onError that swaps in the
             NOT ISSUED cell, which would leave an empty reserved box instead.
             Only the lead print claims high priority. */
          loading="eager"
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setMissing(true)}
          className="block w-full border border-rule-soft"
        />
      )}

      <figcaption className="mt-2.5 flex min-w-0 flex-col gap-1">
        <span className="font-mono text-[0.6875rem] font-bold tracking-[0.18em] text-stamp">
          FIG. {no}
        </span>
        <span className="label leading-[1.5]">{caption}</span>
      </figcaption>
    </figure>
  )
}
