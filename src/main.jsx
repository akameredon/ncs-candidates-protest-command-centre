import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import './style.css';
createRoot(document.getElementById('root')).render(<React.StrictMode>{location.pathname.startsWith('/admin')?<Admin/>:<App/>}</React.StrictMode>);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));