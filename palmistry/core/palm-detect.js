/* ---------------------------------------------------------
   SIMPLE PALM DETECTION STUB (SAFE)
----------------------------------------------------------*/

export function detectPalm(frame) {
  return {
    width: frame.width,
    height: frame.height,
    center: { x: frame.width / 2, y: frame.height / 2 }
  };
}
