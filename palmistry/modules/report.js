import { translateTextAI } from "./translate.js";
import { speak } from "./voice.js";
import { saveToCloud } from "./savecloud.js";

export async function generateReport(result, lang="en", user={}){
  const { jsPDF } = window.jspdf;

  const title   = await translateTextAI("Palmistry AI Report", lang);
  const nameLbl = await translateTextAI("Name:", lang);
  const dobLbl  = await translateTextAI("Date of Birth:", lang);
  const genLbl  = await translateTextAI("Gender:", lang);
  const idLbl   = await translateTextAI("ID Number:", lang);
  const life    = await translateTextAI("Life Line:", lang);
  const head    = await translateTextAI("Head Line:", lang);
  const heart   = await translateTextAI("Heart Line:", lang);
  const fate    = await translateTextAI("Fate Line:", lang);
  const summaryT= await translateTextAI("Summary:", lang);
  const summary = await translateTextAI(result.summary, lang);

  const doc = new jsPDF();
  doc.setFont("helvetica","bold");
  doc.text(title, 10, 15);
  doc.setFont("helvetica","normal");
  doc.text(`${nameLbl} ${user.name}`, 10, 25);
  doc.text(`${dobLbl} ${user.dob}`, 10, 32);
  doc.text(`${genLbl} ${user.gender}`, 10, 39);
  doc.text(`${idLbl} ${user.nic}`, 10, 46);
  doc.text(`${life} ${result.life_line}`, 10, 60);
  doc.text(`${head} ${result.head_line}`, 10, 70);
  doc.text(`${heart} ${result.heart_line}`, 10, 80);
  doc.text(`${fate} ${result.fate_line}`, 10, 90);
  doc.text(summaryT, 10, 105);
  doc.text(summary, 10, 115, { maxWidth: 180 });

  const filename = `PalmReport_${user.name}_${lang}.pdf`;
  doc.save(filename);

  // Secure cloud save (if available)
  await saveToCloud(filename, doc.output("blob"), user);
  speak(await translateTextAI("Report saved successfully.", lang), lang);
}
