import { I18N } from './modules/i18n.js';

// === Language Switch ===
function updateUI(lang){
  const ui = I18N[lang]?.ui || I18N.en.ui;
  $('title').textContent = ui.title + " V5.3";
  $('lblLanguage').textContent = ui.lang + ":";
  $('h3Left').textContent  = ui.left;
  $('h3Right').textContent = ui.right;
  $('startCamLeft').textContent = ui.start;
  $('startCamRight').textContent = ui.start;
  $('captureLeft').textContent = ui.cap;
  $('captureRight').textContent = ui.cap;
  $('torchLeft').textContent = ui.torch;
  $('torchRight').textContent = ui.torch;
  $('uploadLeft').textContent = ui.upload;
  $('uploadRight').textContent = ui.upload;
  $('analyze').textContent = ui.analyze;
  $('fullReport').textContent = ui.full;
  $('speak').textContent = ui.speak;
  setStatus(ui.ready);
}

$('language').addEventListener('change', e=>{
  const lang=e.target.value;
  localStorage.setItem('lang',lang);
  updateUI(lang);
});

const savedLang = localStorage.getItem('lang') || 'en';
$('language').value = savedLang;
updateUI(savedLang);
