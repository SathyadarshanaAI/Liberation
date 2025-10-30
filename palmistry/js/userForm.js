export function saveUser(){
 const n=userName.value.trim(),d=userDOB.value,t=userTime.value,p=userPlace.value.trim(),
       g=userGender.value,f=userFocus.value;
 if(!n||!d||!p){userStatus.textContent="⚠️ Please fill all required fields.";return;}
 localStorage.setItem("userData",JSON.stringify({n,d,t,p,g,f}));
 userStatus.textContent="✅ Information saved!";
}
export function clearUser(){
 localStorage.removeItem("userData");
 userStatus.textContent="🧹 Cleared.";
}
export function loadUser(){
 const data=localStorage.getItem("userData");
 if(!data)return;
 const u=JSON.parse(data);
 userName.value=u.n;userDOB.value=u.d;userTime.value=u.t;
 userPlace.value=u.p;userGender.value=u.g;userFocus.value=u.f;
 userStatus.textContent="🔹 Loaded previous data.";
}
