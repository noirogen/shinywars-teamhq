import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App'


const rootDiv = document.getElementById('root');
if (!rootDiv) {
  throw new Error("React Container not found")
}

createRoot(rootDiv).render(
    <StrictMode>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </StrictMode>
)
