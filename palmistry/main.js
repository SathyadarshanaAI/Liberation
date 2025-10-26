const result = await analyzeAI(edges);
  renderOverlay(overlay, edges, result);
  msg.textContent = "✅ AI segmentation done. Generating report...";
  await generateReport(result);
  speak("Palm analysis complete. " + result.summary);
