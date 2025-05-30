import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ShowPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPerfil(response.data);
        setForm({ name: response.data.name, email: response.data.email, password: '' });
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar perfil.');
        setLoading(false);
      });
  }, [navigate, token]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      await axios.patch(`${process.env.REACT_APP_API_URL}/users/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPerfil(response.data);
    } catch (error) {
      setErro('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = () => setEditando(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      ...form
    };

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users`, dados, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPerfil(response.data);
      setEditando(false);
      setForm(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setErro('Erro ao atualizar perfil.');
    }
  };


  if (loading) {
    return <div className="p-6 text-center text-gray-700">Carregando perfil...</div>;
  }

  if (erro) {
    return <div className="p-6 text-center text-red-600">{erro}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md text-center">
        <div className="relative mb-4">
          <img
            src={
              perfil.avatarUrl && perfil.avatarUrl !== '/avatar/null'
                ? `http://localhost:3333${perfil.avatarUrl}`
                : 'https://avatar.iran.liara.run/public'
            }
            alt="Avatar"
            className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gray-300 cursor-pointer hover:opacity-80 transition"
            onClick={handleAvatarClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {uploading && <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>}
        </div>

        {editando ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome"
              className="w-full border rounded p-2"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
              className="w-full border rounded p-2"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nova senha (opcional)"
              className="w-full border rounded p-2"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{perfil.name}</h2>
            <p className="text-gray-600 mb-4">{perfil.email}</p>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Editar Perfil
            </button>
          </>
        )}
      </div>
    </div>
  );
}
