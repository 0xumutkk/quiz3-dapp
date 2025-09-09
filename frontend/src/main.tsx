import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('MODULE_ADDRESS from env:', import.meta.env.VITE_MODULE_ADDRESS);
console.log('MODULE_ADDRESS hardcoded:', "0x9cc9a9afd4c0466f5bcdba723c02d35b7f771ed880ca75e6addb9432c77b5af9");
