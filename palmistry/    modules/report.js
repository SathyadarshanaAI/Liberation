// /Liberation/palmistry/modules/report.js
export function buildInsight({ hand="right", lines={}, meta={} }) {
  // lines: {heart:{score,len,intensity}, ...}
  const bits = [];

  const mk = (name, txt) => bits.push(`<p><b>${name}</b><br>${txt}</p>`);

  // Simple demo rules (replace w/ real heuristics later)
  if (lines.heart?.score >= 0.7) mk("Heart ❤️", "Warm, steady emotions; loyal bonds.");
  else mk("Heart ❤️", "Emotions fluctuate; protect your energy.");

  if (lines.head?.score >= 0.7) mk("Head 💙", "Clear thinking, structured logic.");
  else mk("Head 💙", "Creative but scattered; journal ideas.");

  if (lines.life?.len >= 0.6) mk("Life 💚", "Strong vitality; good recovery.");
  else mk("Life 💚", "Build sleep & hydration routine.");

  if (lines.fate?.score >= 0.6) mk("Fate 💛", "Purposeful career momentum.");
  else mk("Fate 💛", "Pivot-friendly path; explore options.");

  if (lines.sun?.intensity >= 0.6) mk("Sun 🧡", "Talent visibility rising.");
  else mk("Sun 🧡", "Practice → publish → iterate.");

  if (lines.mercury?.score >= 0.6) mk("Mercury 💜", "Fast learning & communication.");
  else mk("Mercury 💜", "Slow down; verify details.");

  if (lines.marriage?.score >= 0.5) mk("Marriage 💖", "Stable ties; shared goals.");
  else mk("Marriage 💖", "Boundaries & honest chats matter.");

  const hdr = `<p><i>Hand:</i> ${hand[0].toUpperCase()+hand.slice(1)} · v${meta.version||"dev"}</p>`;
  return hdr + bits.join("");
}
