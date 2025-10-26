// modules/bus.js
// Simple Pub/Sub Event Bus

const EventBus = (() => {
  const events = {};

  function on(event, handler) {
    if (!events[event]) events[event] = [];
    events[event].push(handler);
  }

  function off(event, handler) {
    if (!events[event]) return;
    events[event] = events[event].filter(h => h !== handler);
  }

  function emit(event, data = {}) {
    if (!events[event]) return;
    for (const handler of events[event]) {
      try {
        handler(data);
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err);
      }
    }
  }

  return { on, off, emit };
})();

export default EventBus;
