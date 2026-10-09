import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { startLabStopwatch } from './labStopwatch'

/**
 * The stopwatch, which only exists in this repository.
 *
 * It watches from outside: a press on a day, the sheet appearing, the animations stopping,
 * and a line written into Settings. Every one of those is a thing that can quietly stop
 * being true when the application moves, and the failure would look like a measurement
 * saying nothing happened.
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

  it('times the first day sheet and writes it where it can be read', async () => {
    startLabStopwatch()

    openADay()
    await vi.advanceTimersByTimeAsync(100)
    openSettings()
    await vi.advanceTimersByTimeAsync(100)

    expect(line()).toMatch(/first day sheet \d+ ms/)
  })

  it('says so plainly while it has nothing to say', async () => {
    startLabStopwatch()

    openSettings()
    await vi.advanceTimersByTimeAsync(100)

    // Not an empty line and not a zero: "not yet" is the difference between a measurement
    // that has not happened and one that came out at nothing.
    expect(line()).toContain('not yet')
  })

  it('waits for the page before it starts, rather than dying on it', () => {
    const body = document.body
    Object.defineProperty(document, 'body', { value: null, configurable: true })

    expect(() => startLabStopwatch()).not.toThrow()

    Object.defineProperty(document, 'body', { value: body, configurable: true })
  })
})
