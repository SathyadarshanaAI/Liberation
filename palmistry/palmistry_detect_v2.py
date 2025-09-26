import cv2
import numpy as np
import argparse

# CLI arguments
parser = argparse.ArgumentParser()
parser.add_argument("-i", "--input", required=True, help="Input hand image")
parser.add_argument("-o", "--out", default="output.png", help="Output image")
args = parser.parse_args()

# Load image
img = cv2.imread(args.input)
if img is None:
    raise FileNotFoundError(f"❌ Cannot read image: {args.input}")

print("✅ Input image loaded:", args.input)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect edges
edges = cv2.Canny(gray, 80, 200)

# Detect lines (Hough transform)
lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=80, minLineLength=50, maxLineGap=10)

# Draw detected lines
if lines is not None:
    for line in lines:
        x1, y1, x2, y2 = line[0]
        cv2.line(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

# Save output image
cv2.imwrite(args.out, img)
print("✅ Process finished. Output saved as:", args.out)
