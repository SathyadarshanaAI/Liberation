/* ===========================================================
   Sathyadarshana Quantum Palm Analyzer
   Module: form.js  |  Version: v2.2.1 Serenity Extension
   Purpose: Collects user input data (Name, DOB, Gender, ID)
   =========================================================== */

export function getUserData() {
  const nameEl   = document.getElementById("userName");
  const dobEl    = document.getElementById("userDOB");
  const genderEl = document.getElementById("userGender");
  const nicEl    = document.getElementById("userNIC");

  const name   = nameEl?.value.trim() || "Unknown";
  const dob    = dobEl?.value || "N/A";
  const gender = genderEl?.value || "N/A";
  const nic    = nicEl?.value.trim() || "N/A";

  // Light validation
  if (name === "Unknown") console.warn("⚠️ Name not provided.");
  if (nic === "N/A") console.warn("⚠️ NIC not provided.");
  
  // Return structured data
  return { name, dob, gender, nic };
}

/* Optional helper to reset the form after save */
export function clearUserForm() {
  ["userName", "userDOB", "userNIC", "userGender"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
