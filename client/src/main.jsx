import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { PaletteProvider } from './context/PaletteContext.jsx';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/global.css';
import './styles/glass.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProgressProvider>
          <PaletteProvider>
            <App />
          </PaletteProvider>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
