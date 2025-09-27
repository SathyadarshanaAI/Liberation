#!/usr/bin/env python3
"""
palmistry_global_v1.py
----------------------
Single-file CLI tool:
 - simple palm-line visualization (OpenCV) (MVP)
 - produce a polished English report (template + basic heuristic)
 - translate that report into a global set of languages
 - save: report_en.txt, report_<lang>.txt for each language and reports_all.json
Usage:
  python3 palmistry_global_v1.py -i /path/to/palm.jpg -o /path/to/out.png --k 6
Dependencies:
  pip install numpy opencv-python googletrans==4.0.0-rc1 deep-translator
  (If googletrans install fails, script will try deep_translator; if offline, it will use fallback templates.)
"""
import argparse, os, sys, json
from datetime import datetime

# Image libs
try:
    import cv2
    import numpy as np
except Exception as e:
    print("ERROR: OpenCV / numpy not available. Install with: pip install numpy opencv-python")
    raise

# Try translators: googletrans preferred, deep_translator fallback
translator = None
use_googletrans = False
use_deep = False
try:
    from googletrans import Translator as GT
    translator = GT()
    use_googletrans = True
except Exception:
    try:
        # deep-translator
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator
        use_deep = True
    except Exception:
        translator = None

# Global languages to produce (codes acceptable to googletrans / deep_translator).
# This list covers many major world languages.
LANGUAGES = {
    "en": "English",
    "si": "Sinhala",
    "ta": "Tamil",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "zh-cn": "Chinese (Simplified)",
    "hi": "Hindi",
    "ar": "Arabic",
    "ja": "Japanese",
    "ru": "Russian",
    "pt": "Portuguese",
    "ko": "Korean",
    "it": "Italian",
    "tr": "Turkish",
    "id": "Indonesian",
    "nl": "Dutch",
    "sv": "Swedish"
}

# Simple "polish" function: small grammar fixes / normalization.
def basic_polish_english(text: str) -> str:
    # This is intentionally lightweight. For production use a grammar API.
    t = text.strip()
    # fix common double-spaces, ensure punctuation spacing
    t = " ".join(t.split())
    t = t.replace(" .", ".").replace(" ,", ",")
    return t

# Translate wrapper with fallbacks
def translate_text(text: str, dest_lang: str) -> str:
    """
    dest_lang e.g. "fr", "zh-cn" (googletrans uses 'zh-cn' as 'zh-CN' in some versions).
    Uses googletrans if available; else deep_translator; else fallback template (English copy with note).
    """
    if dest_lang == "en":
        return basic_polish_english(text)

    # googletrans expects some codes as e.g. 'zh-CN' — normalize
    gt_lang = dest_lang
    if dest_lang.lower() == "zh-cn":
        gt_lang = "zh-cn"

    try:
        if use_googletrans:
            # googletrans may accept 'si', 'ta' etc.
            tr = translator.translate(text, dest=gt_lang)
            return tr.text
        if use_deep:
            # deep_translator's GoogleTranslator takes source and target
            tr = translator(source='auto', target=gt_lang).translate(text)
            return tr
    except Exception as e:
        # swallow and fallback
        pass

    # Fallback: return English text with header noting translation unavailable
    fallback = f"[Translation to {LANGUAGES.get(dest_lang, dest_lang)} unavailable]\n\n{text}"
    return fallback

