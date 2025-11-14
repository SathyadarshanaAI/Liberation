/* ---------------------------------------------------------
   LANG ENGINE — 19 LANGUAGE PACK
----------------------------------------------------------*/

import en from "./packs/en.json" assert { type: "json" };
import si from "./packs/si.json" assert { type: "json" };
import ta from "./packs/ta.json" assert { type: "json" };
import hi from "./packs/hi.json" assert { type: "json" };
import bn from "./packs/bn.json" assert { type: "json" };
import ml from "./packs/ml.json" assert { type: "json" };
import kn from "./packs/kn.json" assert { type: "json" };
import te from "./packs/te.json" assert { type: "json" };
import zh from "./packs/zh.json" assert { type: "json" };
import ja from "./packs/ja.json" assert { type: "json" };
import ar from "./packs/ar.json" assert { type: "json" };
import es from "./packs/es.json" assert { type: "json" };
import de from "./packs/de.json" assert { type: "json" };
import ru from "./packs/ru.json" assert { type: "json" };
import it from "./packs/it.json" assert { type: "json" };
import fr from "./packs/fr.json" assert { type: "json" };
import pl from "./packs/pl.json" assert { type: "json" };
import ro from "./packs/ro.json" assert { type: "json" };
import he from "./packs/he.json" assert { type: "json" };

export const LANG = {
  en, si, ta, hi, bn, ml, kn, te, zh, ja, ar, es,
  de, ru, it, fr, pl, ro, he
};

export function loadLanguages(selectBox) {
  Object.keys(LANG).forEach(code => {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = LANG[code].name;
    selectBox.appendChild(o);
  });
}

export function applyLanguage(code, msgBox) {
  const L = LANG[code].ui;

  msgBox.textContent = `${L.place_hand} ${L.left_right}`;
}
