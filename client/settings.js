import { languages, getLocale, setLocale, applyTranslations } from './i18n.js';

const langSelect = document.getElementById('language');
const themeSelect = document.getElementById('theme');
const backendInput = document.getElementById('backend');
const unitsSelect = document.getElementById('units');
const citySelect = document.getElementById('city');
const toggleBuses = document.getElementById('toggle-buses');

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = prefersDark ? 'dark' : 'light';
  } else {
    root.dataset.theme = theme;
  }
}

function load() {
  // populate languages
  Object.entries(languages).forEach(([code, label]) => {
    const opt = document.createElement('option');
    opt.value = code; opt.textContent = label;
    langSelect.appendChild(opt);
  });
  langSelect.value = getLocale();

  const theme = localStorage.getItem('theme') || 'dark';
  themeSelect.value = theme;
  applyTheme(theme);

  backendInput.value = localStorage.getItem('server_origin') || 'http://localhost:3619';

  unitsSelect.value = localStorage.getItem('units') || 'metric';
  citySelect.value = localStorage.getItem('city') || 'bengaluru';
  toggleBuses.checked = localStorage.getItem('show_buses') !== 'false';
}

langSelect.addEventListener('change', () => {
  setLocale(langSelect.value);
  // Re-translate current page immediately
  try { applyTranslations(); } catch (_e) {}
  alert('Language updated');
});

themeSelect.addEventListener('change', () => {
  const value = themeSelect.value;
  localStorage.setItem('theme', value);
  applyTheme(value);
});

backendInput.addEventListener('change', () => {
  const url = backendInput.value.trim();
  if (!/^https?:\/\//.test(url)) { alert('Enter a valid http(s) URL'); return; }
  localStorage.setItem('server_origin', url);
  alert('Backend URL saved');
});

load();

// Apply translations in settings page too
try { applyTranslations(); } catch (_e) {}

unitsSelect.addEventListener('change', ()=>{
  localStorage.setItem('units', unitsSelect.value);
});
citySelect.addEventListener('change', ()=>{
  localStorage.setItem('city', citySelect.value);
});
toggleBuses.addEventListener('change', ()=>{
  localStorage.setItem('show_buses', String(toggleBuses.checked));
});


