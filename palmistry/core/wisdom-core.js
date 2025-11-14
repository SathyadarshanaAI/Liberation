/* ---------------------------------------------------------
   WISDOM CORE — THE SEED Memory System
----------------------------------------------------------*/

export const WisdomCore = {
  stash: {},

  setPalmistry(key, data) {
    this.stash[key] = data;
  },

  getPalmistry(key) {
    return this.stash[key] || null;
  }
};
