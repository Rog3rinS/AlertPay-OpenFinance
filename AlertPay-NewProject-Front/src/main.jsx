// Arquivo: src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import StoreProvider from './Store/storeprovider.jsx';
// ... (seus outros imports React/JS) ...


// << ATENÇÃO: IMPORTAÇÕES DE CSS - ORDEM CORRETA É CRUCIAL >>
import 'react-big-calendar/lib/css/react-big-calendar.css'; // 1º: CSS base da biblioteca do calendário
import './index.css'; // 2º: Se tiver estilos globais genéricos ou resets
import './pages/Dashboard.css'; // 3º: Estilos do seu tema e do dashboard (onde estão as correções de z-index, etc.)
import './components/dashboard/Calendario.css'; // 4º: Estilos específicos do seu componente CalendarioFaturas
// ... (outros imports de CSS, se houver, seguindo a ordem de especificidade) ...


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>
);
