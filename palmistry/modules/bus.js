const listeners = new Map();
export function on(topic, fn){
  if(!listeners.has(topic)) listeners.set(topic,new Set());
  listeners.get(topic).add(fn);
}
export function off(topic, fn){
  listeners.get(topic)?.delete(fn);
}
export function emit(topic, payload){
  listeners.get(topic)?.forEach(fn=>{
    try{ fn(payload); }catch(e){ console.warn("bus handler error",e); }
  });
}
