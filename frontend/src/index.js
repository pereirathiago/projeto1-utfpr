import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroMedicao from './pages/CadastroMedicao';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Login/>
          </>
        } />
        <Route path="/home" element={
          <>
            <NavBar />
            <Home />
          </>
          } />
          <Route path="/cadastromedicao" element={
          <>
            <NavBar />
            <CadastroMedicao />
          </>
          } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
