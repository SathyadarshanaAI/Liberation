/* ---------------------------------------------------------
   PALM ANALYSIS ENGINE
----------------------------------------------------------*/

export function palmAnalysis(lines) {
  return `
LIFE LINE   : ${lines.life}
HEAD LINE   : ${lines.head}
HEART LINE  : ${lines.heart}
FATE LINE   : ${lines.fate}
SUN LINE    : ${lines.sun}
MERCURY     : ${lines.mercury}
MARS LINE   : ${lines.mars}
MANIKANDA   : ${lines.manikanda}
  `;
}
