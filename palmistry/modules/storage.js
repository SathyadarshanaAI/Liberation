export function saveNote(note) {
  let notes = JSON.parse(localStorage.getItem("palmNotes")||"[]");
  notes.push(note);
  localStorage.setItem("palmNotes", JSON.stringify(notes));
}
export function getNotes() {
  return JSON.parse(localStorage.getItem("palmNotes")||"[]");
}
