const isBrowser = typeof window !== 'undefined'

export const LocalStorageEventTarget = isBrowser ? new EventTarget() : (null as unknown as EventTarget)

export function clearLocalStorage() {
  if (!isBrowser) return
  localStorage.clear()
  const clearEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearEvent)
}
