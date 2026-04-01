import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Toaster } from 'react-hot-toast';

<Toaster position="top-right" />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
