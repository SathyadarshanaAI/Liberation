export function renderTruth(palmReading, karmaReading) {

  const palmText =
    typeof palmReading === "object"
      ? JSON.stringify(palmReading, null, 2)
      : palmReading;

  const karmaText =
    typeof karmaReading === "object"
      ? JSON.stringify(karmaReading, null, 2)
      : karmaReading;

  return `
🔮 THE SEED — Final Palmistry Report
---------------------------------------------

🤲 Palm Reading:
${palmText}

🧘 Karma Analysis:
${karmaText}
`;
}
