import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';        // Core CSS
import 'primeicons/primeicons.css';                     // Icons
import { WebContainerProvider } from './context/WebContainerContext.tsx';
import GeminiAPI from './utils/GeminiApi.ts';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const gemini = new GeminiAPI(GEMINI_API_KEY)

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider value={{ unstyled: false }}>
    <WebContainerProvider >
      <App gemini={gemini}/>
    </WebContainerProvider>
  </PrimeReactProvider>
)
