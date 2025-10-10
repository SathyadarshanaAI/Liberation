// palmistry/modules/report.js
import LAB from "../core/lab-core.js";

export function renderReport(result, containerEl) {
  const m = LAB.getManifest();
  const desc = m?.line_descriptions || {};
  const order = m?.line_order || ["heart","head","life","fate","sun","mercury","marriage"];

  const html = order.map(key => {
    const nice = (desc[key]?.title ?? key).replace(/\b\w/g,c=>c.toUpperCase());
    const summary = desc[key]?.summary ?? "";
    const meas = result.lines?.[key] ?? {};
    const score = (meas.score ?? "—");
    const notes = (meas.notes ?? summary);

    return `<p><b>${nice}</b> · <small>score: ${score}</small><br>${notes}</p>`;
  }).join("");

  containerEl.innerHTML = html;
}
