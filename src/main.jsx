import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// A hello for anyone who opens the dev tools.
console.log(
  '%c👋 Hey there, fellow developer!%c\nThanks for peeking under the hood. Built with React, Tailwind CSS, GSAP, Lenis, Framer Motion and a little raw WebGL.\nWant to talk code? shivam2593479@gmail.com',
  'font: 600 14px system-ui; color: #ff6a3d; background: #0b0c1c; padding: 6px 10px; border-radius: 6px;',
  'font: 12px system-ui; color: inherit;',
)
