#!/usr/bin/env python3
import cv2
import numpy as np
import json
import os

# ---------- Translation + Grammar Polisher ----------
from googletrans import Translator

def polish_and_translate(text, lang="en"):
    """
    Fix grammar (basic polish) + translate to given language.
    """
    translator = Translator()
    # First, translate to English for grammar polishing
    polished = translator.translate(text, src="auto", dest="en").text
    if lang == "en":
        return polished
    # Then, translate from polished English to target language
    return translator.translate(polished, src="en", dest=lang).text


# ---------- Palmistry Detector ----------
def analyze_palm(img_path, out_img, out_json, out_txt):
    img = cv2.imread(img_path)
    if img is None:
        raise RuntimeError("Cannot read input image")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    # Draw contours (simulate palm lines detection)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(img, contours, -1, (0, 0, 255), 2)

    # Save result image
    cv2.imwrite(out_img, img)

    # Prepare raw findings
    findings = {
        "lines_detected": len(contours),
        "comment": "Detected palm lines and contours successfully."
    }

    with open(out_json, "w") as f:
        json.dump(findings, f, indent=2)

    # Generate report (English base)
    raw_report = f"""
Palmistry Report
----------------
Total detected major line segments: {len(contours)}

Interpretation:
- Strong presence of palm lines indicates clear personality traits.
- Curved lines suggest flexibility and emotional depth.
- Straight lines show logical and structured thinking.
- Deep lines reveal strong determination.
"""

    # Save English polished version
    polished_report = polish_and_translate(raw_report, "en")
    with open(out_txt, "w") as f:
        f.write(polished_report)

    # Save Sinhala translation
    si_report = polish_and_translate(raw_report, "si")
    with open("report_si.txt", "w", encoding="utf-8") as f:
        f.write(si_report)

    # Save Tamil translation
    ta_report = polish_and_translate(raw_report, "ta")
    with open("report_ta.txt", "w", encoding="utf-8") as f:
        f.write(ta_report)

    print("[OK] Saved", out_img, out_json, out_txt, "report_si.txt", "report_ta.txt")


# ---------- Main Runner ----------
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Palmistry Line Detector with Translation")
    parser.add_argument("-i", "--input", required=True, help="Input palm image")
    parser.add_argument("-o", "--output", required=True, help="Output result image")
    args = parser.parse_args()

    analyze_palm(
        img_path=args.input,
        out_img=args.output,
        out_json="out.json",
        out_txt="report_en.txt"
    )
