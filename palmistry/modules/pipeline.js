// modules/pipeline.js
import { extractAllFeatures } from './features.js';
import { loadTeachings, matchRules } from './teachings.js';
import { fuseEvidences, defaultTraitMap } from './fusion.js';
import { saveAnalysis } from './vault.js';

export async function runPipeline({ hand='Right', polylines={}, structures={}, image=null, thumb=null, consent=false, meta={} } = {}) {
  const features  = extractAllFeatures(polylines);
  const rules     = await loadTeachings();
  const evidences = matchRules({ lines: structures.lines||{}, mounts: structures.mounts||{} }, features, rules);
  const fused     = fuseEvidences(evidences, { traitMap: defaultTraitMap() });
  const id        = await saveAnalysis({ hand, image, thumb, structures, features, evidences, fusion: fused, consent, meta });
  return { id, ...fused };
}
