import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField';
import { PrimaryButton, CreateAccountButton } from '../components/PrimaryButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate('/home'); // Token válido, redireciona
      })
      .catch((err) => {
        console.warn('Token inválido ou expirado:', err);
        // token inválido, remove do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: form.email,
      password: btoa(form.password),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/session`, formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('refreshToken', response.data.refreshToken);

      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
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
          <CreateAccountButton
            onClick={() => navigate('/cadastroUsuario')}
            texto1="Não tem uma conta?"
            texto2="Crie uma aqui!"
          />
        </form>
      </div>
    </div>
  );
}
