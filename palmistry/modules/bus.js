// modules/bus.js — ultra-light pub/sub for live events
const listeners = new Map(); // topic -> Set<fns>

export function on(topic, fn){
  if(!listeners.has(topic)) listeners.set(topic, new Set());
  listeners.get(topic).add(fn);
  return () => off(topic, fn); // unsubscribe
}

export function off(topic, fn){
  listeners.get(topic)?.delete(fn);
}

export function emit(topic, payload){
  listeners.get(topic)?.forEach(fn => {
    try { fn(payload); } catch(e){ console.warn("bus handler error", e); }
  });
}
