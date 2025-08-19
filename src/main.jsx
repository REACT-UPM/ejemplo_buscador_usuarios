import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './LanguageProvider.jsx'

createRoot(document.getElementById('root')).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
)
