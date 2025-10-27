export async function detectLines(img){
  // 🔍 In future: apply OpenCV / AI segmentation to find main lines
  // For now: simulate line data
  return {
    life:{strength:0.9,curve:"broad"},
    head:{depth:0.8,angle:15},
    heart:{clarity:0.85,length:0.7},
    fate:{split:true,intensity:0.6},
    side:img.includes("left")?"left":"right"
  };
}
