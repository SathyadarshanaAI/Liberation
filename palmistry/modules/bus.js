// modules/bus.js — Ultra Light Event Bus for Sathyadarshana Modular Core
const listeners = new Map(); // topic -> Set<functions>

export function on(topic, fn) {
  if (!listeners.has(topic)) listeners.set(topic, new Set());
  listeners.get(topic).add(fn);
  return () => off(topic, fn); // unsubscribe handler
}

export function off(topic, fn) {
  if (listeners.has(topic)) listeners.get(topic).delete(fn);
}

export function emit(topic, payload) {
  if (listeners.has(topic)) {
    listeners.get(topic).forEach(fn => {
      try { fn(payload); } 
      catch (e) { console.warn("Bus handler error:", e); }
    });
  }
}
