// userForm.js — handles user info Save/Clear in localStorage

export function handleUserForm() {
  const $ = id => document.getElementById(id);
  const name = $("userName");
  const dob = $("userDOB");
  const time = $("userTime");
  const place = $("userPlace");
  const gender = $("userGender");
  const focus = $("userFocus");
  const status = $("userStatus");
  const saveBtn = $("saveBtn");
  const clearBtn = $("clearBtn");

  // 🧠 Load previous data if exists
  const stored = JSON.parse(localStorage.getItem("userInfo"));
  if (stored) {
    name.value = stored.name || "";
    dob.value = stored.dob || "";
    time.value = stored.time || "";
    place.value = stored.place || "";
    gender.value = stored.gender || "Male";
    focus.value = stored.focus || "Career";
    status.textContent = "🔁 Previous data loaded.";
  }

  // 💾 Save
  saveBtn.onclick = () => {
    const data = {
      name: name.value,
      dob: dob.value,
      time: time.value,
      place: place.value,
      gender: gender.value,
      focus: focus.value
    };
    localStorage.setItem("userInfo", JSON.stringify(data));
    status.textContent = "✅ Data saved successfully!";
  };

  // 🧹 Clear
  clearBtn.onclick = () => {
    localStorage.removeItem("userInfo");
    name.value = dob.value = time.value = place.value = "";
    gender.value = "Male";
    focus.value = "Career";
    status.textContent = "🧹 Cleared all data.";
  };
}
