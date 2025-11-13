/* ------------------------------------------------------------
   THE SEED · WISDOM CORE (v1.0)
   Dynamic Knowledge Engine for Palmistry + KP + Numerology + Aura + Nadi  
   Auto-updates every time new rules or patterns are added.
---------------------------------------------------------------*/

export const WisdomCore = {

    // LIVE KNOWLEDGE STORAGE
    data: {
        palmistry: {},
        astrology: {},
        numerology: {},
        aura: {},
        nadi: {},
        updates: []
    },

    // AUTO-UPDATE REGISTER
    updateLog(message) {
        const time = new Date().toISOString();
        this.data.updates.push({ time, message });
        console.log("WISDOM UPDATE:", message);
    },

    /* -------------------------------------------------------
       PALMISTRY DOMAIN
    --------------------------------------------------------*/
    setPalmistry(key, value) {
        this.data.palmistry[key] = value;
        this.updateLog(`Palmistry updated: ${key}`);
    },

    getPalmistry(key) {
        return this.data.palmistry[key] || null;
    },

    /* -------------------------------------------------------
       KP ASTROLOGY DOMAIN
    --------------------------------------------------------*/
    setAstrology(key, value) {
        this.data.astrology[key] = value;
        this.updateLog(`Astrology updated: ${key}`);
    },

    getAstrology(key) {
        return this.data.astrology[key] || null;
    },

    /* -------------------------------------------------------
       NUMEROLOGY DOMAIN
    --------------------------------------------------------*/
    setNumerology(key, value) {
        this.data.numerology[key] = value;
        this.updateLog(`Numerology updated: ${key}`);
    },

    getNumerology(key) {
        return this.data.numerology[key] || null;
    },

    /* -------------------------------------------------------
       AURA DOMAIN
    --------------------------------------------------------*/
    setAura(key, value) {
        this.data.aura[key] = value;
        this.updateLog(`Aura updated: ${key}`);
    },

    getAura(key) {
        return this.data.aura[key] || null;
    },

    /* -------------------------------------------------------
       NADI DOMAIN
    --------------------------------------------------------*/
    setNadi(key, value) {
        this.data.nadi[key] = value;
        this.updateLog(`Nadi updated: ${key}`);
    },

    getNadi(key) {
        return this.data.nadi[key] || null;
    },

    /* -------------------------------------------------------
       UNIVERSAL QUERY ENGINE  
       (This makes the AI dynamically merge knowledge)
    --------------------------------------------------------*/
    queryAll(key) {
        return {
            palmistry: this.getPalmistry(key),
            astrology: this.getAstrology(key),
            numerology: this.getNumerology(key),
            aura: this.getAura(key),
            nadi: this.getNadi(key)
        };
    },

    /* -------------------------------------------------------
       SELF-EVOLVING RULE ENGINE  
    --------------------------------------------------------*/
    applyRule(domain, ruleName, ruleFunction) {
        if (!this.data[domain]) return;

        this.data[domain][ruleName] = ruleFunction;
        this.updateLog(`Rule added to ${domain}: ${ruleName}`);
    },

    executeRule(domain, ruleName, input) {
        if (this.data[domain][ruleName]) {
            return this.data[domain][ruleName](input);
        }
        return null;
    }
};
