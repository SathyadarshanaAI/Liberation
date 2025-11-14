/* ---------------------------------------------------------
   THE SEED · Wisdom Core Memory Engine v2.0
   Central Knowledge + Long-term Palmistry Storage
----------------------------------------------------------*/

export const WisdomCore = {

  data: {
    palmistry: {},
    karma: {},
    pastlife: {},
    aura: {},
    systemLog: []
  },

  /* Logging */
  log(message) {
    const t = new Date().toISOString();
    this.data.systemLog.push({ time: t, message });
    console.log("🌿 WisdomCore:", message);
  },

  /* SAVE palmistry data */
  setPalmistry(key, value) {
    this.data.palmistry[key] = value;
    this.log(`Palmistry updated → ${key}`);
  },

  /* READ palmistry data */
  getPalmistry(key) {
    return this.data.palmistry[key] || null;
  },

  /* Karma storage */
  setKarma(key, value) {
    this.data.karma[key] = value;
    this.log(`Karma updated → ${key}`);
  },

  getKarma(key) {
    return this.data.karma[key] || null;
  },

  /* Past life */
  setPastLife(key, value) {
    this.data.pastlife[key] = value;
    this.log(`Pastlife updated → ${key}`);
  },

  getPastLife(key) {
    return this.data.pastlife[key] || null;
  },

  /* Aura */
  setAura(key, value) {
    this.data.aura[key] = value;
    this.log(`Aura updated → ${key}`);
  },

  getAura(key) {
    return this.data.aura[key] || null;
  },

  /* Unified Query */
  queryAll(key) {
    return {
      palmistry: this.getPalmistry(key),
      karma: this.getKarma(key),
      pastlife: this.getPastLife(key),
      aura: this.getAura(key)
    };
  }
};
