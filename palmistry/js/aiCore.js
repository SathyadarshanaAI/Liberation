// =====================================================
// aiCore.js — Initialize OpenCV + TensorFlow.js
// =====================================================

export async function initAI() {
  return new Promise(async (resolve) => {
    const check = setInterval(() => {
      if (window.cv && cv.Mat) {
        clearInterval(check);
        console.log("✅ OpenCV Ready");
        document.getElementById("status").textContent = "✅ OpenCV Ready";
        resolve(true);
      }
    }, 500);
  });
}
