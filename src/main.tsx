import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';        // Core CSS
import 'primeicons/primeicons.css';                     // Icons
import { WebContainerProvider } from './context/WebContainerContext.tsx';
// import GeminiAPI from './utils/GeminiApi.ts';
import GeminiApiProvider from './context/GeminiApiProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider value={{ unstyled: false }}>
    <WebContainerProvider >
      <GeminiApiProvider>
        <App />
      </GeminiApiProvider>
    </WebContainerProvider>
  </PrimeReactProvider>
)