# SIMPLE palm analysis (MVP) — visuals + basic features
def analyze_image_and_draw(input_path, output_image_path, k=4, resize_height=1200):
    if not os.path.exists(input_path):
        raise FileNotFoundError("Input image not found: " + input_path)

    bgr = cv2.imread(input_path)
    if bgr is None:
        raise RuntimeError("Cannot read input image (cv2.imread returned None)")

    h, w = bgr.shape[:2]
    scale = resize_height / float(h) if h > resize_height else 1.0
    if scale != 1.0:
        bgr = cv2.resize(bgr, (int(w*scale), int(h*scale)), interpolation=cv2.INTER_AREA)

    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    # CLAHE
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)

    # quick ridge enhance using Laplacian + blur
    blur = cv2.GaussianBlur(gray, (7,7), 0)
    lap = cv2.Laplacian(blur, cv2.CV_8U, ksize=3)
    _, th = cv2.threshold(lap, 25, 255, cv2.THRESH_BINARY)

    # clean & skeletonize-like thinning (approx)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    clean = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel, iterations=1)
    clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE, kernel, iterations=1)

    # contours as candidate lines
    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    # sort by area and keep top-k
    contours = sorted(contours, key=lambda c: cv2.contourArea(c), reverse=True)
    candidates = contours[:k]

    overlay = bgr.copy()
    palette = [
        (0,0,255), (0,255,0), (255,0,0), (0,255,255),
        (255,0,255), (255,255,0), (128,255,128), (255,128,128)
    ]
    for idx, c in enumerate(candidates):
        color = palette[idx % len(palette)]
        cv2.drawContours(overlay, [c], -1, color, thickness=2)

    # lighten skeleton overlay
    alpha = 0.6
    out = cv2.addWeighted(overlay, alpha, bgr, 1-alpha, 0)

    ok = cv2.imwrite(output_image_path, out)
    if not ok:
        raise RuntimeError("Failed to write output image: " + output_image_path)

    # produce minimal structured findings
    findings = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "input": os.path.abspath(input_path),
        "output_image": os.path.abspath(output_image_path),
        "num_contours_raw": len(contours),
        "num_candidates": len(candidates)
    }
    return findings, candidates

# Produce a human-readable English report (polished)
def produce_english_report(findings):
    lines = []
    lines.append("Palmistry AI Report")
    lines.append("===================")
    lines.append(f"Input image: {findings['input']}")
    lines.append(f"Result image: {findings['output_image']}")
    lines.append(f"Detected line-like contours (raw): {findings['num_contours_raw']}")
    lines.append(f"Candidate main lines highlighted: {findings['num_candidates']}")
    lines.append("")
    lines.append("Interpretation (MVP-level):")
    lines.append("- Deep, continuous candidate lines usually indicate strong vitality and focus.")
    lines.append("- A high number of short contours can indicate skin texture/noise or many minor creases.")
    lines.append("- Curved candidate lines may suggest flexibility and emotional intelligence.")
    lines.append("- Straight, long candidate lines may indicate structured, logical thinking.")
    lines.append("")
    lines.append("Notes:")
    lines.append("- This tool provides a visualization + basic heuristics. It is NOT a professional palmistry diagnosis.")
    lines.append("- For reliable readings, provide a well-lit photo, dark background under the palm, no heavy shadows.")
    return basic_polish_english("\n".join(lines))

# Main runner
def main():
    ap = argparse.ArgumentParser(prog="palmistry_global_v1.py")
    ap.add_argument("-i","--input", required=True, help="Input palm photo (jpg/png)")
    ap.add_argument("-o","--out", default="palm_out.png", help="Output overlay image")
    ap.add_argument("--k", type=int, default=6, help="How many candidate lines to highlight")
    ap.add_argument("--outdir", default=".", help="Directory to write reports")
    args = ap.parse_args()

    outdir = args.outdir
    os.makedirs(outdir, exist_ok=True)
    out_image = os.path.join(outdir, os.path.basename(args.out))

    print("[..] Analyzing image:", args.input)
    findings, candidates = analyze_image_and_draw(args.input, out_image, k=args.k)
    print("[OK] Wrote overlay image:", out_image)

    # english report
    report_en = produce_english_report(findings)

    # produce translations
    reports = {}
    for code, name in LANGUAGES.items():
        try:
            text = translate_text(report_en, code)
        except Exception as e:
            text = f"[Translation error for {code}: {e}]\n\n{report_en}"
        reports[code] = {
            "language_name": name,
            "code": code,
            "report": text
        }
        # save to file
        fn = os.path.join(outdir, f"report_{code}.txt")
        with open(fn, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"[OK] Saved: {fn}")

    # combined json
    combined = {
        "findings": findings,
        "reports": {c: {"language_name": LANGUAGES[c], "report": reports[c]["report"]} for c in reports},
    }
    json_path = os.path.join(outdir, "reports_all.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
    print("[OK] Saved combined JSON:", json_path)

if __name__ == "__main__":
    main()
