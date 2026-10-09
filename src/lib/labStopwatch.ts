/**
 * A stopwatch for the lab, and for one question: why is the first day sheet slow?
 *
 * Henfry: the first time a sheet opens it drags, and every time after that it is fine. It
 * does not reproduce in Chromium, where three openings measured 433, 368 and 410 ms and
 * fetched nothing at all, so the cause is something the Android webview does and the
 * desktop engine does not. This times it where it happens and writes the number where
 * somebody can read it on the phone, with no cable and no devtools.
 *
 * It measures the opening and nothing else. An earlier version also timed the first call
 * across the Tauri bridge by wrapping `window.__TAURI_INTERNALS__.invoke`. That cannot be
 * done: Tauri defines that property with neither `writable` nor `configurable`, so a
 * module, which is strict, throws on the assignment. It threw while `main.tsx` was being
 * imported, before React had mounted anything, and Daylo opened to a white screen on every
 * launch. The tests missed it because the bridge they simulated was an ordinary writable
 * object: a simulation kinder than the thing it stood for.
 *
 * Hence the shape of what is left. It touches nothing it does not own, it starts after the
 * first render, and it cannot throw out of itself. An instrument is allowed to fail. It is
 * not allowed to take the application with it.
 *
 * It exists in this repository and must never exist in henfrydls/daylo.
 */
type Clock = { firstOpen: number | null; startedAt: number | null }

const clock: Clock = { firstOpen: null, startedAt: null }

/** The tap that is going to open a day, which is the moment the clock starts. */
function watchTheTap(): void {
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (clock.firstOpen !== null) return
      const node = event.target as HTMLElement | null
      if (node?.closest('button[aria-label$="activities completed"]')) {
        clock.startedAt = performance.now()
      }
    },
    true
  )
}

/** The sheet arriving, and then standing still, which is the moment it stops. */
function watchTheSheet(): void {
  new MutationObserver(() => {
    if (clock.firstOpen !== null || clock.startedAt === null) return
    if (!document.querySelector('[data-testid="quicklog-modal"]')) return
    const started = clock.startedAt
    const settled = () => {
      if (document.getAnimations().some((a) => a.playState === 'running')) {
        requestAnimationFrame(settled)
        return
      }
      clock.firstOpen = Math.round(performance.now() - started)
      show()
    }
    requestAnimationFrame(settled)
  }).observe(document.body, { childList: true, subtree: true })
}

/** A line at the bottom of Settings, because that is somewhere to look without a cable. */
function show(): void {
  const into = document.querySelector('[data-testid="settings-scroller"]')
  if (!into) return
  const words =
    'Lab stopwatch: first day sheet ' +
    (clock.firstOpen === null ? 'not yet' : clock.firstOpen + ' ms') +
    '.'

  const id = 'lab-stopwatch'
  const already = document.getElementById(id) as HTMLParagraphElement | null
  // Nothing at all when there is nothing new to say. An observer that hears every change
  // to the page calls this, including the changes made here, so writing the same words
  // again is a loop. The first version of this hung the very test written to prove it
  // worked, which on a phone would have been a stopwatch making the thing it measures
  // slower.
  if (already?.textContent === words) return

  const line = already ?? into.appendChild(Object.assign(document.createElement('p'), { id }))
  line.className = 'py-3 text-sm text-gray-500'
  line.textContent = words
}

function begin(): void {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => begin(), { once: true })
    return
  }
  watchTheTap()
  watchTheSheet()
  new MutationObserver(() => show()).observe(document.body, { childList: true, subtree: true })
}

/**
 * Started after the application has rendered, and unable to throw out of itself.
 *
 * Both of those are one lesson, learnt the hard way: this ran before the first render
 * once, threw, and Daylo never started.
 */
export function startLabStopwatch(): void {
  try {
    setTimeout(() => {
      try {
        begin()
      } catch (error) {
        console.error('[lab] the stopwatch did not start', error)
      }
    }, 0)
  } catch (error) {
    console.error('[lab] the stopwatch could not even be scheduled', error)
  }
}
