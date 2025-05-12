import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ShowPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    axios.get('http://localhost:3333/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPerfil(response.data);
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar perfil.');
        setLoading(false);
      });
  }, [navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      await axios.patch('http://localhost:3333/users/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Após sucesso no upload, atualiza o perfil
      const response = await axios.get('http://localhost:3333/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPerfil(response.data);
    } catch (error) {
      setErro('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
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
                : 'https://via.placeholder.com/150?text=Avatar'
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
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{perfil.name}</h2>
        <p className="text-gray-600 mb-4">{perfil.email}</p>
      </div>
    </div>
  );
}
