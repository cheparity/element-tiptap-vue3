import { ref } from 'vue'

const listeners = new Map()

export const eventBus = {
  on(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, [])
    }
    listeners.get(event).push(callback)
  },
  emit(event, data) {
    if (listeners.has(event)) {
      listeners.get(event).forEach(callback => callback(data))
    }
  }
}
