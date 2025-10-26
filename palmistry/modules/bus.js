const listeners=new Map();
export function on(t,fn){
  if(!listeners.has(t))listeners.set(t,new Set());
  listeners.get(t).add(fn);
}
export function emit(t,p){listeners.get(t)?.forEach(fn=>fn(p));}
