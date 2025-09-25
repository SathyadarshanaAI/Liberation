#!/usr/bin/env python3
"""
Palmistry Line Prototype v2
- Detects palm ridges and extracts candidate lines
- Outputs overlay image + JSON + Sinhala text report
"""

import argparse, os, cv2, numpy as np, json

def apply_clahe(gray):
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    return clahe.apply(gray)

def enhance_ridges(gray):
    thetas = [0, np.pi/6, np.pi/3, np.pi/2, 2*np.pi/3, 5*np.pi/6]
    ksize, sigma, lambd, gamma, psi = 17, 4.0, 10.0, 0.5, 0
    acc = np.zeros_like(gray, dtype=np.float32)
    for th in thetas:
        kern = cv2.getGaborKernel((ksize, ksize), sigma, th, lambd, gamma, psi, ktype=cv2.CV_32F)
        resp = cv2.filter2D(gray, cv2.CV_32F, kern)
        acc = np.maximum(acc, resp)
    return cv2.normalize(acc, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

def skeletonize(bin_img):
    img, skel = bin_img.copy(), np.zeros(bin_img.shape, np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3,3))
    while True:
        eroded = cv2.erode(img, kernel)
        opened = cv2.morphologyEx(eroded, cv2.MORPH_OPEN, kernel)
        temp = cv2.subtract(eroded, opened)
        skel = cv2.bitwise_or(skel, temp)
        img = eroded.copy()
        if cv2.countNonZero(img) == 0:
            break
    return skel

def analyze_lines(skel):
    # Fake demo analysis
    return {
        "life_line": {"status":"deep_continuous","confidence":0.92,"notes":"strong vitality"},
        "head_line": {"type":"straight","confidence":0.81},
        "heart_line": {"end":"between_index_middle","confidence":0.87},
        "fate_line": {"status":"faint","confidence":0.45}
    }

def make_report_si(analysis):
    return f"""🖐 පිරික්සුම:

➡️ ජීව රේඛාව: {analysis['life_line']['status']} (විශ්වාසය {analysis['life_line']['confidence']*100:.0f}%)
➡️ සිත/තේරුම් රේඛාව: {analysis['head_line']['type']} (විශ්වාසය {analysis['head_line']['confidence']*100:.0f}%)
➡️ හදවතේ රේඛාව: {analysis['heart_line']['end']} (විශ්වාසය {analysis['heart_line']['confidence']*100:.0f}%)
➡️ විධි රේඛාව: {analysis['fate_line']['status']} (විශ්වාසය {analysis['fate_line']['confidence']*100:.0f}%)
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-i","--input", required=True)
    ap.add_argument("-o","--out", default="out.png")
    ap.add_argument("--json", default="out.json")
    ap.add_argument("--txt", default="report_si.txt")
    ap.add_argument("--k", type=int, default=4)
    args = ap.parse_args()

    bgr = cv2.imread(args.input)
    if bgr is None:
        raise RuntimeError("Cannot read input image")

    gray = apply_clahe(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY))
    ridges = enhance_ridges(gray)
    th = cv2.adaptiveThreshold(ridges,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,31,7)
    if cv2.countNonZero(th) > th.size*0.5:
        th = cv2.bitwise_not(th)
    skel = skeletonize(th)

    # save overlay
    overlay = cv2.cvtColor(skel, cv2.COLOR_GRAY2BGR)
    cv2.imwrite(args.out, overlay)

    # fake analysis
    analysis = analyze_lines(skel)

    with open(args.json,"w") as f: json.dump(analysis,f,indent=2,ensure_ascii=False)
    with open(args.txt,"w") as f: f.write(make_report_si(analysis))

    print(f"[OK] Saved {args.out}, {args.json}, {args.txt}")

if __name__=="__main__":
    main()
