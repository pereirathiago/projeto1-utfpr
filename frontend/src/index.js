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
import Edita from './pages/EditaMedicao';

const WithNavBar = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastroUsuario" element={<CadastroUsuario />} />

        <Route path="/home" element={<WithNavBar><Home /></WithNavBar>} />
        <Route path="/cadastromedicao" element={<WithNavBar><CadastroMedicao /></WithNavBar>} />
        <Route path="/cadastrocomodo" element={<WithNavBar><CadastroComodo /></WithNavBar>} />
        <Route path="/perfil" element={<WithNavBar><ShowPerfil /></WithNavBar>} />
        <Route path="/editamedicao" element={<WithNavBar><Edita /></WithNavBar>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
