/**
 * A stopwatch for the lab, and for one question: why is the first day sheet slow?
 *
 * Henfry: the first time a sheet opens it drags, and every time after that it is fine.
 * It does not reproduce in Chromium, where three openings measured 433, 368 and 410 ms
 * and fetched nothing at all, so the cause is something the Android webview does and the
 * desktop engine does not.
 *
 * The one piece of asynchronous work on that path is registering the back-button
 * listener, which is a round trip to the native side. It happens on every opening, so by
 * itself it does not explain a first one being slower; what might is the first call
 * setting the plugin channel up. This measures both and writes them where somebody can
 * read them on the phone, with no cable and no devtools.
 *
 * It exists in this repository and must never exist in henfrydls/daylo.
 */
type Clock = { firstInvoke: number | null; firstOpen: number | null; startedAt: number | null }

const clock: Clock = { firstInvoke: null, firstOpen: null, startedAt: null }

function watchTheBridge(): void {
  const w = window as unknown as {
    __TAURI_INTERNALS__?: { invoke?: (...args: never[]) => unknown }
  }
  const internals = w.__TAURI_INTERNALS__
  if (!internals || typeof internals.invoke !== 'function') return
  const real = internals.invoke.bind(internals)
  internals.invoke = ((command: string, ...rest: never[]) => {
    const asked = performance.now()
    const answer = real(command as never, ...rest)
    if (clock.firstInvoke === null && String(command).startsWith('plugin:app|register')) {
      void Promise.resolve(answer).finally(() => {
        clock.firstInvoke = Math.round(performance.now() - asked)
        show()
      })
    }
    return answer
  }) as typeof internals.invoke
}

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
  const say = (n: number | null) => (n === null ? 'not yet' : n + ' ms')
  const words =
    'Lab stopwatch: first plugin call ' +
    say(clock.firstInvoke) +
    ', first day sheet ' +
    say(clock.firstOpen) +
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

export function startLabStopwatch(): void {
  // The body may not be there yet, depending on where this ends up in the bundle, and an
  // observer given null throws and takes the whole stopwatch with it. A measuring device
  // that fails silently is worse than no measuring device: it reads "not yet" for ever and
  // somebody concludes the thing being measured did not happen.
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => startLabStopwatch(), { once: true })
    return
  }
  watchTheBridge()
  watchTheTap()
  watchTheSheet()
  new MutationObserver(() => show()).observe(document.body, { childList: true, subtree: true })
}
