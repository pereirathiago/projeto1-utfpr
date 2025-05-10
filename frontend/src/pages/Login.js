import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aqui você pode adicionar lógica de autenticação
    console.log('Formulário enviado:', form);

    // Após "login", redireciona para a página inicial
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Entrar</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="E-mail"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Senha"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <PrimaryButton type="submit">Entrar</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
