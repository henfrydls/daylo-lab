import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { startLabStopwatch } from './labStopwatch'

/**
 * The stopwatch, which only exists in this repository.
 *
 * It watches from outside: a press on a day, the sheet appearing, the animations stopping,
 * and a line written into Settings. Every one of those can quietly stop being true when
 * the application moves, and the failure would look like a measurement saying nothing
 * happened. The last test is the one that matters most, and it is here because the thing
 * it guards against already happened: this stopped Daylo from starting at all.
 */
describe('the lab stopwatch', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers({ shouldAdvanceTime: true })
    document.getAnimations = () => []
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const openADay = () => {
    const day = document.createElement('button')
    day.setAttribute('aria-label', '2026-10-09, 0 activities completed')
    document.body.appendChild(day)
    day.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    const sheet = document.createElement('div')
    sheet.setAttribute('data-testid', 'quicklog-modal')
    document.body.appendChild(sheet)
  }

  const openSettings = () => {
    const into = document.createElement('div')
    into.setAttribute('data-testid', 'settings-scroller')
    document.body.appendChild(into)
  }

  const line = () => document.getElementById('lab-stopwatch')?.textContent ?? ''

  /**
   * Both halves in one test, because the clock lives in the module: a second test wanting
   * a fresh one needs a second copy of the module, and two copies on one page hear each
   * other's writing and answer it for ever. Asked in order, one test says more anyway.
   */
  it('says what it knows, and then what it measured', async () => {
    startLabStopwatch()
    await vi.advanceTimersByTimeAsync(10)

    openSettings()
    await vi.advanceTimersByTimeAsync(50)
    // Not an empty line and not a zero: "not yet" is the difference between a measurement
    // that has not happened and one that came out at nothing.
    expect(line()).toContain('not yet')

    openADay()
    await vi.advanceTimersByTimeAsync(100)

    expect(line()).toMatch(/first day sheet \d+ ms/)
  })

  /**
   * The one that cost a round.
   *
   * An earlier version wrapped `window.__TAURI_INTERNALS__.invoke` to time the first call
   * across the bridge. Tauri defines that property with neither `writable` nor
   * `configurable`, and a module is strict, so the assignment threw while main.tsx was
   * being imported and the application never mounted: a white screen on every launch.
   *
   * The tests passed because the bridge they simulated was an ordinary object. This one is
   * shaped like the real one, and what it asserts is that the stopwatch does not care.
   */
  it('does not touch a bridge it is not allowed to touch', async () => {
    const internals = {}
    Object.defineProperty(internals, 'invoke', { value: () => Promise.resolve(null) })
    Object.freeze(internals)
    ;(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = internals

    expect(() => startLabStopwatch()).not.toThrow()
    await vi.advanceTimersByTimeAsync(10)

    openADay()
    await vi.advanceTimersByTimeAsync(100)
    openSettings()
    await vi.advanceTimersByTimeAsync(100)

    // Still measuring, with the bridge left exactly as it was found.
    expect(line()).toMatch(/first day sheet \d+ ms/)
    delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__
  })

  it('waits for the page before it starts, rather than dying on it', async () => {
    const body = document.body
    Object.defineProperty(document, 'body', { value: null, configurable: true })

    expect(() => startLabStopwatch()).not.toThrow()
    await vi.advanceTimersByTimeAsync(10)

    Object.defineProperty(document, 'body', { value: body, configurable: true })
  })
})
