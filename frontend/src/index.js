import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroMedicao from './pages/CadastroMedicao';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroComodo from './pages/CadastroComodo';
import ShowPerfil from './pages/Perfil';

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
          <Route path="/cadastroUsuario" element={
          <>
            <CadastroUsuario />
          </>
          
          } />
          <Route path="/cadastrocomodo" element={
          <>
            <NavBar />
            <CadastroComodo />
          </>
          
          } />
          <Route path="/perfil" element={
          <>
            <NavBar />
            <ShowPerfil />
          </>
          
          } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
