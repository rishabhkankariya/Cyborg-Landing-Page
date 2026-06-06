import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// On-screen error logger for headless debugging
window.addEventListener('error', (e) => {
  const div = document.createElement('div');
  div.className = 'debug-error-panel';
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.background = 'red';
  div.style.color = 'white';
  div.style.zIndex = '9999999';
  div.style.padding = '15px';
  div.style.fontFamily = 'monospace';
  div.style.fontSize = '13px';
  div.style.whiteSpace = 'pre-wrap';
  div.innerText = 'UNCAUGHT ERROR: ' + e.message + '\n' + (e.error ? e.error.stack : '');
  document.body.appendChild(div);
});

const origError = console.error;
console.error = (...args) => {
  origError.apply(console, args);
  const text = args.map(arg => {
    if (arg instanceof Error) return arg.stack;
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
    }
    return String(arg);
  }).join(' ');
  
  // Ignore deprecation or non-critical warnings if they are sent to console.error
  if (text.includes('THREE.Clock') || text.includes('Content-Security-Policy')) return;

  const div = document.createElement('div');
  div.className = 'debug-console-error';
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.background = 'darkred';
  div.style.color = 'white';
  div.style.zIndex = '9999999';
  div.style.padding = '15px';
  div.style.fontFamily = 'monospace';
  div.style.fontSize = '13px';
  div.style.whiteSpace = 'pre-wrap';
  div.innerText = 'CONSOLE ERROR: ' + text;
  document.body.appendChild(div);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

